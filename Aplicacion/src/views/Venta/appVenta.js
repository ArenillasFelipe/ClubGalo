const venta_controller = require('../../controllers/venta_controller');
const bolsa_controller = require('../../controllers/bolsa_controller');
const mascota_controller = require('../../controllers/mascota_controller');
const cliente_controller = require('../../controllers/cliente_controller');
const { remote } = require('electron');
const main = remote.require('./main');
const { Venta } = require('../../models/ventaModel');
const calcularFechas = require('../../utils/calcularFechas');
const { reemplazarComa } = require('../../utils/palabras');


let cliente;
let nuevosPuntos;
let kilosPrevios = 0;
let marcaPrevia;
let calidadPrevia;

const formCliente = document.getElementById("form-ingreso");
let inputCliente = document.getElementById("inputCliente");

focusInputCliente();


formCliente.addEventListener('submit', (e) => {
    e.preventDefault();

    MainFunctionVenta();

})

let checkboxBusquedaMascota = document.getElementById('checkboxBusquedaMascota');

// Agrega un listener al checkbox para escuchar el evento 'click'
checkboxBusquedaMascota.addEventListener('click', function () {
    if (checkboxBusquedaMascota.checked) {
        inputCliente.placeholder = 'Nombre de la mascota';
    } else {
        inputCliente.placeholder = 'Nº, nombre, direccion o telefono';
    }
});

async function actualizarVentasVencidas() {
    await venta_controller.actualizarVentasVencidas();
}


const MainFunctionVenta = async () => {

    await actualizarVentasVencidas();


    //obtengo el cliente segun lo ingresado en el input

    try {

        let checkboxBusquedaMascota = document.getElementById("checkboxBusquedaMascota");

        cliente = await cliente_controller.getClienteSegunBusqueda(inputCliente.value, checkboxBusquedaMascota.checked);
    } catch (error) {
        console.log(error)

        if (error.message == "variosClientes") {
            await variosClientesModal.show();
            setTimeout(function () {
                focusInputCliente();
            }, 100);
            return
        }
        if (error.message == "noExisteCliente") {
            await noSeDetectoClienteModal.show();
            setTimeout(function () {
                focusInputCliente();
            }, 100);
            return
        }

    }
    ///////////////////////////////////////////

    nuevosPuntos = cliente.puntos;

    let divIngreso = document.getElementById("ingreso");
    divIngreso.classList.add('ampliado');

    //obtengo las mascotas del cliente
    let mascotas = await mascota_controller.getMascotasByIdCliente(cliente.id_cliente);
    //////////////////////////////////////////////////


    //obtengo las ultimas 20 ventas del cliente
    let historialVentasConBolsas;
    try {
        historialVentasConBolsas = await venta_controller.get20UltimasVentasByIdCliente(cliente.id_cliente);
    } catch (error) {
        console.log(error);
    }
    ////////////////////////////////////////////////////



    //llamo a la funcion para rellenar la pantalla a partir de los datos obtenidos
    innerCliente(mascotas, historialVentasConBolsas);
    //////////////////////////////////////////////////////////////

    //creo el listener para que no te deje seleccionar gatos y perros para comer de la misma bolsa
    listenerCheckboxesMascotas(mascotas);
    ///////////////////////////////////////////////////////


    //creo el listener del select para ver los datos de las mascotas
    select = document.getElementById("select-mascota");
    select.addEventListener('change', () => {
        mostrarDatos(mascotas);
    });
    ////////////////////////////////////////////////////////////

    //funcion para que si una de las mascotas cumple anios se muestre primero
    comprobarCumpleanios(mascotas);


    //Creo el listener para cuando se presiona ejecutar la venta
    formVenta = document.getElementById("form-venta");
    formVenta.addEventListener('submit', (e) => {
        e.preventDefault();

        venta(cliente, mascotas);

    })
    ///////////////////////////////////////////



    mainVentasActivasCliente(cliente.id_cliente);


}

function comprobarCumpleanios(mascotas) {

    mascotas.forEach(mascota => {

        let diasParaCumple = calcularFechas.diasParaCumpleaños(mascota.nacimiento);
        console.log(diasParaCumple);
        if (diasParaCumple <= 8 && diasParaCumple >= 0) {
            document.getElementById("select-mascota").value = mascota.id_mascota;
            mostrarDatos(mascotas);
        }
    });

}


preguntarClienteVenta();
async function preguntarClienteVenta() {

    //pregunto si se esta recargando la pagina por haber editado el cliente o por haber dado click desde seguimiento
    let idClienteVenta = localStorage.getItem("ClienteVenta");
    localStorage.clear();

    if (idClienteVenta) {
        inputCliente.value = idClienteVenta;
        MainFunctionVenta();
    }

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
    let divIngreso = document.getElementById("ingreso");
    divIngreso.classList.remove('ampliado');
    inputCliente.focus();
})



function mostrarDatos(mascotas) {
    let select = document.getElementById("select-mascota");
    console.log("valor select:", select.value);
    let idBusqueda = select.value;
    let mascota = mascotas.find(mascota => mascota.id_mascota == idBusqueda);

    let mostrandoDatos = document.getElementById("mostrando-datos");

    let edadMascota = calcularFechas.calcularEdadMascota(mascota.nacimiento);

    mostrandoDatos.innerHTML = ""
    mostrandoDatos.innerHTML +=
        `<p><b>Animal:</b> ` + mascota.animal + `</p>
    <p><b>Raza:</b> ` + mascota.raza + `</p>
    <p><b>Peso:</b> ` + mascota.peso + `kg</p>
    <p><b>Edad:</b> ` + edadMascota + `</p>
    <p><b>Actividad:</b> ` + mascota.actividad + `</p>
    <p><b>Afecciones:</b> ` + mascota.afecciones + `</p>`
    console.log(mascota.nacimiento);
    let diasParaCumple = calcularFechas.diasParaCumpleaños(mascota.nacimiento)
    console.log(diasParaCumple);
    if (diasParaCumple <= 8 && diasParaCumple >= 0) {
        if (diasParaCumple == 0) {
            mostrandoDatos.innerHTML += `<p><span style="font-weight: 600; color: red;"><b>Cumpleaños: </b>Hoy🎉</span></p>`;
        } else {
            mostrandoDatos.innerHTML += `<p><span style="font-weight: 600; color: red;"><b>Cumpleaños: </b>${diasParaCumple} dias🎉</span></p>`;
        }
    } else {
        mostrandoDatos.innerHTML += `<p><b>Cumpleaños: </b>${diasParaCumple} dias🎉</p>`;
    }




}





async function venta(cliente, mascotas) {
    try {
        let checkboxSeguimiento = document.getElementById("checkboxSeguimiento");
        precio = document.getElementById("inputprecio");
        marca_bolsa = document.getElementById('input-marca');
        if (bolsaSeleccionada.marca_bolsa != marca_bolsa.value) throw new Error();
        cantbolsas = document.getElementById("inputcantbolsas");
        let mascotasVenta = [];
        console.log(bolsaSeleccionada);


        console.log("logs que me importan: ", bolsaSeleccionada.calidad_bolsa,);

        let nosequeeeMarca = marcaPrevia;
        let nosequeeeCalidad = calidadPrevia;
        let nosequeeekilos = kilosPrevios;


        let nuevaVenta = {
            fecha: "",
            precio: "",
            id_cliente: "",
            cantidad: "",
            marca_bolsa: "",
            kilos_bolsa: "",
            calidad_bolsa: "",
            marca_previa: "",
            kilos_previos: "",
            calidad_previa: "",
            activo: "",
            totalventa: "",
            puntos_obtenidos: "",
            puntos_canjeados: "",
            vencimiento: "",
            id_venta: ""
        }

        console.log("marca previa:", marcaPrevia, "kilosprevios: ", kilosPrevios, "calidad previa: ", calidadPrevia)

        let bolsasVenta = {
            marcaActual: bolsaSeleccionada.marca_bolsa,
            calidadActual: bolsaSeleccionada.calidad_bolsa,
            kilosActuales: bolsaSeleccionada.kilos_bolsa,
            cantidadActual: parseInt(cantbolsas.value),
            marcaPrevia: marcaPrevia,
            calidadPrevia: calidadPrevia,
            kilosPrevios: kilosPrevios
        }

        nuevaVenta.fecha = new Date();
        nuevaVenta.precio = parseFloat(precio.value);
        nuevaVenta.id_cliente = cliente.id_cliente;
        nuevaVenta.cantidad = parseInt(cantbolsas.value);
        nuevaVenta.marca_bolsa = bolsasVenta.marcaActual;
        nuevaVenta.kilos_bolsa = bolsasVenta.kilosActuales;
        nuevaVenta.calidad_bolsa = bolsasVenta.calidadActual;
        nuevaVenta.marca_previa = bolsasVenta.marcaPrevia;
        nuevaVenta.kilos_previos = bolsasVenta.kilosPrevios;
        nuevaVenta.calidad_previa = bolsasVenta.calidadPrevia;
        nuevaVenta.activo = checkboxSeguimiento.checked;
        nuevaVenta.totalventa = "";
        nuevaVenta.puntos_obtenidos = "";
        nuevaVenta.puntos_canjeados = "";
        nuevaVenta.vencimiento = "";
        nuevaVenta.id_venta = "";


        console.log("logs que me importan2: ", bolsaSeleccionada.calidad_bolsa, parseInt(cantbolsas.value));


        console.log("nuevaVenta justo cuando lo creo: ", nuevaVenta);

        console.log("array bolsasVenta:", bolsasVenta);

        console.log("log desdepues del log que quiero")
        mascotas.forEach(element => {

            checks = document.getElementById(`checkbox${element.nombremascota}`);

            if (checks.checked) {
                mascotasVenta.push(element.id_mascota);
            }

        });

        if (mascotasVenta.length == 0) {

            await SeleccionMascotaModal.show();
            return

        }

        // Filtrar las mascotas que tienen IDs en el array "mascotasVenta"
        mascotas = mascotas.filter((mascota) =>
            mascotasVenta.includes(mascota.id_mascota)
        );

        await venta_controller.insertarVenta(nuevaVenta, bolsasVenta, mascotas, cliente.puntos, nuevosPuntos);

        VentaExitosaModal.show();
    } catch (error) {
        console.log(error);

        let previouslyFocusedElement = document.activeElement;
        previouslyFocusedElement.blur();
        await ErrorDesconocidoModal.show();

        setTimeout(function () {
            previouslyFocusedElement.focus();
        }, 100);


    }






}




////////////////////////////////INNERS//////////////////////////////////////////////////////////
function innerCliente(mascotas, historialVentasConBolsas) {

    agregado = document.getElementById("agregado");
    ingreso = document.getElementById("mascota");

    if(cliente.calle_numero == null){
        cliente.calle_numero = 0;
    }

    let direccion;
    if (cliente.dpto) {
        direccion = cliente.calle + ` ` + cliente.calle_numero + ` (Dpto: ${cliente.dpto})`;
    } else {
        direccion = cliente.calle + ` ` + cliente.calle_numero;
    }

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
<p><b>Nombre:</b><span id="spanNombreCliente" onclick="editarCliente()"> ${cliente.primernombre} ${cliente.nombrepila} ${cliente.apellido}</span></p>
<p><b>Telefono:</b> ` + cliente.telefono + `</p>
<p><b>Direccion:</b> ` + direccion + `</p>
<p><b>Puntos:</b><span id="spanPuntos"> ` + cliente.puntos + `<div id="divBotonRestarPuntos"><button id="btnRestarPuntos" onclick="botonRestarPuntos()"><img src="../../imagenes/signoMenos.png" id="imgSignoMenos"></button></div></span></p>
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

<p class="pprecio">Precio Unitario: $<input class="inputprecio" id="inputprecio" required type="text" pattern="^[0-9]+(\.[0-9]+)?$" onkeypress="reemplazarComa(event)"></p>
<p class="pcantbolsas">Cantidad de bolsas: <input class="inputcantbolsas" id="inputcantbolsas" value="1" required type="text" pattern="^[1-9]*$"></p>
<div id="container-checkboxSeguimiento"><label for="checkboxSeguimiento">Realizar seguimiento</label><input type="checkbox" id="checkboxSeguimiento" checked></div>
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
        select.innerHTML += `<option value="${element.id_mascota}">${element.nombremascota}</option>`;
        seleccionMascota.innerHTML += `
        <input type="checkbox" value="1" class="checkbox checkboxMascota" id="checkbox${element.nombremascota}">
        <label for="checkbox${element.nombremascota}" class="labelCheckboxMascota">${element.nombremascota}</label>
        <br>
      `;
    });

    console.log("historial vetnas: ", historialVentasConBolsas);
    if (historialVentasConBolsas) {
        var divHistorial = document.getElementById("historial");

        historialVentasConBolsas.forEach((element, index) => {
            if (index % 2 === 0) {
                divHistorial.innerHTML += `<div class="ventaHistorialPar"><p>${element.marca_bolsa} ${element.kilos_bolsa}kg (${element.calidad_bolsa})</p></div>`;
            } else {
                divHistorial.innerHTML += `<div class="ventaHistorialImpar"><p>${element.marca_bolsa} ${element.kilos_bolsa}kg (${element.calidad_bolsa})</p></div>`;
            }
        });


    } else {
        var divHistorial = document.getElementById("historial");
        divHistorial.innerHTML += `<h4 class="h4SinVentas">Sin Compras</h4>`
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
        // Limpiar los elementos anteriores
        removeElements();

        let searchTerms = input.value.replace(/\s+/g, ' ');
        searchTerms = searchTerms.trim().toUpperCase().split(" ");

        bolsas.forEach((bolsa) => {
            let marcaBolsa = bolsa.marca_bolsa.toUpperCase().replace(/\s/g, ""); // Eliminar espacios en blanco

            let matchesAllTerms = true;

            searchTerms.forEach((term) => {
                if (!marcaBolsa.includes(term)) {
                    matchesAllTerms = false;
                    return; // Salir del bucle forEach
                }
            });

            if (matchesAllTerms && input.value.trim() !== "") {
                // Crear elemento de lista (li)
                let listItem = document.createElement("li");
                listItem.classList.add("list-items");
                listItem.style.cursor = "pointer";
                listItem.addEventListener("click", () => displayNames(bolsa));

                // Resaltar las palabras coincidentes en negrita
                let word = bolsa.marca_bolsa;
                searchTerms.forEach((term) => {
                    word = word.replace(new RegExp(term, "gi"), "<b>$&</b>");
                });

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


function botonRestarPuntos() {

    let divInputRestarPuntos = document.getElementById("divInputRestarPuntos");
    let divBotonRestarPuntos = document.getElementById("divBotonRestarPuntos");

    divBotonRestarPuntos.innerHTML = "";
    divInputRestarPuntos.innerHTML = `<form id="formRestarPuntos"><input type="number" id="inputRestarPuntos" placeholder="Restar..." required><button type="submit" id="confirmarRestarPuntos"><img src="../../imagenes/tick.png" id="imgTick"></button><button type="reset" id="cancelarRestarPuntos"><img src="../../imagenes/cruz_negra.png" id="imgCruz_negra"></button></form>`;
    document.getElementById("inputRestarPuntos").focus();

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

    if (parseInt(inputRestarPuntos.value) > nuevosPuntos) {

        await PuntosNegativosModal.show();
        setTimeout(function () {
            inputRestarPuntos.focus();
        }, 100);
        return
    }
    nuevosPuntos = nuevosPuntos - parseInt(inputRestarPuntos.value);

    spanPuntos.textContent = ` ${nuevosPuntos}`;

    divInputRestarPuntos.innerHTML = "";
    divBotonRestarPuntos.innerHTML = `<button id="btnRestarPuntos" onclick="botonRestarPuntos()"><img src="../../imagenes/signoMenos.png" id="imgSignoMenos"></button>`;

    if (cliente.puntos != nuevosPuntos) {
        divInputRestarPuntos.innerHTML = `<button class="restaurarPuntos" id="btnRestaurarPuntos" onclick="restaurarPuntos()">Restaurar</button>`;
    }

}


function cancelarRestarPuntos() {

    let divInputRestarPuntos = document.getElementById("divInputRestarPuntos");
    let divBotonRestarPuntos = document.getElementById("divBotonRestarPuntos");

    divInputRestarPuntos.innerHTML = "";
    divBotonRestarPuntos.innerHTML = `<button id="btnRestarPuntos" onclick="botonRestarPuntos()"><img src="../../imagenes/signoMenos.png" id="imgSignoMenos"></button>`;

    if (cliente.puntos != nuevosPuntos) {
        divInputRestarPuntos.innerHTML = `<button class="restaurarPuntos" id="btnRestaurarPuntos" onclick="restaurarPuntos()">Restaurar</button>`;
    }

}


function restaurarPuntos() {
    nuevosPuntos = cliente.puntos;
    spanPuntos.textContent = ` ${nuevosPuntos}`;

    let divInputRestarPuntos = document.getElementById("divInputRestarPuntos");
    divInputRestarPuntos.innerHTML = "";
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


async function mainVentasActivasCliente() {
    let ventasActivas = await venta_controller.getVentasActivasByIdCliente(cliente.id_cliente);
    console.log("Ventas activas:", ventasActivas);
    renderVentasActivas(ventasActivas);
}


function renderVentasActivas(ventasActivas) {

    let divVentasActivas = document.getElementById("ventasActivas");

    divVentasActivas.innerHTML = "";

    ventasActivas.forEach(function (element, index) {

        let dias = calcularFechas.calcularDiasEntreFechas(element.venta.fecha, new Date());

        let diasRestantes = calcularFechas.calcularDiasEntreFechas(new Date(), element.venta.vencimiento);

        let kilosRestantes = calcularFechas.calcularKilosRestantesBolsa(element.mascotas, element.venta);

        divVentasActivas.innerHTML += ` <div class="container-ventaActiva">
        <div class="fecha">
            <h2><b>Comprado hace ${dias} dias</b></h2>
        </div>

        <div class="container-datos-mascotas">

            <div class="ContainerCheckboxVentaActiva">
            <input type="checkbox" name="checkboxVentaActiva${element.venta.id_venta}" id="checkboxVentaActiva${element.venta.id_venta}" class="checkboxVentaActiva" value="1">
            <label for="checkboxVentaActiva${element.venta.id_venta}">Compra por adelantado</label>
            </div>

            <div class="datos-ventaActiva">
                <h3 class="h3Bolsa"><b>Bolsa: </b>${element.venta.marca_bolsa}</h3>
                <h3 class="h3Cantidad"><b>Cantidad: </b>${element.venta.cantidad} bolsa/s de ${element.venta.kilos_bolsa}kg</h3>
            </div>

            <div class="mascotas" id="divMascotasVentaActiva${element.venta.id_venta}">
                <b>Mascotas:</b>
            </div>

            <div class="estadoBolsa">
                <b>Estado:</b> Quedan ${kilosRestantes}kg en total (Quedan ${diasRestantes} dias)
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
    listenerCheckboxesVentasActivas(ventasActivas);
}



function editarCliente() {
    localStorage.setItem("ClienteAEditar", cliente.id_cliente);
    main.createWindowEditarCliente();
}

function listenerCheckboxesVentasActivas(ventasActivas) {
    ventasActivas.forEach(function (ventaActiva) {
        let mascotasVentaActiva = ventaActiva.mascotas;
        let kilosRestantes = calcularFechas.calcularKilosRestantesBolsa(mascotasVentaActiva, ventaActiva.venta);

        // Crear el listener para el checkbox de la venta activa
        let checkboxVentaActiva = document.getElementById(`checkboxVentaActiva${ventaActiva.venta.id_venta}`);
        checkboxVentaActiva.addEventListener('change', function (e) {
            if (checkboxVentaActiva.checked) {
                desmarcarCheboxesVentasActivas(ventasActivas, ventaActiva.venta.id_venta);

                //descmarco todos los checkboxes de mascotas para despues mas abajo volver a marcar el que es
                let checkboxesMascotas = document.querySelectorAll(".checkbox");
                checkboxesMascotas.forEach(element => {
                    console.log("desmarco checkbox");
                    element.checked = false;
                });

                kilosPrevios = kilosRestantes;
                marcaPrevia = ventaActiva.venta.marca_bolsa;
                calidadPrevia = ventaActiva.venta.calidad_bolsa;
                console.log("kilosPrevios: ", kilosPrevios);
                console.log("marcaPrevia: ", marcaPrevia);
                console.log("calidadPrevia: ", calidadPrevia);


                //marco los checkboxes de las mascotas de la venta activa
                mascotasVentaActiva.forEach(function (mascota) {
                    let checkboxMascota = document.getElementById(`checkbox${mascota.nombremascota}`);
                    checkboxMascota.checked = true;
                });
            } else {
                mascotasVentaActiva.forEach(function (mascota) {
                    let checkboxMascota = document.getElementById(`checkbox${mascota.nombremascota}`);
                    checkboxMascota.checked = false;
                    console.log("entro a no checked");
                    kilosPrevios = 0;
                    marcaPrevia = undefined;
                    calidadPrevia = undefined;
                    console.log("kilosPrevios: ", kilosPrevios);
                    console.log("marcaPrevia: ", marcaPrevia);
                    console.log("calidadPrevia: ", calidadPrevia);
                });
            }
        });
    });
}


function listenerCheckboxesMascotas(mascotas) {
    let checkboxesMascotas = document.getElementsByClassName("checkboxMascota");

    for (let checkbox of checkboxesMascotas) {
        checkbox.addEventListener('change', function (e) {
            let perroSeleccionado = false;
            let gatoSeleccionado = false;

            for (let i = 0; i < checkboxesMascotas.length; i++) {
                if (checkboxesMascotas[i].checked) {
                    if (mascotas[i].animal === "Perro") {
                        perroSeleccionado = true;
                    } else if (mascotas[i].animal === "Gato") {
                        gatoSeleccionado = true;
                    }
                }
            }

            if (perroSeleccionado && gatoSeleccionado) {
                let previouslyFocusedElement = document.activeElement;
                previouslyFocusedElement.blur();
                seleccionGatoPerroModal.show();

                setTimeout(function () {
                    previouslyFocusedElement.focus();
                }, 100);
                checkbox.checked = false; // Desmarcar el checkbox que causó el conflicto.
            }
        });
    }
}



function desmarcarCheboxesVentasActivas(ventasActivas, idVentaMantener) {
    console.log(ventasActivas);
    ventasActivas = quitarVentaActivaPorId(ventasActivas, idVentaMantener);
    console.log(ventasActivas);
    console.log("funcion desmarcar checkboxes");
    //desmarco todos los checkbox de ventas activas y los de sus respectivas mascotas
    ventasActivas.forEach(function (element, index) {
        console.log(index);
        let checkboxVentaActiva = document.getElementById(`checkboxVentaActiva${element.venta.id_venta}`);
        checkboxVentaActiva.checked = false;

    });




}



function quitarVentaActivaPorId(ventasActivas, idVenta) {
    let ventasSeleccionadas = ventasActivas.filter(objeto => objeto.venta.id_venta != idVenta);
    return ventasSeleccionadas;
}


function focusInputCliente() {
    let inputCliente = document.getElementById("inputCliente");
    inputCliente.focus();
}





