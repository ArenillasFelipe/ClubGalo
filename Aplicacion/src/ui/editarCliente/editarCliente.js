const { remote, app } = require('electron');
const { getCLientemain, recargarPaginaPrincipal, getsoloClientefullnamemain, actualizarClienteMain, agregarMascotaMain, getMascotaidmain, getMascotasidCliente, eliminarMascotaMain, actualizarMascotaMain } = require('../../main');
const main = remote.require('./main');
let cliente;
let CantidadMascotas;

listenerGuardar();
listenerCruz();


async function getClienteAEditar() {
    cliente = localStorage.getItem( "ClienteAEditar" );
    cliente = await getsoloClientefullnamemain(cliente);
    console.log(cliente);
    let mascotas = await getMascotasidCliente(cliente[0].id_cliente);
    CantidadMascotas = mascotas.length;
    console.log(mascotas);
    llenarInputs(cliente, mascotas);
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



function llenarInputs(cliente, mascotas) {


    input_primernombre.value = cliente[0].primernombre
    input_nombrepila.value = cliente[0].nombrepila
    input_apellido.value = cliente[0].apellido
    input_calle.value = cliente[0].calle
    input_numero.value = cliente[0].calle_numero
    input_telefono.value = cliente[0].telefono


    mascotas.forEach(element => {
        select_mascota.innerHTML += `<option value="` + element.id_mascota + `">` + element.nombremascota + `</option>`
    });

    select_mascota.innerHTML += `<option value="agregar">` + "AGREGAR MASCOTA+" + `</option>`

    cambiarInputsMascota(mascotas[0].id_mascota);
    select_mascota.addEventListener('change', (e) => {
        e.preventDefault();
        
        idMascota = select_mascota.value;

        cambiarInputsMascota(idMascota);
    
    });


    










}

async function cambiarInputsMascota(idMascota){

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
    }else{

        divboton_eliminar.innerHTML = `<button class="btn-eliminarmascota" id="btn-eliminarmascota">ELIMINAR MASCOTA</button>`;
        divboton_guardarNewMascota.innerHTML = "";
        listenerEliminarMascota();

    let mascota = await main.getMascotaidmain(idMascota);
    console.log(input_animal, mascota);
    
    input_nombremascota.value = mascota[0].nombremascota
    input_animal.value = mascota[0].animal
    input_raza.value = mascota[0].raza
    input_peso.value = mascota[0].peso
    input_edad.value =mascota[0].edad
    input_actividad.value = mascota[0].actividad
    input_afecciones.value = mascota[0].afecciones

    dia = mascota[0].nacimiento;
    mes = dia
    anio = dia

    dia = dia.getDate();
    mes = mes.getMonth() + 1;
    anio = anio.getFullYear();

    input_diacumple.value = dia;
    input_mescumple.value = mes;
    input_aniocumple.value = anio;
    }
}


getClienteAEditar();


async function eliminarMascota(){
    idMascota = select_mascota.value;
    await eliminarMascotaMain(idMascota);
    await sweetAlertGuardadoConExito();
    location.reload();
}

async function actualizarMascota(){

    if (select_mascota.value === "agregar") {
        agregarMascotaapp();
    }else{


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


async function agregarMascotaapp(){
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

    await agregarMascotaMain(newMascota, cliente[0].id_cliente);
    await sweetAlertGuardadoConExito();
    location.reload();
}


async function actualizarClienteapp(){

    let newCliente = {
        idCliente: cliente[0].id_cliente,
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


function listenerGuardar(){
    let btnGuardar = document.getElementById("btnGuardar");
    btnGuardar.addEventListener('click', (e) => {
        e.preventDefault();
        if (input_primernombre.value === "" || input_nombrepila.value === "" || input_apellido.value === "" || input_calle.value === "" || input_numero.value === "" || input_telefono.value === "" || input_nombremascota.value === "" || input_animal.value === "" || input_raza.value === "" || input_peso.value === "" || input_edad.value === "" || input_actividad.value === "" || input_afecciones.value === "" || input_diacumple.value === "" || input_mescumple.value === "" || input_aniocumple.value === "") {
            sweetAlertCamposSinCompletar();
        }else{
            actualizarClienteapp();
            actualizarMascota();
        }

    });
}


function listenerEliminarMascota(){
let btn_eliminarmascota = document.getElementById("btn-eliminarmascota");
btn_eliminarmascota.addEventListener('click', (e) => {
    e.preventDefault();
    eliminarMascota();
});
}


function listenerGuardarNewMascota(){
let btnGuardarNewMascota = document.getElementById("btnGuardarNewMascota");

btnGuardarNewMascota.addEventListener('click', (e) => {
    e.preventDefault();
    if (input_nombremascota.value === "" || input_animal.value === "" || input_raza.value === "" || input_peso.value === "" || input_edad.value === "" || input_actividad.value === "" || input_afecciones.value === "" || input_diacumple.value === "" || input_mescumple.value === "" || input_aniocumple.value === "") {
        sweetAlertCamposSinCompletar();
    } else {
        actualizarMascota();
    }
});


}


async function sweetAlertCamposSinCompletar(){
    await Swal.fire({
        title: "Debe completar todos los campos",
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


async function sweetAlertGuardadoConExito(){
    await Swal.fire({
        title: "¡Cambios guardados con exito!",
        icon: "success",
        backdrop: true,
        showConfirmButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        stopKeydownPropagation: false,
        position: "center",
    })
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
            if (CantidadMascotas > 0) {
                main.recargarPaginaPrincipal();
                main.cerrarVentanasEmergentes();
            } else {
                sweetAlertSinMascotas();
            }
    });
}