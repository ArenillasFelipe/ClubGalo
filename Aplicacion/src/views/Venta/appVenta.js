const venta_controller = require('../../controllers/venta_controller');
const bolsa_controller = require('../../controllers/bolsa_controller');
const mascota_controller = require('../../controllers/mascota_controller');
const cliente_controller = require('../../controllers/cliente_controller');

const { Venta } = require('../../models/ventaModel');
const sweetAlerts = require('../../utils/sweetAlerts');
const calcularDias = require('../../utils/calcularDias');

let inputCliente = document.getElementById("inputCliente");
inputCliente.focus();

const formCliente = document.getElementById("form-ingreso");

formCliente.addEventListener('submit', (e) => {
    e.preventDefault();

    MainFunctionVenta();

})

const MainFunctionVenta = async () => {


    //obtengo el cliente segun lo ingresado en el input
    let cliente
    try {
        cliente = await cliente_controller.getClienteSegunBusqueda(inputCliente.value);
    } catch (error) {
        console.log(error)
        if (error.message == "variosClientes") {
            await sweetAlerts.variosClientes();
            return
        }
        if (error.message == "noExisteCliente") {
            await sweetAlerts.noSeDetectoCliente();
            return
        }
    }
    ///////////////////////////////////////////


    //obtengo las mascotas del cliente
    let mascotas = await mascota_controller.getMascotasByIdCliente(cliente.id_cliente);
    //////////////////////////////////////////////////


    //obtengo las ultimas 20 ventas del cliente
    let historialVentasConBolsas;
    try {
        historialVentasConBolsas = await venta_controller.get20UltimasVentasByIdCliente(cliente.id_cliente);
    } catch (error) {
        if (error.message == "sinVentas") {
            //TODO: poner texto sin ventas en historial de ventas
            console.log("no trajo ninguna venta");
        }
    }
    ////////////////////////////////////////////////////

    console.log(cliente, mascotas, historialVentasConBolsas);


    //llamo a la funcion para rellenar la pantalla a partir de los datos obtenidos
    innerCliente(cliente, mascotas, historialVentasConBolsas);
    //////////////////////////////////////////////////////////////

    //llamo a la funcion para traer las ventas activas(a las que se les esta realizando seguimiento) del cliente
    let ventasActivas = venta_controller.getVentasActivasByIdCliente(cliente.id_cliente);
    ///////////////////////////////////////////////////////////////////////////////////////////


    //creo el listener del select para ver los datos de las mascotas
    select = document.getElementById("select-mascota");
    select.addEventListener('change', () => {
        mostrarDatos(mascotas);
    });
    ////////////////////////////////////////////////////////////





    //Creo el listener para cuando se presiona ejecutar la venta
    formVenta = document.getElementById("form-venta");
    formVenta.addEventListener('submit', (e) => {
        e.preventDefault();

        venta(cliente, mascotas);

    })
    ///////////////////////////////////////////



    mainVentasActivasCliente(cliente.id_cliente);


}










formCliente.addEventListener('reset', (e) => {
    e.preventDefault();


    let mascota = document.getElementById("mascota");
    let agregado = document.getElementById("agregado");
    let inputCliente = document.getElementById("inputCliente");
    let divVentasActivas = document.getElementById("ventasActivas");


    mascota.innerHTML = "";
    agregado.innerHTML = "";
    inputCliente.value = "";
    divVentasActivas.innerHTML = "";

})



function mostrarDatos(mascotas) {
    let select = document.getElementById("select-mascota");
    console.log("valor select:", select.value);
    let idBusqueda = select.value;
    let mascota = mascotas.find(mascota => mascota.id_mascota == idBusqueda);

    let mostrandoDatos = document.getElementById("mostrando-datos");

    mostrandoDatos.innerHTML = ""
    mostrandoDatos.innerHTML +=
        `<p><b>Animal:</b> ` + mascota.animal + `</p>
    <p><b>Raza:</b> ` + mascota.raza + `</p>
    <p><b>Peso:</b> ` + mascota.peso + `</p>
    <p><b>Edad:</b> ` + mascota.edad + `</p>
    <p><b>Actividad:</b> ` + mascota.actividad + `</p>
    <p><b>Afecciones:</b> ` + mascota.afecciones + `</p>
    <p><b>Cumpleaños:</b> ` + mascota.nacimiento + `</p>`



}





async function venta(cliente, mascotas) {
    try {
    precio = document.getElementById("inputprecio");
    marca_bolsa = document.getElementById('input-marca');
    if(bolsaSeleccionada.marca_bolsa != marca_bolsa.value) throw new Error(); 
    cantbolsas = document.getElementById("inputcantbolsas");
    let mascotasVenta = [];
        console.log(bolsaSeleccionada);
    let newVenta = new Venta(new Date(), precio.value, cliente.id_cliente, cantbolsas.value, bolsaSeleccionada.id_bolsa_kilo, bolsaSeleccionada.marca_bolsa, bolsaSeleccionada.kilos_bolsa, bolsaSeleccionada.calidad_bolsa, true);

    mascotas.forEach(element => {

        checks = document.getElementById(element.nombremascota);

        if (checks.checked) {
            mascotasVenta.push(element.id_mascota);
        }

    });

    if (mascotasVenta.length == 0) {

        await sweetAlerts.sweetAlertSeleccionMascota();
        return

    }

    
        await venta_controller.insertarVenta(newVenta, mascotasVenta);
        await sweetAlerts.sweetAlertVentaExitosa();
        location.reload();
    } catch (error) {
        console.log(error);
        await sweetAlerts.sweetAlertErrorDesconocidoVenta();
    }






}




////////////////////////////////INNERS//////////////////////////////////////////////////////////
function innerCliente(cliente, mascotas, historialVentasConBolsas) {

    agregado = document.getElementById("agregado");
    ingreso = document.getElementById("mascota");


    ingreso.innerHTML = "";
    ingreso.innerHTML +=
        `<div class="datos-mascota">
<div class="imagen-perro">
<img src="../../imagenes/perro-gato.png" width="120">
</div>
<div class="seleccion-mascota" id="seleccion-mascota">
</div>
<div class="mostrar-datos">
<form>
<label for="selectmascota">Mostrando datos de:</label>
<select name="selectmascota" class="select-mascota" id="select-mascota">
</select>
</form>
</div>
<div class="mostrando-datos" id="mostrando-datos">
</div>
</div>





<div class="huellas">
<img src="../../imagenes/huellas.png" width="40">
</div>`


    agregado.innerHTML = "";
    agregado.innerHTML +=
        `    <div class="container-cliente" id="container-cliente">

<div class="datos-cliente">
<h2 class="h2cliente">Datos del Cliente</h2>
<p><b>Nombre:</b> ` + cliente.primernombre + ` ` + cliente.nombrepila + ` ` + cliente.apellido + `</p>
<p><b>Telefono:</b> ` + cliente.telefono + `</p>
<p><b>Direccion:</b> ` + cliente.calle + ` ` + cliente.calle_numero + `</p>
<p><b>Puntos:</b><span id="spanPuntos"> ` + cliente.puntos + `<div id="divBotonRestarPuntos"><button id="btnRestarPuntos" onclick="botonRestarPuntos(${cliente.id_cliente})"><img src="../../imagenes/signoMenos.png" id="imgSignoMenos"></button></div></span></p>
<div id="divInputRestarPuntos"></div>
<br>
<h3>Historial de compras</h3>
<div class="historial" id="historial">
</div>






</div>




</div>

<div class="container-venta" id="container-venta">
<div class="datos-venta">
<h2 class="h2venta">Venta</h2>
<br>
<br>
<br>
<br>
<br>
<form class="form-venta" id="form-venta" autocomplete="off">
<p class="pbolsa"> <b>Seleccionar Bolsa:</b> </p>
      <div class="container-input-marca">
        <input type="text" required id="input-marca" placeholder="Escriba el nombre de la bolsa..." />
      <ul class="list"></ul>
      </div>
<div class="container-selectkilos">
<label for="selectkilos"><b>Kg:</b></label>
<select name="selectkilos" class="selectkilos" id="selectkilos">
    </select>
</div>

<p class="pprecio">Precio de venta: $<input type="number" step="0.01" class="inputprecio" id="inputprecio" required></p>
<p class="pcantbolsas">Cantidad de bolsas: <input type="number" class="inputcantbolsas" id="inputcantbolsas" value="1" required></p>
<button class="btn-borrar" id="btn-borrar-venta" type="reset">Borrar</button>
<button class="btn-ejecutar" type="submit">Ejecutar</button>

</form>
</div>





</div>`


    btn_borrar_venta = document.getElementById("btn-borrar-venta");
    btn_borrar_venta.addEventListener('click', (e) => {

        //clear all the item
        selectKG = document.getElementById("selectkilos");
        selectKG.innerHTML = "";
        let items = document.querySelectorAll(".list-items");
        items.forEach((item) => {
            item.remove();
        });

    })


    rellenarDatos(mascotas, historialVentasConBolsas);

}

function rellenarDatos(mascotas, historialVentasConBolsas) {

    select = document.getElementById("select-mascota");
    seleccionMascota = document.getElementById("seleccion-mascota");
    mascotas.forEach(element => {
        select.innerHTML += `<option value="` + element.id_mascota + `">` + element.nombremascota + `</option>`
        seleccionMascota.innerHTML += `<input type="checkbox" value="1" class="checkbox" id="` + element.nombremascota + `">` + element.nombremascota + `<br>`

    });
    console.log("historial vetnas: ", historialVentasConBolsas);
    if (historialVentasConBolsas) {
        var divHistorial = document.getElementById("historial");

        historialVentasConBolsas.forEach(element => {
            divHistorial.innerHTML += `<div><p> ${element.marca_bolsa} ${element.kilos_bolsa}kg (${element.calidad_bolsa})</p></div>`
        });

    }

    mostrarDatos(mascotas);
    inputBolsas();

}

let bolsaSeleccionada;

async function inputBolsas() {
    let bolsas = await bolsa_controller.getAllBolsasOrdenadas();
    console.log(bolsas);
    let input = document.getElementById("input-marca");

    input.addEventListener("keyup", (e) => {
        //loop through above array
        //Initially remove all elements ( so if user erases a letter or adds new letter then clean previous outputs)
        removeElements();
        bolsas.forEach((bolsa) => {
            let marcaBolsa = bolsa.marca_bolsa;
            //convert input to lowercase and compare with each string
            if (
                marcaBolsa.toLowerCase().startsWith(input.value.toLowerCase()) &&
                input.value != ""
            ) {
                //create li element
                let listItem = document.createElement("li");
                //One common class name
                listItem.classList.add("list-items");
                listItem.style.cursor = "pointer";
                listItem.addEventListener("click", () => displayNames(bolsa));
                //Display matched part in bold
                let word = "<b>" + marcaBolsa.substr(0, input.value.length) + "</b>";
                word += marcaBolsa.substr(input.value.length);
                //display the value in array
                listItem.innerHTML = word;
                document.querySelector(".list").appendChild(listItem);
            }
        });
    });
    function displayNames(bolsa) {
        input.value = bolsa.marca_bolsa;
        bolsaSeleccionada = bolsa
        actualizarKgBolsa();
        removeElements();
    }
    function removeElements() {
        //clear all the item
        selectKG = document.getElementById("selectkilos");
        selectKG.innerHTML = "";
        let items = document.querySelectorAll(".list-items");
        items.forEach((item) => {
            item.remove();
        });
    }
}






async function actualizarKgBolsa() {

    let kgBolsa = await bolsa_controller.getKilosBolsaByIdBolsa(bolsaSeleccionada.id_bolsa);
    console.log(kgBolsa);
    selectKG = document.getElementById("selectkilos");

    selectKG.innerHTML = ""

    kgBolsa.forEach(element => {
        selectKG.innerHTML += `<option value="` + element.kilos_bolsa + `">` + element.kilos_bolsa + `</option>`
    })

    bolsaSeleccionada.kilos_bolsa = selectKG.value;
    listenerSelectKG();

}

function listenerSelectKG() {
        selectKG = document.getElementById("selectkilos");
        selectKG.addEventListener('change', (e) => {
        e.preventDefault();

        bolsaSeleccionada.kilos_bolsa = selectKG.value;

    })
}


function botonRestarPuntos(id_cliente) {

    let divInputRestarPuntos = document.getElementById("divInputRestarPuntos");
    let divBotonRestarPuntos = document.getElementById("divBotonRestarPuntos");

    divBotonRestarPuntos.innerHTML = "";
    divInputRestarPuntos.innerHTML = `<form id="formRestarPuntos"><input type="number" id="inputRestarPuntos" placeholder="Restar..." required><button type="submit" id="confirmarRestarPuntos"><img src="../../imagenes/tick.png" id="imgTick"></button><button type="reset" id="cancelarRestarPuntos"><img src="../../imagenes/cruz_negra.png" id="imgCruz_negra"></button></form>`;

    listenerFormRestarPuntos(id_cliente);
    listenerFormCancelarRestarPuntos(id_cliente);

}

function listenerFormRestarPuntos(id_cliente) {

    formRestarPuntos = document.getElementById("formRestarPuntos");
    formRestarPuntos.addEventListener('submit', (e) => {
        e.preventDefault();

        confirmarRestarPuntos(id_cliente);

    })

}

function listenerFormCancelarRestarPuntos(id_cliente) {

    formRestarPuntos = document.getElementById("formRestarPuntos");
    formRestarPuntos.addEventListener('reset', (e) => {
        e.preventDefault();

        cancelarRestarPuntos(id_cliente);

    })

}

async function confirmarRestarPuntos(id_cliente) {

    let inputRestarPuntos = document.getElementById("inputRestarPuntos");
    let divInputRestarPuntos = document.getElementById("divInputRestarPuntos");
    let divBotonRestarPuntos = document.getElementById("divBotonRestarPuntos");
    let spanPuntos = document.getElementById("spanPuntos");
    let nuevosPuntos = await cliente_controller.restarPuntosCliente(spanPuntos.textContent.trim(), inputRestarPuntos.value, id_cliente);

    spanPuntos.innerHTML = ` ${nuevosPuntos}`;

    divInputRestarPuntos.innerHTML = "";
    divBotonRestarPuntos.innerHTML = `<button id="btnRestarPuntos" onclick="botonRestarPuntos(${id_cliente})"><img src="../../imagenes/signoMenos.png" id="imgSignoMenos"></button>`;

}


function cancelarRestarPuntos(id_cliente) {

    let divInputRestarPuntos = document.getElementById("divInputRestarPuntos");
    let divBotonRestarPuntos = document.getElementById("divBotonRestarPuntos");
    divInputRestarPuntos.innerHTML = "";
    divBotonRestarPuntos.innerHTML = `<button id="btnRestarPuntos" onclick="botonRestarPuntos(${id_cliente})"><img src="../../imagenes/signoMenos.png" id="imgSignoMenos"></button>`;

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


async function mainVentasActivasCliente(id_cliente) {
    let ventasActivas = await venta_controller.getVentasActivasByIdCliente(id_cliente);
    console.log("Ventas activas:", ventasActivas);
    renderVentasActivas(ventasActivas);
}


function renderVentasActivas(ventasActivas) {

    let divVentasActivas = document.getElementById("ventasActivas");

    divVentasActivas.innerHTML = "";

    ventasActivas.forEach(element => {

        let dias = calcularDias.calcularDiasEntreFechaActualYFecha(element.venta.fecha);

        divVentasActivas.innerHTML += ` <div class="container-ventaActiva">
        <div class="fecha">
            <h2><b>Comprado hace ${dias} dias</b></h2>
        </div>

        <div class="container-datos-mascotas">

            <div class="datos-ventaActiva">
                <h3 class="h3Bolsa"><b>Bolsa: </b>${element.venta.marca_bolsa}</h3>
                <h3 class="h3Cantidad"><b>Cantidad: </b>${element.venta.cantidad} bolsa/s de ${element.venta.kilos_bolsa}kg</h3>
            </div>

            <div class="mascotas" id="divMascotasVentaActiva${element.venta.id_venta}">
                <b>Mascotas:</b>
            </div>

            <div class="estadoBolsa">
                <b>Estado:</b> Quedan 20kg en total (Quedan 230 dias)
            </div>

        </div>

    </div>`

        let mascotasVentaActiva = element.mascotas;
        divMascotasVentaActiva = "divMascotasVentaActiva" + element.venta.id_venta;
        divMascotasVentaActiva = document.getElementById(divMascotasVentaActiva);

        mascotasVentaActiva.forEach(elemento => {
            divMascotasVentaActiva.innerHTML += ` ${elemento.nombremascota} -`
        });



    });

}


