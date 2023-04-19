const { remote, app } = require('electron');
const { agregarBolsaMain, crearNuevaBolsaMain, recargarPaginaPrincipal, cerrarVentanasEmergentes } = require('../../main');
const main = remote.require('./main');
mainFunctionAgregarBolsaApp();

let newBolsa;
let newBolsaKilos = [];


async function mainFunctionAgregarBolsaApp() {

    listenerCruz();
    listenerAgregarTamanio();
    listenerGuardar();
}


function listenerAgregarTamanio() {
    let btnAgregarTamanio = document.getElementById("btnAgregar");

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

async function botonAgregarGrande() {

    newBolsaKilos.push(parseFloat(inputAgregarTamanio.value));

    newBolsaKilos = ordenarArrayDeFloats(newBolsaKilos);

    console.log("newBOlsaKilos:", newBolsaKilos);

    borrarInputTamanio();
    cambiarBotonAgregarAGuardar();
    agregarBotonAgregar();
    borrarBotonCancelar();
    listenerAgregarTamanio();
    listenerGuardar();
    setInputTamanio();

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


function listenerGuardar() {
    btnGuardar = document.getElementById("btnGuardar");

    btnGuardar.addEventListener('click', (e) => {
        e.preventDefault();

        botonGuardar();

    });
}


function setInputTamanio() {

    spanTamanios = document.getElementById("spanTamanios");
    spanTamanios.innerHTML = "";

    newBolsaKilos.forEach(element => {
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


async function borrarTamanio(tamanio) {

    let confirma_borrado = await sweetAlert_confirmar_borrado_kilos_bolsa(tamanio);

    if (confirma_borrado) {
        let indice = newBolsaKilos.indexOf(tamanio);

        if (indice !== -1) {
            newBolsaKilos.splice(indice, 1);
        }
    
        setInputTamanio();
    }


}



async function botonGuardar() {

    if ((document.getElementById("inputMarca").value) === "") {
        await sweetAlertAgregarMarcaBolsa();
        return;
    }

    newBolsa = {
        marca_bolsa: document.getElementById("inputMarca").value,
        calidad_bolsa: document.getElementById("selectCalidad").value
    }

    if (newBolsaKilos.length != 0) {
        let bolsaRepetida = await crearNuevaBolsaMain(newBolsa, newBolsaKilos);

        if (bolsaRepetida == "bolsaRepetida") {
            await sweetAlertBolsaRepetida();
        }else{
        main.recargarPaginaPrincipal();
        main.cerrarVentanasEmergentes();
        }
    } else {
        sweetAlertAgregarTamanioBolsa();
    }


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

async function sweetAlertBolsaRepetida() {
    await Swal.fire({
        title: "Ya existe una bolsa con ese nombre",
        icon: "error",
        showConfirmButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        toast: true,
        stopKeydownPropagation: false,
        position: "center",
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



async function sweetAlert_confirmar_borrado_kilos_bolsa(tamanio) {
    let resultado;
    await Swal.fire({
        title: '¿Seguro que desea borrar el tamaño: ' + tamanio + 'kg?',
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

async function sweetAlertAgregarMarcaBolsa() {
    await Swal.fire({
        title: "Debes indicar la marca de la bolsa",
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


function listenerCruz() {
    btnCruz = document.getElementById("btnCruz");

    btnCruz.addEventListener('click', (e) => {
        e.preventDefault();

        main.cerrarVentanasEmergentes();



    });
}


function ordenarArrayDeFloats(arrayDeFloats) {
    // Utilizamos el método sort para ordenar el array de menor a mayor
    arrayDeFloats.sort(function(a, b) {
      return a - b;
    });
  
    // Devolvemos el array ordenado
    return arrayDeFloats;
  }






















