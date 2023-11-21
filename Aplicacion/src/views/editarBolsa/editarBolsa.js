const bolsa_controller = require('../../controllers/bolsa_controller');
const { remote } = require('electron');
const main = remote.require('./main');
const { reemplazarComa } = require('../../utils/palabras');

let bolsa;
let kilosBolsa = [];
let kilosBolsaOriginal = [];
let cambiosCalidad = false;
let cambiosMarca = false;

document.getElementById("inputMarca").focus();

document.getElementById("inputMarca").addEventListener("focus", function() {

    borrarInputTamanio();
    borrarBtnAgregarGrande();
    agregarBotonAgregar();
    borrarBotonCancelar();
    listenerAgregarTamanio();

    if (!areArraysEqual(kilosBolsa, kilosBolsaOriginal) || cambiosCalidad || cambiosMarca) {
        console.log("no son iguales los array original y actual")
        insertBtnGuardar();
        listenerGuardar();
    }
});

mainFunctionEditarBolsa();
async function mainFunctionEditarBolsa() {
    listenerCruz();

    await getBolsaAEditar();
    setInputMarcaValorBolsa();
    setSelectCalidadEnCalidadActualSegunBolsa();
    setTamaniosBolsa();
    listenerAgregarTamanio();






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
    localStorage.clear();
    bolsa = await bolsa_controller.getBolsaById(idBolsa);
    bolsa.kilosBolsa.forEach(element => {
        kilosBolsa.push(element.kilos_bolsa);
        kilosBolsaOriginal.push(element.kilos_bolsa);
    });
    kilosBolsa = ordenarArrayDeFloats(kilosBolsa);
    kilosBolsaOriginal = ordenarArrayDeFloats(kilosBolsaOriginal);
    console.log(bolsa);
}

function setInputMarcaValorBolsa() {
    let inputMarca = document.getElementById("inputMarca");
    inputMarca.value = bolsa.bolsa.marca_bolsa;

    inputMarca.addEventListener('input', function () {
        cambiosMarca = true;
        insertBtnGuardar();
        listenerGuardar();
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
    insertBtnAgregar();
    crearListenerAgregarGrande();
    agregarBtnCancelar();
    agregarInputTamanio();
    listenerBtnCancelar();


}


function borrarBtnAgregar() {
    container_btnAgregar = document.getElementById("container-btnAgregar");
    container_btnAgregar.innerHTML = "";
}

function borrarBtnAgregarGrande() {
    container_btnGuardar = document.getElementById("container-btnGuardar");
    container_btnGuardar.innerHTML = "";
}

function insertBtnAgregar() {
    container_btnGuardar = document.getElementById("container-btnGuardar");
    container_btnGuardar.innerHTML = `<button id="btnAgregarGrande">Agregar+</button>`
}

function insertBtnGuardar() {
    console.log("funcion insertBTNguardar")
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
        borrarBtnAgregarGrande();
        agregarBotonAgregar();
        borrarBotonCancelar();
        listenerAgregarTamanio();

        if (!areArraysEqual(kilosBolsa, kilosBolsaOriginal) || cambiosCalidad || cambiosMarca) {
            console.log("no son iguales los array original y actual")
            insertBtnGuardar();
            listenerGuardar();
        }

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
    container_inputTamanio.innerHTML = `<label>Agregar Tamaño:</label> <input type="text" pattern="^[0-9]+(\.[0-9]+)?$" onkeypress="reemplazarComa(event)" id="inputAgregarTamanio"><b>Kg</b>`
    document.getElementById("inputAgregarTamanio").focus();

}


function setSelectCalidadEnCalidadActualSegunBolsa() {

    switch (bolsa.bolsa.calidad_bolsa) {
        case "BAJA":
            document.getElementById("selectCalidad").value = bolsa.bolsa.calidad_bolsa;
            document.getElementById("selectCalidad").options[0].selected = true;
            break;
        case "INTERMEDIA":
            document.getElementById("selectCalidad").value = bolsa.bolsa.calidad_bolsa;
            document.getElementById("selectCalidad").options[1].selected = true;
            break;
        case "PREMIUM":
            document.getElementById("selectCalidad").value = bolsa.bolsa.calidad_bolsa;
            document.getElementById("selectCalidad").options[2].selected = true;
            break;
        case "SUPER PREMIUM":
            document.getElementById("selectCalidad").value = bolsa.bolsa.calidad_bolsa;
            document.getElementById("selectCalidad").options[3].selected = true;
            break;
    }


    document.getElementById("selectCalidad").addEventListener('change', function () {
        cambiosCalidad = true;
        insertBtnGuardar();
        listenerGuardar();
    });


}




async function botonAgregarGrande() {

    kilosBolsa.push(parseFloat(inputAgregarTamanio.value));

    kilosBolsa = ordenarArrayDeFloats(kilosBolsa);

    console.log(bolsa);

    borrarInputTamanio();
    insertBtnGuardar();
    agregarBotonAgregar();
    borrarBotonCancelar();
    listenerAgregarTamanio();
    listenerGuardar();
    setTamaniosBolsa();

}



async function borrarTamanio(tamanio) {


    const index = kilosBolsa.indexOf(tamanio);
    if (index > -1) {
        kilosBolsa.splice(index, 1);
    }
    setTamaniosBolsa();

    if (!areArraysEqual(kilosBolsa, kilosBolsaOriginal) || cambiosCalidad || cambiosMarca) {
        console.log("no son iguales los array original y actual");
        insertBtnGuardar();
        listenerGuardar();
    } else {
        //borro lo del container guardar y para eso uso esta funcion que sirve tambien para eso
        borrarBtnAgregarGrande();
    }



}

async function actualizarDatosBolsaApp() {

    if ((document.getElementById("inputMarca").value) === "") {
        await AgregarMarcaBolsaModal.show();
        setTimeout(function () {
            document.getElementById("inputMarca").focus();
        }, 100);
        return;
    }

    if (kilosBolsa.length == 0) {
        await AgregarTamanioBolsaModal.show();
        return;
    }


    newBolsa = {
        id_bolsa: bolsa.bolsa.id_bolsa,
        marca_bolsa: document.getElementById("inputMarca").value,
        calidad_bolsa: document.getElementById("selectCalidad").value
    }



    try {
        await bolsa_controller.actualizarDatosBolsa(newBolsa, kilosBolsa);

        localStorage.setItem("marcaBolsaEditada", newBolsa.marca_bolsa);
        main.recargarPaginaPrincipal();
        main.cerrarVentanasEmergentes();
    } catch (error) {
        if (error.message == "bolsaRepetida") {
            await BolsaRepetidaModal.show();
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
            let regex = /[^0-9.]/;
            if (regex.test(inputAgregarTamanio.value)) {
                FormatoNumericoModal.show();
              } else {
                botonAgregarGrande();
              }
        } else {
            CompletarInputTamanioModal.show();
        }


    });



}




function ordenarArrayDeFloats(arrayDeValores) {
    // Convertir los elementos a floats (si es posible)
    const arrayDeFloats = arrayDeValores.map(valor => parseFloat(valor)).filter(valor => !isNaN(valor));

    // Utilizamos el método sort para ordenar el array de menor a mayor
    arrayDeFloats.sort(function (a, b) {
        return a - b;
    });

    // Devolvemos el array ordenado
    return arrayDeFloats;
}


function areArraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }

    for (let i = 0; i < arr1.length; i++) {
        console.log("comparando", arr1[i], " y ",)
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }

    return true;
}
