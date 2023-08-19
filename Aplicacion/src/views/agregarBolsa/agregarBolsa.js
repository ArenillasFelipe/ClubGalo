const bolsa_controller = require('../../controllers/bolsa_controller');
const sweetAlerts = require('../../utils/sweetAlerts');
const { remote } = require('electron');
const main = remote.require('./main');


let bolsa;
let kilosBolsa = [];

document.getElementById("inputMarca").focus();

mainFunctionEditarBolsa();
async function mainFunctionEditarBolsa() {
    listenerCruz();

    listenerAgregarTamanio();
    listenerGuardar();

}

function listenerGuardar() {
    btnGuardar = document.getElementById("btnGuardar");

    btnGuardar.addEventListener('click', (e) => {
        e.preventDefault();

        actualizarDatosBolsaApp();

    });
}

function setTamaniosBolsa() {

    spanTamanios = document.getElementById("spanTamanios");
    spanTamanios.innerHTML = "";
    kilosBolsa.forEach(element => {
        // Crea el elemento <span> para cada bolsa
        const spanKiloBolsa = document.createElement("span");
        spanKiloBolsa.className = "spanKiloBolsa";
        spanKiloBolsa.id = `spanKiloBolsa${element}`;
        spanKiloBolsa.textContent = ` ${element}kg -`;

        // Agrega el <span> al <p> que contiene los tamaños de las bolsas
        spanTamanios.appendChild(spanKiloBolsa);

        // Agrega los eventos "mouseover" y "mouseout" al <span>
        spanKiloBolsa.addEventListener("mouseover", () => {
            spanKiloBolsa.textContent = " Borrar -";
            spanKiloBolsa.classList.add("spanKiloBolsaHover");
        });

        spanKiloBolsa.addEventListener("mouseout", () => {
            spanKiloBolsa.textContent = ` ${element}kg -`;
            spanKiloBolsa.classList.remove("spanKiloBolsaHover");
        });


        spanKiloBolsa.addEventListener("click", (e) => {
            e.preventDefault();

            borrarTamanio(element);

        });


    });

}



function listenerCruz() {
    btnCruz = document.getElementById("btnCruz");

    btnCruz.addEventListener('click', (e) => {
        e.preventDefault();

        main.cerrarVentanasEmergentes();



    });
}



function listenerAgregarTamanio() {
    btnAgregarTamanio = document.getElementById("btnAgregar");

    btnAgregarTamanio.addEventListener('click', (e) => {
        e.preventDefault();

        mainCrearInputTamanio();

    });
}

function mainCrearInputTamanio() {

    borrarBtnAgregar();
    cambiarBotonGuardarAAgregar();
    crearListenerAgregarGrande();
    agregarBtnCancelar();
    agregarInputTamanio();
    listenerBtnCancelar();


}


function borrarBtnAgregar() {
    container_btnAgregar = document.getElementById("container-btnAgregar");
    container_btnAgregar.innerHTML = "";
}

function cambiarBotonGuardarAAgregar() {
    container_btnGuardar = document.getElementById("container-btnGuardar");
    container_btnGuardar.innerHTML = `<button id="btnAgregarGrande">Agregar+</button>`
}

function cambiarBotonAgregarAGuardar() {
    container_btnGuardar = document.getElementById("container-btnGuardar");
    container_btnGuardar.innerHTML = `<button id="btnGuardar">Guardar</button>`
}

function agregarBtnCancelar() {
    container_btnCancelar = document.getElementById("container-btnCancelar");

    container_btnCancelar.innerHTML = `<button id="btnCancelar">Cancelar</button>`
}

function listenerBtnCancelar() {
    btnCancelar = document.getElementById("btnCancelar");

    btnCancelar.addEventListener('click', (e) => {
        e.preventDefault();


        borrarInputTamanio();
        cambiarBotonAgregarAGuardar();
        agregarBotonAgregar();
        borrarBotonCancelar();
        listenerAgregarTamanio();
        listenerGuardar();

    });
}

function borrarInputTamanio() {
    container_inputTamanio = document.getElementById("container-inputTamanio");

    container_inputTamanio.innerHTML = "";
}

function agregarBotonAgregar() {
    let container_btnAgregar = document.getElementById("container-btnAgregar");

    container_btnAgregar.innerHTML = `<button type="submit" id="btnAgregar">Agregar+</button>`;
}


function borrarBotonCancelar() {
    container_btnCancelar = document.getElementById("container-btnCancelar");

    container_btnCancelar.innerHTML = "";
}




function agregarInputTamanio() {
    container_inputTamanio = document.getElementById("container-inputTamanio");
    container_inputTamanio.innerHTML = `<label>Agregar Tamaño:</label> <input type="number" id="inputAgregarTamanio"><b>Kg</b>`
    document.getElementById("inputAgregarTamanio").focus();

}




async function botonAgregarGrande() {

    kilosBolsa.push(parseFloat(inputAgregarTamanio.value));

    kilosBolsa = ordenarArrayDeFloats(kilosBolsa);

    borrarInputTamanio();
    cambiarBotonAgregarAGuardar();
    agregarBotonAgregar();
    borrarBotonCancelar();
    listenerAgregarTamanio();
    listenerGuardar();
    setTamaniosBolsa();

}



async function borrarTamanio(tamanio) {

    let confirma_borrado = await sweetAlerts.sweetAlert_confirmar_borrado_kilos_bolsa(tamanio);

    if (confirma_borrado) {
        const index = kilosBolsa.indexOf(tamanio);
        if (index > -1) {
            kilosBolsa.splice(index, 1);
        }
        setTamaniosBolsa();
    }


}

async function actualizarDatosBolsaApp() {

    if ((document.getElementById("inputMarca").value) === "") {
        await sweetAlerts.sweetAlertAgregarMarcaBolsa();
        return;
    }

    if (kilosBolsa.length == 0) {
        sweetAlerts.sweetAlertAgregarTamanioBolsa();
        return;
    }


    newBolsa = {
        marca_bolsa: document.getElementById("inputMarca").value,
        calidad_bolsa: document.getElementById("selectCalidad").value
    }



    try {
        await bolsa_controller.insertBolsa(newBolsa, kilosBolsa);

        localStorage.setItem("marcaBolsaEditada", newBolsa.marca_bolsa);

        main.recargarPaginaPrincipal();
        main.cerrarVentanasEmergentes();
    } catch (error) {
        if (error.message == "bolsaRepetida") {
            await sweetAlerts.sweetAlertBolsaRepetida();
        }
        console.log(error);
    }

}


function crearListenerAgregarGrande() {

    let btnAgregarGrande = document.getElementById("btnAgregarGrande");

    btnAgregarGrande.addEventListener('click', (e) => {
        e.preventDefault();

        let inputAgregarTamanio = document.getElementById("inputAgregarTamanio");
        if (inputAgregarTamanio.value != "") {
            botonAgregarGrande();
        } else {
            sweetAlerts.sweetAlertCompletarInputTamanio();
        }


    });



}




function ordenarArrayDeFloats(arrayDeFloats) {
    // Utilizamos el método sort para ordenar el array de menor a mayor
    arrayDeFloats.sort(function (a, b) {
        return a - b;
    });

    // Devolvemos el array ordenado
    return arrayDeFloats;
}
