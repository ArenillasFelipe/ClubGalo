const { remote, app } = require('electron');
const { recargarPaginaPrincipal, getSoloBolsaByIdMain, actualizarDatosBolsaMain, borrarBolsaKilosByIdMain, cerrarVentanasEmergentes, getBolsaByIdMain, agregarBolsaKilosMain } = require('../../main');
const main = remote.require('./main');

let bolsaKilos;
let soloBolsa;

mainFunctionEditarBolsa();
async function mainFunctionEditarBolsa() {
    listenerCruz();

    await getBolsaAEditar();
    setInputMarcaValorBolsa();
    setSelectCalidadEnCalidadActualSegunBolsa();
    setTamaniosBolsa();
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


async function getBolsaAEditar() {
    let idBolsa = localStorage.getItem("idBolsaEditar");
    bolsaKilos = await getBolsaByIdMain(idBolsa);
    soloBolsa = await getSoloBolsaByIdMain(idBolsa);
    console.log(bolsaKilos);
}

function setInputMarcaValorBolsa() {
    let inputMarca = document.getElementById("inputMarca");
    inputMarca.value = soloBolsa[0].marca_bolsa;
}

function setTamaniosBolsa() {
    pTamanios = document.getElementById("pTamanios");

    bolsaKilos.forEach(element => {
        // Crea el elemento <span> para cada bolsa
        const spanKiloBolsa = document.createElement("span");
        spanKiloBolsa.className = "spanKiloBolsa";
        spanKiloBolsa.id = `spanKiloBolsa${element.id_bolsa_kilo}`;
        spanKiloBolsa.textContent = ` ${element.kilos_bolsa}kg -`;

        // Agrega el <span> al <p> que contiene los tamaños de las bolsas
        pTamanios.appendChild(spanKiloBolsa);

        // Agrega los eventos "mouseover" y "mouseout" al <span>
        spanKiloBolsa.addEventListener("mouseover", () => {
            spanKiloBolsa.textContent = " Borrar -";
            spanKiloBolsa.classList.add("spanKiloBolsaHover");
        });

        spanKiloBolsa.addEventListener("mouseout", () => {
            spanKiloBolsa.textContent = ` ${element.kilos_bolsa}kg -`;
            spanKiloBolsa.classList.remove("spanKiloBolsaHover");
        });


        spanKiloBolsa.addEventListener("click", (e) => {
            e.preventDefault();

            borrarBolsaKilosByIdApp(element.id_bolsa_kilo, element.kilos_bolsa);

        });


    });

}



function listenerCruz() {
    btnCruz = document.getElementById("btnCruz");

    btnCruz.addEventListener('click', (e) => {
        e.preventDefault();

        if (bolsaKilos.length != 0) {
            main.recargarPaginaPrincipal();
            main.cerrarVentanasEmergentes();
        } else {
            sweetAlertAgregarTamanioBolsa();
        }



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

    container_inputTamanio.innerHTML = `<label>Agregar Tamaño:</label> <input type="text" id="inputAgregarTamanio"><b>Kg</b>`

}


function setSelectCalidadEnCalidadActualSegunBolsa() {

    switch (soloBolsa[0].calidad_bolsa) {
        case "BAJA":
            document.getElementById("selectCalidad").value = soloBolsa[0].calidad_bolsa;
            document.getElementById("selectCalidad").options[0].selected = true;
            break;
        case "INTERMEDIA":
            document.getElementById("selectCalidad").value = soloBolsa[0].calidad_bolsa;
            document.getElementById("selectCalidad").options[1].selected = true;
            break;
        case "PREMIUM":
            document.getElementById("selectCalidad").value = soloBolsa[0].calidad_bolsa;
            document.getElementById("selectCalidad").options[2].selected = true;
            break;
        case "SUPER PREMIUM":
            document.getElementById("selectCalidad").value = soloBolsa[0].calidad_bolsa;
            document.getElementById("selectCalidad").options[3].selected = true;
            break;
    }


}




async function actualizarDatosBolsaApp() {

    newBolsa = {
        id_bolsa: soloBolsa[0].id_bolsa,
        marca_bolsa: document.getElementById("inputMarca").value,
        calidad_bolsa: document.getElementById("selectCalidad").value
    }


    await actualizarDatosBolsaMain(newBolsa);
    location.reload();

}


async function botonAgregarGrande() {


    let newBolsaKilos = {
        id_bolsa: soloBolsa[0].id_bolsa,
        marca_bolsa: soloBolsa[0].marca_bolsa,
        kilos_bolsa: inputAgregarTamanio.value,
        calidad_bolsa: soloBolsa[0].calidad_bolsa
    }

    console.log("newBOlsaKilos:", newBolsaKilos);

    await agregarBolsaKilosMain(newBolsaKilos);
    location.reload();

}



async function borrarBolsaKilosByIdApp(id_bolsa_kilo, bolsa_kilos) {

    let confirma_borrado = await sweetAlert_confirmar_borrado_kilos_bolsa(bolsa_kilos);

    if (confirma_borrado) {
        await borrarBolsaKilosByIdMain(id_bolsa_kilo);
        location.reload();
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
            sweetAlertCompletarInputTamanio();
        }


    });



}


async function sweetAlertCompletarInputTamanio() {
    await Swal.fire({
        title: "Debes completar el campo de agregar tamaño",
        icon: "error",
        showConfirmButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        toast: true,
        stopKeydownPropagation: false,
        position: "top",
    })
}


async function sweetAlertAgregarTamanioBolsa() {
    await Swal.fire({
        title: "Debes agregar al menos 1 tamaño de bolsa",
        icon: "error",
        showConfirmButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        toast: true,
        stopKeydownPropagation: false,
        position: "top",
    })
}



async function sweetAlert_confirmar_borrado_kilos_bolsa(kilos_bolsa) {
    let resultado;
    await Swal.fire({
        title: '¿Seguro que desea borrar el tamaño: ' + kilos_bolsa + 'kg?',
        icon: 'warning',
        showCancelButton: true,
        toast: true,
        confirmButtonColor: '#3085d6',
        cancelButtonText: "Cancelar",
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, borrar'
    }).then((result) => {
        if (result.isConfirmed) {
            resultado = true;
        } else {
            resultado = false;
        }
    })

    return resultado;
}

