const { remote, app } = require('electron');
const { recargarPaginaPrincipal, getSoloBolsaByIdMain, actualizarDatosBolsaMain, borrarBolsaKilosByIdMain, cerrarVentanasEmergentes, getBolsaByIdMain, agregarBolsaKilosMain } = require('../../main');
const main = remote.require('./main');


let bolsaKilos = [];
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

    spanTamanios = document.getElementById("spanTamanios");
    spanTamanios.innerHTML = "";

    bolsaKilos.forEach(element => {
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




async function botonAgregarGrande() {


    bolsaKilos.push(parseFloat(inputAgregarTamanio.value));

    bolsaKilos = ordenarArrayDeFloats(bolsaKilos);

    console.log("bolsaKilos:", bolsaKilos);

    borrarInputTamanio();
    cambiarBotonAgregarAGuardar();
    agregarBotonAgregar();
    borrarBotonCancelar();
    listenerAgregarTamanio();
    listenerGuardar();
    setTamaniosBolsa();

}



async function borrarTamanio(tamanio) {

    let confirma_borrado = await sweetAlert_confirmar_borrado_kilos_bolsa(tamanio);

    if (confirma_borrado) {
        let indice = bolsaKilos.indexOf(tamanio);

        if (indice !== -1) {
            bolsaKilos.splice(indice, 1);
        }

        setTamaniosBolsa();
    }


}

async function actualizarDatosBolsaApp() {

    if ((document.getElementById("inputMarca").value) === "") {
        await sweetAlertAgregarMarcaBolsa();
        return;
    }


    newBolsa = {
        id_bolsa: soloBolsa[0].id_bolsa,
        marca_bolsa: document.getElementById("inputMarca").value,
        calidad_bolsa: document.getElementById("selectCalidad").value
    }


    if (bolsaKilos.length != 0) {
        let bolsaRepetida = await actualizarDatosBolsaMain(newBolsa, bolsaKilos);

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


function ordenarArrayDeFloats(arrayDeFloats) {
    // Utilizamos el método sort para ordenar el array de menor a mayor
    arrayDeFloats.sort(function(a, b) {
      return a - b;
    });
  
    // Devolvemos el array ordenado
    return arrayDeFloats;
  }
