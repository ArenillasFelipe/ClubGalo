const bolsa_controller = require('../../controllers/bolsa_controller');
const sweetAlerts = require('../../utils/sweetAlerts');
const { remote } = require('electron');
const main = remote.require('./main');


let bolsa;

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
    localStorage.clear();
    bolsa = await bolsa_controller.getBolsaById(idBolsa);
    console.log(bolsa);
}

function setInputMarcaValorBolsa() {
    let inputMarca = document.getElementById("inputMarca");
    inputMarca.value = bolsa.bolsa.marca_bolsa;
}

function setTamaniosBolsa() {

    spanTamanios = document.getElementById("spanTamanios");
    spanTamanios.innerHTML = "";
    let kilos_bolsa = bolsa.kilosBolsa;
    kilos_bolsa.forEach(element => {
        // Crea el elemento <span> para cada bolsa
        const spanKiloBolsa = document.createElement("span");
        spanKiloBolsa.className = "spanKiloBolsa";
        spanKiloBolsa.id = `spanKiloBolsa${element.kilos_bolsa}`;
        spanKiloBolsa.textContent = ` ${element.kilos_bolsa}kg -`;

        // Agrega el <span> al <p> que contiene los tamaños de las bolsas
        spanTamanios.appendChild(spanKiloBolsa);

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

            borrarTamanio(element.kilos_bolsa);

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

    let confirma_borrado = await sweetAlerts.sweetAlert_confirmar_borrado_kilos_bolsa(tamanio);

    if (confirma_borrado) {

        bolsa.kilosBolsa = bolsa.kilosBolsa.filter(bolsa => bolsa.kilos_bolsa !== tamanio);
        console.log(bolsa);
        setTamaniosBolsa();
    }


}

async function actualizarDatosBolsaApp() {

    if ((document.getElementById("inputMarca").value) === "") {
        await sweetAlerts.sweetAlertAgregarMarcaBolsa();
        return;
    }


    newBolsa = {
        id_bolsa: bolsa.bolsa.id_bolsa,
        marca_bolsa: document.getElementById("inputMarca").value,
        calidad_bolsa: document.getElementById("selectCalidad").value
    }


    if (bolsa.kilosBolsa.length != 0) {
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




function ordenarArrayDeFloats(arrayDeFloats) {
    // Utilizamos el método sort para ordenar el array de menor a mayor
    arrayDeFloats.sort(function(a, b) {
      return a - b;
    });
  
    // Devolvemos el array ordenado
    return arrayDeFloats;
  }
