const controller = require('../../controllers/venta_controller');
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
        cliente = await controller.get20ClientesBySearch(inputCliente.value);
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
    let mascotas = await controller.getMascotasByIdCliente(cliente.id_cliente);
    //////////////////////////////////////////////////


    //obtengo las ultimas 20 ventas del cliente
    let historialVentasConBolsas;
    try {
        historialVentasConBolsas = await controller.get20UltimasVentasByIdCliente(cliente.id_cliente);
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
    let ventasActivas = controller.getVentasActivasByIdCliente(cliente.id_cliente);
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

    precio = document.getElementById("inputprecio");
    cantbolsas = document.getElementById("inputcantbolsas");
    let mascotasVenta = [];

    console.log("bolsaSeleccionada:", bolsaSeleccionada);
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

    try {
        await controller.ejecutarVenta(newVenta, mascotasVenta);
        await sweetAlerts.sweetAlertVentaExitosa();
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
<p><b>Puntos:</b><span id="spanPuntos"> ` + cliente.puntos + `<div id="divBotonRestarPuntos"><button id="btnRestarPuntos" onclick="botonRestarPuntos()"><img src="../../imagenes/signoMenos.png" id="imgSignoMenos"></button><button id="btnSumarPuntos" onclick="botonSumarPuntos()"><img src="../../imagenes/signo_mas.png" id="imgSignoMas"></button></div></span></p>
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
            divHistorial.innerHTML += `<div><p> ${element.bolsa.marca_bolsa} ${element.bolsaKilo.kilos_bolsa}kg (${element.bolsa.calidad_bolsa})</p></div>`
        });

    }

    mostrarDatos(mascotas);
    inputBolsas();

}


let bolsaSeleccionada;

async function inputBolsas() {
    let bolsas = await controller.getAllBolsasOrdenadas();
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
        bolsaSeleccionada = bolsa;
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

    let kgBolsa = await controller.getKilosBolsaByIdBolsa(bolsaSeleccionada.id_bolsa);
    console.log(kgBolsa);
    selectKG = document.getElementById("selectkilos");

    selectKG.innerHTML = ""

    kgBolsa.forEach(element => {
        selectKG.innerHTML += `<option value="` + element.kilos_bolsa + `">` + element.kilos_bolsa + `</option>`
    });
    bolsaSeleccionada.kilos_bolsa = selectKG.value;
    listenerSelectKilosBolsa();

}

function listenerSelectKilosBolsa() {
    selectKG = document.getElementById("selectkilos");
    selectKG.addEventListener('change', () => {
        bolsaSeleccionada.kilos_bolsa = selectKG.value;
    });
}



function botonRestarPuntos() {

    let divInputRestarPuntos = document.getElementById("divInputRestarPuntos");
    let divBotonRestarPuntos = document.getElementById("divBotonRestarPuntos");

    divBotonRestarPuntos.innerHTML = "";
    divInputRestarPuntos.innerHTML = `<form id="formRestarPuntos"><input type="number" id="inputRestarPuntos" placeholder="Restar..." required><button type="submit" id="confirmarRestarPuntos"><img src="../../imagenes/tick.png" id="imgTick"></button><button type="reset" id="cancelarRestarPuntos"><img src="../../imagenes/cruz_negra.png" id="imgCruz_negra"></button></form>`;

    listenerFormRestarPuntos();
    listenerFormCancelarRestarPuntos();

}

function listenerFormRestarPuntos() {

    formRestarPuntos = document.getElementById("formRestarPuntos");
    formRestarPuntos.addEventListener('submit', (e) => {
        e.preventDefault();

        confirmarRestarPuntos();

    })

}

function listenerFormCancelarRestarPuntos() {

    formRestarPuntos = document.getElementById("formRestarPuntos");
    formRestarPuntos.addEventListener('reset', (e) => {
        e.preventDefault();

        cancelarRestarPuntos();

    })

}

async function confirmarRestarPuntos() {

    let inputRestarPuntos = document.getElementById("inputRestarPuntos");
    let divInputRestarPuntos = document.getElementById("divInputRestarPuntos");
    let divBotonRestarPuntos = document.getElementById("divBotonRestarPuntos");
    let spanPuntos = document.getElementById("spanPuntos");

    let nuevosPuntos = await restarPuntosClienteById(cliente.id_cliente, inputRestarPuntos.value, cliente.puntos);

    spanPuntos.innerHTML = ` ${nuevosPuntos}`;
    cliente.puntos = nuevosPuntos;

    divInputRestarPuntos.innerHTML = "";
    divBotonRestarPuntos.innerHTML = `<button id="btnRestarPuntos" onclick="botonRestarPuntos()"><img src="../../imagenes/signoMenos.png" id="imgSignoMenos"></button><button id="btnSumarPuntos" onclick="botonSumarPuntos()"><img src="../../imagenes/signo_mas.png" id="imgSignoMas"></button>`;


}

function cancelarRestarPuntos() {

    let divInputRestarPuntos = document.getElementById("divInputRestarPuntos");
    let divBotonRestarPuntos = document.getElementById("divBotonRestarPuntos");
    divInputRestarPuntos.innerHTML = "";
    divBotonRestarPuntos.innerHTML = `<button id="btnRestarPuntos" onclick="botonRestarPuntos()"><img src="../../imagenes/signoMenos.png" id="imgSignoMenos"></button><button id="btnSumarPuntos" onclick="botonSumarPuntos()"><img src="../../imagenes/signo_mas.png" id="imgSignoMas"></button>`;

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function botonSumarPuntos() {

    let divInputSumarPuntos = document.getElementById("divInputRestarPuntos");
    let divBotonSumarPuntos = document.getElementById("divBotonRestarPuntos");

    divBotonSumarPuntos.innerHTML = "";
    divInputSumarPuntos.innerHTML = `<form id="formSumarPuntos"><input type="number" id="inputSumarPuntos" placeholder="Sumar..." required><button type="submit" id="confirmarSumarPuntos"><img src="../../imagenes/tick.png" id="imgTick"></button><button type="reset" id="cancelarSumarPuntos"><img src="../../imagenes/cruz_negra.png" id="imgCruz_negra"></button></form>`;

    listenerFormSumarPuntos();
    listenerFormCancelarSumarPuntos();

}

function listenerFormSumarPuntos() {

    formSumarPuntos = document.getElementById("formSumarPuntos");
    formSumarPuntos.addEventListener('submit', (e) => {
        e.preventDefault();

        confirmarSumarPuntos();

    })

}

function listenerFormCancelarSumarPuntos() {

    formSumarPuntos = document.getElementById("formSumarPuntos");
    formSumarPuntos.addEventListener('reset', (e) => {
        e.preventDefault();

        cancelarSumarPuntos();

    })

}

async function confirmarSumarPuntos() {

    let inputSumarPuntos = document.getElementById("inputSumarPuntos");
    let divInputSumarPuntos = document.getElementById("divInputRestarPuntos");
    let divBotonSumarPuntos = document.getElementById("divBotonRestarPuntos");
    let spanPuntos = document.getElementById("spanPuntos");

    let nuevosPuntos = await sumarPuntosClienteById(cliente.id_cliente, inputSumarPuntos.value, cliente.puntos);

    spanPuntos.innerHTML = ` ${nuevosPuntos}`;
    cliente.puntos = nuevosPuntos;

    divInputSumarPuntos.innerHTML = "";
    divBotonSumarPuntos.innerHTML = `<button id="btnRestarPuntos" onclick="botonRestarPuntos()"><img src="../../imagenes/signoMenos.png" id="imgSignoMenos"></button><button id="btnSumarPuntos" onclick="botonSumarPuntos()"><img src="../../imagenes/signo_mas.png" id="imgSignoMas"></button>`;


}

function cancelarSumarPuntos() {

    let divInputSumarPuntos = document.getElementById("divInputRestarPuntos");
    let divBotonSumarPuntos = document.getElementById("divBotonRestarPuntos");
    divInputSumarPuntos.innerHTML = "";
    divBotonSumarPuntos.innerHTML = `<button id="btnRestarPuntos" onclick="botonRestarPuntos()"><img src="../../imagenes/signoMenos.png" id="imgSignoMenos"></button><button id="btnSumarPuntos" onclick="botonSumarPuntos()"><img src="../../imagenes/signo_mas.png" id="imgSignoMas"></button>`;

}


async function mainVentasActivasCliente(id_cliente) {
    let ventasActivas = await controller.getVentasActivasByIdCliente(id_cliente);
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
                <h3 class="h3Bolsa"><b>Bolsa: </b>${element.bolsa.marca_bolsa}</h3>
                <h3 class="h3Cantidad"><b>Cantidad: </b>${element.venta.cantidad} bolsa/s de ${element.bolsaKilo.kilos_bolsa}kg</h3>
            </div>

            <div class="mascotas" id="divMascotasVentaActiva${element.venta.id_venta}">
                <b>Mascotas:</b>
            </div>

            <div class="estadoBolsa">
                <b>Estado:</b> Quedan 20kg en total (Quedan 230 dias)
            </div>

        </div>

    </div>`

        let mascotasVentaActiva = element.mascotas.mascotas;
        divMascotasVentaActiva = "divMascotasVentaActiva" + element.venta.id_venta;
        divMascotasVentaActiva = document.getElementById(divMascotasVentaActiva);

        mascotasVentaActiva.forEach(elemento => {
            divMascotasVentaActiva.innerHTML += ` ${elemento.nombremascota} -`
        });



    });

}



