const { remote } = require('electron');
const main = remote.require('./main');
const cliente_controller = require('../../controllers/cliente_controller');
const mascota_controller = require('../../controllers/mascota_controller');
const sweetAlerts = require('../../utils/sweetAlerts');


let cliente;
let mascotas;
let temporalmascotasIDs = 0;

listenerGuardar();
listenerCruz();

getClienteAEditar();
async function getClienteAEditar() {
    let idCliente = localStorage.getItem("ClienteAEditar");

    cliente = await cliente_controller.getClienteById(idCliente);
    mascotas = await mascota_controller.getMascotasByIdCliente(idCliente);

    llenarInputsCliente();
    llenarInputsMascotas();
}


let input_primernombre = document.getElementById("input-primernombre");
let input_nombrepila = document.getElementById("input-nombrepila");
let input_apellido = document.getElementById("input-apellido");
let input_calle = document.getElementById("input-calle");
let input_numero = document.getElementById("input-numero");
let input_telefono = document.getElementById("input-telefono");

// input_primernombre.value === "" || input_nombrepila.value === "" || input_apellido.value === "" || input_calle.value === "" || input_numero.value === "" || input_telefono.value === ""
// input_nombremascota.value === "" || input_animal.value === "" || input_raza.value === "" || input_peso.value === "" || input_edad.value === "" || input_actividad.value === "" || input_afecciones.value === "" || input_diacumple.value === "" || input_mescumple.value === "" || input_aniocumple.value === ""
////////////////////////////////////////////////////////////////////////////////////////////////////////////
let select_mascota = document.getElementById("select-mascota");
let input_nombremascota = document.getElementById("input-nombremascota");
let input_animal = document.getElementById("input-animal");
let input_raza = document.getElementById("input-raza");
let input_peso = document.getElementById("input-peso");
let input_edad = document.getElementById("input-edad");
let input_actividad = document.getElementById("input-actividad");
let input_afecciones = document.getElementById("input-afecciones");
let input_diacumple = document.getElementById("input-diacumple");
let input_mescumple = document.getElementById("input-mescumple");
let input_aniocumple = document.getElementById("input-aniocumple");
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
let divboton_eliminar = document.getElementById("boton-eliminar");
let divboton_guardarNewMascota = document.getElementById("boton-guardarmascota");

function llenarInputsCliente() {
    input_primernombre.value = cliente.primernombre
    input_nombrepila.value = cliente.nombrepila
    input_apellido.value = cliente.apellido
    input_calle.value = cliente.calle
    input_numero.value = cliente.calle_numero
    input_telefono.value = cliente.telefono
}

function llenarInputsMascotas() {

    select_mascota.innerHTML = "";
    mascotas.forEach(element => {
        select_mascota.innerHTML += `<option value="` + element.id_mascota + `">` + element.nombremascota + `</option>`
    });

    select_mascota.innerHTML += `<option value="agregar">` + "AGREGAR MASCOTA+" + `</option>`

    cambiarInputsMascota(mascotas[0].id_mascota);
    select_mascota.addEventListener('change', (e) => {
        e.preventDefault();

        let idMascota = select_mascota.value;

        cambiarInputsMascota(idMascota);

    });
}

async function cambiarInputsMascota(idMascota) {

    if (idMascota === "agregar") {
        divboton_eliminar.innerHTML = "";
        divboton_guardarNewMascota.innerHTML = `<button class="btnGuardarNewMascota" id="btnGuardarNewMascota">Agregar</button>`;
        listenerGuardarNewMascota();
        input_animal.value = "";
        input_nombremascota.value = "";
        input_raza.value = "Sin raza";
        input_peso.value = "";
        input_edad.value = "";
        input_actividad.value = "";
        input_afecciones.value = "Ninguna";
        input_diacumple.value = "";
        input_mescumple.value = "";
        input_aniocumple.value = "";
    } else {
        divboton_guardarNewMascota.innerHTML = `<button class="btnGuardarNewMascota" id="btnActualizarMascota">Guardar</button>`;
        divboton_eliminar.innerHTML = `<button class="btn-eliminarmascota" id="btn-eliminarmascota">ELIMINAR MASCOTA</button>`;
        divboton_guardarNewMascota.innerHTML = "";
        listenerEliminarMascota(idMascota);
        listenerActualizarMascota(idMascota);


        let mascotaAMostrar = mascotas.find(mascota => mascota.id_mascota == idMascota);


        input_nombremascota.value = mascotaAMostrar.nombremascota
        input_animal.value = mascotaAMostrar.animal
        input_raza.value = mascotaAMostrar.raza
        input_peso.value = mascotaAMostrar.peso
        input_edad.value = mascotaAMostrar.edad
        input_actividad.value = mascotaAMostrar.actividad
        input_afecciones.value = mascotaAMostrar.afecciones

        const partesFecha = mascotaAMostrar.nacimiento.split("/");
        const dia = parseInt(partesFecha[0]);
        const mes = parseInt(partesFecha[1]);
        const anio = parseInt(partesFecha[2]);

        input_diacumple.value = dia;
        input_mescumple.value = mes;
        input_aniocumple.value = anio;
    }
}

function listenerActualizarMascota(idMascota) {
    let mascota = mascotas.find(mascota => mascota.id_mascota == idMascota);
}


async function eliminarMascota(idMascota) {

    mascotas = mascotas.filter(mascota => mascota.id_mascota != idMascota);

    await sweetAlerts.sweetAlertGuardadoConExito();
    llenarInputsMascotas();
}

async function actualizarMascota() {

    if (select_mascota.value === "agregar") {
        agregarMascotaapp();
    } else {

        let newMascota = {
            idMascota: "",
            nombremascota: "",
            animal: "",
            raza: "",
            peso: "",
            edad: "",
            actividad: "",
            afecciones: "",
            nacimiento: ""
        }


        newMascota.idMascota = select_mascota.value;
        newMascota.nombremascota = input_nombremascota.value;
        newMascota.animal = input_animal.value;
        newMascota.raza = input_raza.value;
        newMascota.peso = input_peso.value;
        newMascota.edad = input_edad.value;
        newMascota.actividad = input_actividad.value;
        newMascota.afecciones = input_afecciones.value;
        newMascota.nacimiento = input_aniocumple.value + "-" + input_mescumple.value + "-" + input_diacumple.value;

        await actualizarMascotaMain(newMascota);
        await sweetAlertGuardadoConExito();
        location.reload();

    }

}


async function agregarMascotaapp() {
    let newMascota = {
        id_mascota: "",
        nombremascota: "",
        animal: "",
        raza: "",
        peso: "",
        edad: "",
        actividad: "",
        afecciones: "",
        nacimiento: "",
        id_cliente: ""
    }
    //le doy un id temporal (negativo para que no coincida con el de ninguna mascota) a la nueva mascota para poder accederla dentro de la ventana antes de ser guardada en la BD
    temporalmascotasIDs -= 1;
    newMascota.id_mascota = temporalmascotasIDs;

    newMascota.nombremascota = input_nombremascota.value;
    newMascota.animal = input_animal.value;
    newMascota.raza = input_raza.value;
    newMascota.peso = input_peso.value;
    newMascota.edad = input_edad.value;
    newMascota.actividad = input_actividad.value;
    newMascota.afecciones = input_afecciones.value;
    newMascota.nacimiento = `${parseInt(input_diacumple.value)}/${parseInt(input_mescumple.value)}/${parseInt(input_aniocumple.value)}`
    newMascota.id_cliente = cliente.id_cliente;

    mascotas.push(newMascota);
    await sweetAlerts.sweetAlertGuardadoConExito();
    llenarInputsMascotas();
    select_mascota.value = newMascota.id_mascota;
}


async function actualizarClienteapp() {

    let newCliente = {
        idCliente: cliente.id_cliente,
        primernombre: "",
        nombrepila: "",
        apellido: "",
        calle: "",
        numero: "",
        telefono: ""
    }



    newCliente.primernombre = input_primernombre.value
    newCliente.nombrepila = input_nombrepila.value
    newCliente.apellido = input_apellido.value
    newCliente.calle = input_calle.value
    newCliente.numero = input_numero.value
    newCliente.telefono = input_telefono.value


    await actualizarClienteMain(newCliente);
}


function listenerGuardar() {
    let btnGuardar = document.getElementById("btnGuardar");
    btnGuardar.addEventListener('click', (e) => {
        e.preventDefault();
        if (input_primernombre.value === "" || input_nombrepila.value === "" || input_apellido.value === "" || input_calle.value === "" || input_numero.value === "" || input_telefono.value === "" || input_nombremascota.value === "" || input_animal.value === "" || input_raza.value === "" || input_peso.value === "" || input_edad.value === "" || input_actividad.value === "" || input_afecciones.value === "" || input_diacumple.value === "" || input_mescumple.value === "" || input_aniocumple.value === "") {
            sweetAlertCamposSinCompletar();
        } else {
            actualizarClienteapp();
            actualizarMascota();
        }

    });
}


function listenerEliminarMascota(idMascota) {
    let btn_eliminarmascota = document.getElementById("btn-eliminarmascota");
    btn_eliminarmascota.addEventListener('click', (e) => {
        e.preventDefault();
        eliminarMascota(idMascota);
    });
}


function listenerGuardarNewMascota() {
    let btnGuardarNewMascota = document.getElementById("btnGuardarNewMascota");

    btnGuardarNewMascota.addEventListener('click', (e) => {
        e.preventDefault();
        if (input_nombremascota.value === "" || input_animal.value === "" || input_raza.value === "" || input_peso.value === "" || input_edad.value === "" || input_actividad.value === "" || input_afecciones.value === "" || input_diacumple.value === "" || input_mescumple.value === "" || input_aniocumple.value === "") {
            sweetAlerts.sweetAlertCamposSinCompletar();
        } else {
            actualizarMascota();
        }
    });


}






async function sweetAlertSinMascotas() {
    await Swal.fire({
        title: "Debe agregar al menos una mascota",
        icon: "error",
        backdrop: true,
        showConfirmButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        stopKeydownPropagation: false,
        position: "center",
    })
}


function listenerCruz() {
    btnCruz = document.getElementById("btnCruz");

    btnCruz.addEventListener('click', (e) => {
        e.preventDefault();
        if (mascotas.length > 0) {
            main.recargarPaginaPrincipal();
            main.cerrarVentanasEmergentes();
        } else {
            sweetAlertSinMascotas();
        }
    });
}