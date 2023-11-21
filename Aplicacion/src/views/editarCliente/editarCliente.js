const { remote } = require('electron');
const main = remote.require('./main');
const cliente_controller = require('../../controllers/cliente_controller');
const mascota_controller = require('../../controllers/mascota_controller');
const { calcularEdadMascota } = require('../../utils/calcularFechas');
const nodemailer = require('nodemailer');
const { capitalizarPalabras } = require('../../utils/palabras');


let cliente;
let mascotasOriginal;
let mascotasMod;
let temporalmascotasIDs = 0;



agregarListenerGuardarEnter();
function agregarListenerGuardarEnter() {
    console.log("activado el listener")
    document.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            console.log("se presiono enter")
            guardarEnter();
        }
    });
}

function quitarListenerGuardarEnter() {
    console.log("DESactivado el listener")
    document.removeEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            guardarEnter();
        }
    });
}



function guardarEnter() {
    console.log("funcion guardar enter");
    let btnGuardarNewMascota = document.getElementById("btnGuardarNewMascota");
    console.log("btnGuardarNewMascota: ", btnGuardarNewMascota);
    if (btnGuardarNewMascota) {
        let estilo = window.getComputedStyle(btnGuardarNewMascota);
        let display = estilo.getPropertyValue("display");
        console.log(display);
        if (display == "block") {
            btnGuardarNewMascota.click();
            return;
        }
    }



    let btnActualizarMascota = document.getElementById("btnActualizarMascota");
    console.log("btnActualizarMascota: ", btnActualizarMascota);
    if (btnActualizarMascota) {
        let estilo = window.getComputedStyle(btnActualizarMascota);
        let display = estilo.getPropertyValue("display");
        console.log("display: ", display);
        console.log(btnActualizarMascota);
        if (display == "block") {
            btnActualizarMascota.click();
            return;
        }
    }


    let btnGuardar = document.getElementById("btnGuardar");

    estilo = window.getComputedStyle(btnGuardar);
    display = estilo.getPropertyValue("display");
    console.log("display de btnGuardar:", display);
    if (display == "block") {
        btnGuardar.click();
    }
}





async function getClienteAEditar() {
    let idCliente = localStorage.getItem("ClienteAEditar");
    localStorage.clear();

    cliente = await cliente_controller.getClienteById(idCliente);
    mascotasOriginal = await mascota_controller.getMascotasByIdCliente(idCliente);
    mascotasMod = mascotasOriginal;

    llenarInputsCliente();
    llenarInputsMascotas();
    listenersCambiosInputsPersona();
}


let input_primernombre = document.getElementById("input-primernombre");
let input_nombrepila = document.getElementById("input-nombrepila");
let input_apellido = document.getElementById("input-apellido");
let input_calle = document.getElementById("input-calle");
let input_numero = document.getElementById("input-numero");
let input_telefono = document.getElementById("input-telefono");
let input_puntos = document.getElementById("input-puntos");

// input_primernombre.value === "" || input_nombrepila.value === "" || input_apellido.value === "" || input_calle.value === "" || input_numero.value === "" || input_telefono.value === ""
// input_nombremascota.value === "" || input_animal.value === "" || input_raza.value === "" || input_peso.value === "" || input_edad.value === "" || input_actividad.value === "" || input_afecciones.value === "" || input_diacumple.value === "" || input_mescumple.value === "" || input_aniocumple.value === ""
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



listenerGuardar();
listenerCruz();

getClienteAEditar();





function llenarInputsCliente() {
    input_primernombre.value = cliente.primernombre
    input_nombrepila.value = cliente.nombrepila
    input_apellido.value = cliente.apellido
    input_calle.value = cliente.calle
    input_numero.value = cliente.calle_numero
    input_telefono.value = cliente.telefono
    input_puntos.value = cliente.puntos
}

function llenarInputsMascotas() {

    select_mascota.innerHTML = "";
    mascotasMod.forEach(element => {
        select_mascota.innerHTML += `<option value="` + element.id_mascota + `">` + element.nombremascota + `</option>`
    });

    select_mascota.innerHTML += `<option value="agregar">` + "AGREGAR MASCOTA+" + `</option>`


    if (mascotasMod[0]) {
        cambiarInputsMascota(mascotasMod[0].id_mascota);
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
        divboton_guardarNewMascota.innerHTML = `<button class="btnGuardarNewMascota" id="btnActualizarMascota" type="submit">Aceptar</button>`;
        listenerActualizarMascota(idMascota);
        divboton_eliminar.innerHTML = `<button class="btn-eliminarmascota" id="btn-eliminarmascota">ELIMINAR MASCOTA</button>`;
        listenerEliminarMascota(idMascota);
        listenersCambiosInputsMascota();


        let mascotaAMostrar = mascotasMod.find(mascota => mascota.id_mascota == idMascota);


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


    userDecision = await BorrarMascotaModal.show();

    if (userDecision) {
        mascotasMod = mascotasMod.filter(mascota => mascota.id_mascota != idMascota);

        btnGuardar.style.display = 'block'; // Mostramos el botón al hacer cambios

        llenarInputsMascotas();
    }

    userDecision = null;

}

async function actualizarMascota(idMascota) {

    btnGuardar.style.display = 'block'; // Mostramos el botón al hacer cambios


    if (input_nombremascota.value === "" || input_animal.value === "" || input_raza.value === "" || input_peso.value === "" || input_actividad.value === "" || input_afecciones.value === "" || input_diacumple.value === "" || input_mescumple.value === "" || input_aniocumple.value === "") {
        mostrarModalCompletarCampos();
        return
    }

    if (select_mascota.value === "agregar") {
        agregarMascotaapp();
    } else {

        let indice = mascotasMod.findIndex(mascota => mascota.id_mascota == idMascota);

        mascotasMod[indice].nombremascota = capitalizarPalabras(input_nombremascota.value);
        mascotasMod[indice].animal = input_animal.value;
        mascotasMod[indice].raza = capitalizarPalabras(input_raza.value);
        mascotasMod[indice].peso = input_peso.value;
        mascotasMod[indice].actividad = capitalizarPalabras(input_actividad.value);
        mascotasMod[indice].afecciones = input_afecciones.value;
        mascotasMod[indice].nacimiento = `${parseInt(input_diacumple.value)}/${parseInt(input_mescumple.value)}/${parseInt(input_aniocumple.value)}`


        llenarInputsMascotas();
        select_mascota.value = mascotasMod[indice].id_mascota;
        cambiarInputsMascota(mascotasMod[indice].id_mascota);
        console.log("se modifico mascotas:", mascotasMod);


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

    newMascota.nombremascota = capitalizarPalabras(input_nombremascota.value);
    newMascota.animal = input_animal.value;
    newMascota.raza = capitalizarPalabras(input_raza.value);
    newMascota.peso = input_peso.value;
    newMascota.actividad = capitalizarPalabras(input_actividad.value);
    newMascota.afecciones = input_afecciones.value;
    newMascota.nacimiento = `${parseInt(input_diacumple.value)}/${parseInt(input_mescumple.value)}/${parseInt(input_aniocumple.value)}`
    newMascota.id_cliente = cliente.id_cliente;

    mascotasMod.push(newMascota);
    llenarInputsMascotas();
    select_mascota.value = newMascota.id_mascota;
    cambiarInputsMascota(newMascota.id_mascota);
    console.log("se modifico mascotas:", mascotasMod);
}


async function guardarClienteapp() {

    let newCliente = {
        id_cliente: "",
        primernombre: "",
        nombrepila: "",
        apellido: "",
        calle: "",
        calle_numero: "",
        puntos: "",
        telefono: ""
    }

    newCliente.id_cliente = cliente.id_cliente
    newCliente.primernombre = input_primernombre.value
    newCliente.nombrepila = input_nombrepila.value
    newCliente.apellido = input_apellido.value
    newCliente.calle = input_calle.value
    newCliente.calle_numero = input_numero.value
    newCliente.telefono = input_telefono.value
    newCliente.puntos = input_puntos.value


    await cliente_controller.updateClienteById(newCliente);
}


function listenerGuardar() {
    let btnGuardar = document.getElementById("btnGuardar");
    btnGuardar.addEventListener('click', (e) => {
        e.preventDefault();

        if (mascotasMod.length == 0) {
            SinMascotasModal.show();
            return
        }

        if (input_primernombre.value === "" || input_nombrepila.value === "" || input_apellido.value === "" || input_calle.value === "" || input_numero.value === "" || input_telefono.value === "" || input_puntos.value === "") {
            mostrarModalCompletarCampos();
        } else {
            guardarClienteConMascotas();
        }

    });
}
//input_nombremascota.value === "" || input_animal.value === "" || input_raza.value === "" || input_peso.value === "" || input_edad.value === "" || input_actividad.value === "" || input_afecciones.value === "" || input_diacumple.value === "" || input_mescumple.value === "" || input_aniocumple.value === "")
async function guardarMascotasApp() {
    console.log("antes de guardar: ", mascotasMod);
    await mascota_controller.actualizarMascotasCliente(mascotasMod, mascotasOriginal);
}

async function guardarClienteConMascotas() {
    if (parseInt(cliente.puntos) < parseInt(input_puntos.value)) {
        await enviarEmailCambioDePuntos();
    }

    await guardarClienteapp();
    await guardarMascotasApp();
    localStorage.setItem("ClienteVenta", cliente.id_cliente);
    // main.recargarPaginaPrincipal();
    // main.cerrarVentanasEmergentes();
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
        console.log("se dio click a btnAgregar");
        if (input_nombremascota.value === "" || input_animal.value === "" || input_raza.value === "" || input_peso.value === "" || input_actividad.value === "" || input_afecciones.value === "" || input_diacumple.value === "" || input_mescumple.value === "" || input_aniocumple.value === "") {
            mostrarModalCompletarCampos();
        } else {
            actualizarMascota();
        }
    });


}


async function mostrarModalCompletarCampos() {
    quitarListenerGuardarEnter();
    await CompletarCamposModal.show();
    agregarListenerGuardarEnter();
}



function listenerCruz() {
    btnCruz = document.getElementById("btnCruz");

    btnCruz.addEventListener('click', (e) => {
        e.preventDefault();

        main.cerrarVentanasEmergentes();

    });
}



function enviarEmailCambioDePuntos() {

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
            subject: 'Aviso modificacion de puntos Club Galo',
            html: `
    <p>Los puntos del cliente ${cliente.primernombre} ${cliente.nombrepila} ${cliente.apellido}(Nº: ${cliente.id_cliente}) han sido modificados de ${cliente.puntos} a ${input_puntos.value} el dia ${dia}/${mes}/${anio} a las ${hora}:${minutos}hs</p>
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



function listenersCambiosInputsPersona() {
    const inputsPersona = document.querySelectorAll('.inputPersona');

    inputsPersona.forEach(function (input) {
        input.addEventListener('input', function () {
            btnGuardar.style.display = 'block'; // Mostramos el botón al hacer cambios en cualquier input con la clase inputPersona
        });
    });


}


function listenersCambiosInputsMascota() {

    let btnActualizarMascota = document.getElementById("btnActualizarMascota");

    const inputsMascota = document.querySelectorAll('.inputMascota');

    inputsMascota.forEach(function (input) {
        input.addEventListener('input', function () {
            btnActualizarMascota.style.display = "block";
        });
    });
}
