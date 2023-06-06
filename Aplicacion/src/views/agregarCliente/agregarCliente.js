const { remote } = require('electron');
const main = remote.require('./main');
const cliente_controller = require('../../controllers/cliente_controller');
const mascota_controller = require('../../controllers/mascota_controller');
const sweetAlerts = require('../../utils/sweetAlerts');
const { calcularEdadMascota } = require('../../utils/calcularFechas');
const nodemailer = require('nodemailer');

let mascotas = [];
let temporalmascotasIDs = 0;



let input_primernombre = document.getElementById("input-primernombre");
let input_nombrepila = document.getElementById("input-nombrepila");
let input_apellido = document.getElementById("input-apellido");
let input_calle = document.getElementById("input-calle");
let input_numero = document.getElementById("input-numero");
let input_telefono = document.getElementById("input-telefono");
let input_puntos = document.getElementById("input-puntos");
////////////////////////////////////////////////////////////////////////////////////////////////////////////
let select_mascota = document.getElementById("select-mascota");
let input_nombremascota = document.getElementById("input-nombremascota");
let input_animal = document.getElementById("selectAnimal");
let input_raza = document.getElementById("input-raza");
let input_peso = document.getElementById("input-peso");
let spanEdad = document.getElementById("spanEdad");
let input_actividad = document.getElementById("input-actividad");
let input_afecciones = document.getElementById("input-afecciones");
let input_diacumple = document.getElementById("input-diacumple");
let input_mescumple = document.getElementById("input-mescumple");
let input_aniocumple = document.getElementById("input-aniocumple");
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
let divboton_eliminar = document.getElementById("boton-eliminar");
let divboton_guardarNewMascota = document.getElementById("boton-guardarmascota");


listenerCruz();
listenerGuardar();
llenarInputsMascotas();



function llenarInputsMascotas() {

    select_mascota.innerHTML = "";
    mascotas.forEach(element => {
        select_mascota.innerHTML += `<option value="` + element.id_mascota + `">` + element.nombremascota + `</option>`
    });

    select_mascota.innerHTML += `<option value="agregar">` + "AGREGAR MASCOTA+" + `</option>`


    if (mascotas[0]) {
        cambiarInputsMascota(mascotas[0].id_mascota);
    } else {
        cambiarInputsMascota("agregar");
    }

    select_mascota.addEventListener('change', (e) => {
        e.preventDefault();

        let idMascota = select_mascota.value;

        cambiarInputsMascota(idMascota);

    });
}

async function cambiarInputsMascota(idMascota) {

    if (idMascota === "agregar") {
        console.log("entroooo");
        divboton_eliminar.innerHTML = "";
        divboton_guardarNewMascota.innerHTML = `<button class="btnGuardarNewMascota" id="btnGuardarNewMascota">Agregar</button>`;
        listenerGuardarNewMascota();
        input_animal.value = "";
        input_nombremascota.value = "";
        input_raza.value = "Sin raza";
        input_peso.value = "";
        spanEdad.textContent = "";
        input_actividad.value = "";
        input_afecciones.value = "Ninguna";
        input_diacumple.value = "";
        input_mescumple.value = "";
        input_aniocumple.value = "";
    } else {
        divboton_guardarNewMascota.innerHTML = `<button class="btnGuardarNewMascota" id="btnActualizarMascota">Aceptar</button>`;
        divboton_eliminar.innerHTML = `<button class="btn-eliminarmascota" id="btn-eliminarmascota">ELIMINAR MASCOTA</button>`;
        listenerEliminarMascota(idMascota);
        listenerActualizarMascota(idMascota);


        let mascotaAMostrar = mascotas.find(mascota => mascota.id_mascota == idMascota);


        input_nombremascota.value = mascotaAMostrar.nombremascota
        input_animal.value = mascotaAMostrar.animal
        input_raza.value = mascotaAMostrar.raza
        input_peso.value = mascotaAMostrar.peso

        let edadMascota = calcularEdadMascota(mascotaAMostrar.nacimiento);
        spanEdad.textContent = " " + edadMascota;

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

    let btnActualizarMascota = document.getElementById("btnActualizarMascota");

    btnActualizarMascota.addEventListener('click', (e) => {
        e.preventDefault();
        actualizarMascota(idMascota);
    });
}


async function eliminarMascota(idMascota) {


    let confirma_borrado = await sweetAlerts.sweetAlertBorrarMascota();

    if (confirma_borrado) {
        mascotas = mascotas.filter(mascota => mascota.id_mascota != idMascota);

        await sweetAlerts.sweetAlertGuardadoConExito();
        llenarInputsMascotas();
    }


}

async function actualizarMascota(idMascota) {

    if (input_nombremascota.value === "" || input_animal.value === "" || input_raza.value === "" || input_peso.value === "" || input_actividad.value === "" || input_afecciones.value === "" || input_diacumple.value === "" || input_mescumple.value === "" || input_aniocumple.value === "") {
        sweetAlerts.sweetAlertCamposSinCompletar();
        return
    }

    if (select_mascota.value === "agregar") {
        agregarMascotaapp();
    } else {

        let indice = mascotas.findIndex(mascota => mascota.id_mascota == idMascota);

        mascotas[indice].nombremascota = input_nombremascota.value;
        mascotas[indice].animal = input_animal.value;
        mascotas[indice].raza = input_raza.value;
        mascotas[indice].peso = input_peso.value;
        mascotas[indice].actividad = input_actividad.value;
        mascotas[indice].afecciones = input_afecciones.value;
        mascotas[indice].nacimiento = `${parseInt(input_diacumple.value)}/${parseInt(input_mescumple.value)}/${parseInt(input_aniocumple.value)}`

        await sweetAlerts.sweetAlertGuardadoConExito();

        llenarInputsMascotas();
        select_mascota.value = mascotas[indice].id_mascota;
        cambiarInputsMascota(mascotas[indice].id_mascota);
        console.log("se modifico mascotas:", mascotas);


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
        nacimiento: ""
    }
    //le doy un id temporal (negativo para que no coincida con el de ninguna mascota) a la nueva mascota para poder accederla dentro de la ventana antes de ser guardada en la BD
    temporalmascotasIDs -= 1;
    newMascota.id_mascota = temporalmascotasIDs;

    newMascota.nombremascota = input_nombremascota.value;
    newMascota.animal = input_animal.value;
    newMascota.raza = input_raza.value;
    newMascota.peso = input_peso.value;
    newMascota.actividad = input_actividad.value;
    newMascota.afecciones = input_afecciones.value;
    newMascota.nacimiento = `${parseInt(input_diacumple.value)}/${parseInt(input_mescumple.value)}/${parseInt(input_aniocumple.value)}`

    mascotas.push(newMascota);
    await sweetAlerts.sweetAlertGuardadoConExito();
    llenarInputsMascotas();
    select_mascota.value = newMascota.id_mascota;
    cambiarInputsMascota(newMascota.id_mascota);
    console.log("se modifico mascotas:", mascotas);
}


async function guardarClienteapp() {

    let newCliente = {
        primernombre: "",
        nombrepila: "",
        apellido: "",
        calle: "",
        calle_numero: "",
        puntos: "",
        telefono: ""
    }

    newCliente.primernombre = input_primernombre.value
    newCliente.nombrepila = input_nombrepila.value
    newCliente.apellido = input_apellido.value
    newCliente.calle = input_calle.value
    newCliente.calle_numero = input_numero.value
    newCliente.telefono = input_telefono.value
    newCliente.puntos = input_puntos.value

    let idCliente = await cliente_controller.insertCliente(newCliente);

    newCliente.id_cliente = idCliente;

    if (parseInt(newCliente.puntos) > 0) {
        await enviarEmailPuntos(newCliente);
    }


    return idCliente;
}


function listenerGuardar() {
    let btnGuardar = document.getElementById("btnGuardar");
    btnGuardar.addEventListener('click', (e) => {
        e.preventDefault();

        if (mascotas.length == 0) {
            sweetAlerts.sweetAlertSinMascotas();
            return
        }

        if (input_primernombre.value === "" || input_nombrepila.value === "" || input_apellido.value === "" || input_calle.value === "" || input_numero.value === "" || input_telefono.value === "" || input_puntos.value === "") {
            sweetAlerts.sweetAlertCamposSinCompletar();
        } else {
            guardarClienteConMascotas();
        }

    });
}
//input_nombremascota.value === "" || input_animal.value === "" || input_raza.value === "" || input_peso.value === "" || input_edad.value === "" || input_actividad.value === "" || input_afecciones.value === "" || input_diacumple.value === "" || input_mescumple.value === "" || input_aniocumple.value === "")
async function guardarMascotasApp(idCliente) {

    for (let i = 0; i < mascotas.length; i++) {
        const element = mascotas[i];
        element.id_cliente = idCliente;
        await mascota_controller.insertMascota(element);
    }
}

async function guardarClienteConMascotas() {

    let idCliente = await guardarClienteapp();

    await guardarMascotasApp(idCliente);


    main.recargarPaginaPrincipal();
    main.cerrarVentanasEmergentes();
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
        if (input_nombremascota.value === "" || input_animal.value === "" || input_raza.value === "" || input_peso.value === "" || input_actividad.value === "" || input_afecciones.value === "" || input_diacumple.value === "" || input_mescumple.value === "" || input_aniocumple.value === "") {
            sweetAlerts.sweetAlertCamposSinCompletar();
        } else {
            actualizarMascota();
        }
    });


}

function listenerCruz() {
    btnCruz = document.getElementById("btnCruz");

    btnCruz.addEventListener('click', (e) => {
        e.preventDefault();

        main.cerrarVentanasEmergentes();

    });
}






function enviarEmailPuntos(newCliente) {

    document.body.innerHTML += `        <div class="container-load-spinner" id="container-load-spinner">
    <div class="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
    </div>
</div>`

    return new Promise((resolve, reject) => {
        let fechaActual = new Date();

        let dia = fechaActual.getDate();
        let mes = fechaActual.getMonth() + 1;
        let anio = fechaActual.getFullYear();
        let hora = fechaActual.getHours();
        let minutos = fechaActual.getMinutes();

        // Configurar el transporter (proveedor de correo)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'felipearenillas02@gmail.com', // Tu dirección de correo
                pass: 'whddwihzohvhowza' // Tu contraseña de correo
            }
        });

        // Definir el contenido del correo electrónico
        const mailOptions = {
            from: 'felipearenillas02@gmail.com', // Dirección de correo del remitente
            to: 'fgiarde@gmail.com', // Dirección de correo del destinatario
            subject: 'Aviso creacion de cliente con puntos Club Galo',
            html: `
    <p>Se ha creado un nuevo cliente llamado ${newCliente.primernombre} ${newCliente.nombrepila} ${newCliente.apellido}(Nº: ${newCliente.id_cliente}) con ${newCliente.puntos} puntos el dia ${dia}/${mes}/${anio} a las ${hora}:${minutos}hs</p>
    <img src="cid:logo" alt="Logo de la empresa" width="200px" style="position: center;">
  `,
            attachments: [
                {
                    filename: 'logo-galo.png',
                    path: 'src/imagenes/logo-galo.png',
                    cid: 'logo',
                },
            ],
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                console.log('Correo electrónico enviado: ' + info.response);
                resolve();
            }
        });
    });
}