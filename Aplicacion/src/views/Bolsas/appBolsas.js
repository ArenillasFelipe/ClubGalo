const bolsa_controller = require('../../controllers/bolsa_controller');
const { remote } = require('electron');
const main = remote.require('./main');


let salto = 0;
let newBusqueda;

let barra_busqueda = document.getElementById('barra-busqueda');
barra_busqueda.focus();

const doc = document.documentElement;
let flechaArriba = document.getElementById("flechaArriba");
flechaArriba.style.display = 'none';

// Agrega un eventListener al evento scroll
window.addEventListener('scroll', () => {
  var scrollPos = window.scrollY || window.scrollTop || document.getElementsByTagName("html")[0].scrollTop;
  var windowHeight = document.documentElement.clientHeight;

  //Mostrar el elemento si la posición actual de scroll es menor o igual a 0
  if (scrollPos <= 0) {
    flechaArriba.style.display = 'none';
  } else {
    flechaArriba.style.display = 'block';
  }

  // Si el usuario ha llegado al final de la página
  if (doc.scrollTop + window.innerHeight === doc.scrollHeight) {
    mainGetYRenderBolsasSegunBusquedaApp(newBusqueda);
  }
});





mainFunctionBolsasApp();
function mainFunctionBolsasApp() {

  mainGetYRenderBolsasSegunBusquedaApp();
  crearListenerBuscador();


}


async function mainGetYRenderBolsasSegunBusquedaApp(newBusqueda) {

  let bolsas18 = await bolsa_controller.get18BolsasSegunBusqueda(newBusqueda, salto);

  for (let indiceBolsa = 0; indiceBolsa < bolsas18.length; indiceBolsa++) {
    const element = bolsas18[indiceBolsa];

    renderBolsaApp(element);

  }

  salto += 18;

}

function renderBolsaApp(bolsa) {
  let divBolsas = document.getElementById("bolsas");

  let calidadBolsaParaCSS = bolsa.bolsa.calidad_bolsa;

  if (calidadBolsaParaCSS == "SUPER PREMIUM") {
    calidadBolsaParaCSS = "SUPERPREMIUM";
  }

  divBolsas.innerHTML += `    <div class="container-bolsa${calidadBolsaParaCSS}">
    <img src="../../imagenes/favicon.png" class="imgBolsa">
    <div class="datos-bolsa">
      <div class="marca-bolsa">
        <p>${bolsa.bolsa.marca_bolsa}</p>
      </div>
      <div class="calidad-bolsa${calidadBolsaParaCSS}">
        <p>-${bolsa.bolsa.calidad_bolsa}-</p>
      </div>
      <div class="kilos-bolsa">
        <p id="tamaniosBolsa${bolsa.bolsa.id_bolsa}"><b>Tamaños:</b></p>
      </div>
    </div>

    <button class="btn-editar" onClick="botonEditar(${bolsa.bolsa.id_bolsa})">Editar</button>
    <button class="btn-borrar" onClick="botonBorrar(${bolsa.bolsa.id_bolsa})">Borrar</button>

  </div>`

  rellenarKilosBolsa(bolsa);

}

function rellenarKilosBolsa(bolsa) {

  let idPTamanios = "tamaniosBolsa" + bolsa.bolsa.id_bolsa;

  let kilosBolsa = bolsa.kilosBolsa;

  let pTamanios = document.getElementById(idPTamanios);
  kilosBolsa.forEach(element => {
    pTamanios.innerHTML += ` ${element.kilos_bolsa}kg -`
  });


}



function crearListenerBuscador() {

  formBuscador = document.getElementById("busqueda");

  formBuscador.addEventListener('submit', (e) => {
    e.preventDefault();

    let barra_busqueda = document.getElementById("barra-busqueda");
    newBusqueda = barra_busqueda.value

    resetearSaltoYTarjetas();
    mainGetYRenderBolsasSegunBusquedaApp(newBusqueda);

  });



}


function resetearSaltoYTarjetas() {
  salto = 0;
  let divBolsas = document.getElementById("bolsas");
  divBolsas.innerHTML = "";
}


function botonEditar(id_bolsa) {
  localStorage.setItem("idBolsaEditar", id_bolsa);
  main.createWindowEditarBolsa();
}

async function botonBorrar(id_bolsa) {

  let confirma_borrado = await sweetAlert_confirmar_borrado();

  if (confirma_borrado) {
    borrarBolsaByIdMain(id_bolsa);
    location.reload();
  }

}




async function sweetAlert_confirmar_borrado() {
  let resultado;
  await Swal.fire({
    title: '¿Seguro que desea borrar la bolsa?',
    text: "Se perderan todos los datos de la bolsa y no se realizara seguimiento de las ventas que la incluyan",
    footer: "No se podran revertir los cambios",
    icon: 'warning',
    showCancelButton: true,
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



function botonAgregarBolsa() {
  localStorage.setItem("EstadoBolsa",  "NoCreado");
  main.createWindowAgregarBolsa();
}


