const bolsa_controller = require('../../controllers/bolsa_controller');
const { remote } = require('electron');
const main = remote.require('./main');




const doc = document.documentElement;

let flechaArriba = document.getElementById("flechaArriba");
flechaArriba.style.display = 'none';

// Agrega un eventListener al evento scroll
window.addEventListener('scroll', () => {
  const scrollPos = window.pageYOffset || doc.scrollTop;

  if (scrollPos <= 0) {
    flechaArriba.style.display = 'none';
  } else {
    flechaArriba.style.display = 'block';
  }
});












let salto = 0;
let newBusqueda;

let barra_busqueda = document.getElementById('barra-busqueda');
barra_busqueda.focus();


mainFunctionBolsasApp();
function mainFunctionBolsasApp() {

  listenerBtnAnterior();
  listenerBtnSiguiente();
  crearListenerBuscador();
  preguntarBolsaEditada();
}

function preguntarBolsaEditada() {
  let marcaBolsaEditada = localStorage.getItem("marcaBolsaEditada");
  console.log(marcaBolsaEditada);
  localStorage.clear();
  if (marcaBolsaEditada) {
    barra_busqueda.value = marcaBolsaEditada;
    document.getElementById("boton-lupa").click();
  } else {
    mainGetYRenderBolsasSegunBusquedaApp();
  }
}


async function mainGetYRenderBolsasSegunBusquedaApp() {
  console.log("funcion mainget y render bolsas")
  resetearDivTarjetas();
  let container_paginado = document.getElementById("container-paginado");
  container_paginado.style.display = "none";

  let bolsas18 = await bolsa_controller.get18BolsasSegunBusqueda(newBusqueda, salto);
  console.log("salto:", salto, "bolsas que trajo: ", bolsas18);
  if (await verificarUltimaPagina()) {
    document.getElementById('btnSiguiente').style.display = "none";
  }

  for (let indiceBolsa = 0; indiceBolsa < bolsas18.length; indiceBolsa++) {
    const element = bolsas18[indiceBolsa];

    renderBolsaApp(element);

  }
  container_paginado.style.display = "block";
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

    resetearDivTarjetas();
    salto = 0;
    let h5Pagina = document.getElementById('h5Pagina');
    h5Pagina.textContent = 1;
    document.getElementById('btnAnterior').style.display = "none";
    document.getElementById('btnSiguiente').style.display = "block";
    mainGetYRenderBolsasSegunBusquedaApp();

  });



}


function resetearDivTarjetas() {
  let divBolsas = document.getElementById("bolsas");
  divBolsas.innerHTML = "";
}


function botonEditar(id_bolsa) {
  localStorage.setItem("idBolsaEditar", id_bolsa);
  main.createWindowEditarBolsa();
}

let userDecision = null;
async function botonBorrar(id_bolsa) {

  userDecision = await BorrarBolsaModal.show();

  if (userDecision) {
    await bolsa_controller.borrarBolsaById(id_bolsa);
    location.reload();
  }

  userDecision = null;

}



function botonAgregarBolsa() {
  main.createWindowAgregarBolsa();
}


function listenerBtnSiguiente() {
  let btnSiguiente = document.getElementById('btnSiguiente')
  btnSiguiente.addEventListener('click', (e) => {
    e.preventDefault();
    paginaSiguiente();
  })

}

function paginaSiguiente() {

  document.getElementById('btnAnterior').style.display = "block";

  let h5Pagina = document.getElementById('h5Pagina');
  h5Pagina.textContent = parseInt(h5Pagina.textContent) + 1;
  salto = (parseInt(h5Pagina.textContent) - 1) * 18;
  mainGetYRenderBolsasSegunBusquedaApp();
}


function listenerBtnAnterior() {
  let btnAnterior = document.getElementById('btnAnterior')
  btnAnterior.addEventListener('click', (e) => {
    e.preventDefault();
    paginaAnterior();
  })

}

function paginaAnterior() {

  document.getElementById('btnSiguiente').style.display = "block";

  let h5Pagina = document.getElementById('h5Pagina');

  if (parseInt(h5Pagina.textContent) > 1) {
    h5Pagina.textContent = parseInt(h5Pagina.textContent) - 1;
    salto = (parseInt(h5Pagina.textContent) - 1) * 18;
    mainGetYRenderBolsasSegunBusquedaApp();
  }

  if (parseInt(h5Pagina.textContent) == 1) {
    document.getElementById('btnAnterior').style.display = "none";
  }

}



async function verificarUltimaPagina() {
  let bolsas = [];
  bolsas = await bolsa_controller.get18BolsasSegunBusqueda(newBusqueda, salto + 18);
  if (bolsas.length == 0) {
    return true
  } else {
    return false
  }
}