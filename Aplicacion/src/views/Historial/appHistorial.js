const venta_controller = require("../../controllers/venta_controller");

const doc = document.documentElement;

let flechaArriba = document.getElementById("flechaArriba");
flechaArriba.style.display = "none";

let barra_busqueda = document.getElementById("barra-busqueda");
const listaVentas = document.getElementById("ventas");
const busqueda = document.getElementById("busqueda");
barra_busqueda.focus();

let salto = 0;

let ventasConDatos;
let newBusqueda = "";

async function get20VentasClienteapp() {
  console.log(salto);
  ventasConDatos = await venta_controller.get20Ventas(newBusqueda, salto);
  if (await verificarUltimaPagina()) {
    document.getElementById("btnSiguiente").style.display = "none";
  }
  renderVentas();
}

function renderVentas() {
  let container_paginado = document.getElementById("container-paginado");
  container_paginado.style.display = "none";

  listaVentas.innerHTML = "";
  let direccion;
  ventasConDatos.forEach((element) => {
    if (element.cliente.calle_numero == null) {
      element.cliente.calle_numero = 0;
    }

    if (element.cliente.dpto) {
      direccion =
        element.cliente.calle +
        ` ` +
        element.cliente.calle_numero +
        ` (Dpto: ${element.cliente.dpto})`;
    } else {
      direccion = element.cliente.calle + ` ` + element.cliente.calle_numero;
    }

    listaVentas.innerHTML += `<div class="proto-venta">
    
        <div class="fecha">
          <h2><b>${element.venta.fecha}</b></h2>
          </div>
        
        <div class="imagen-persona">
          <img src="../../imagenes/persona.png" width="75">
        </div>
    
        <div class="datos-persona">
        <p><b>Nombre: </b><button class="btn-nombre" onclick="botonPersona(${
          element.cliente.id_cliente
        })"><h3>${element.cliente.primernombre} ${element.cliente.nombrepila} ${
      element.cliente.apellido
    } (Nº:${element.cliente.id_cliente})</h3></button></p>
          <h3 class="h3persona"><b>Tel:</b> ${element.cliente.telefono}</h3>
          <h3 class="h3persona"><b>Direccion:</b> ${direccion}</h3>
        </div>
        <div class="datos-venta">
          <h3 class="h3Bolsa"><b>Bolsa:</b> ${element.venta.marca_bolsa}</h3>
          <h3 class="h3Cantidad"><b>Cantidad:</b> ${
            element.venta.cantidad
          } bolsa/s de ${element.venta.kilos_bolsa}kg</h3>
          <h3 class="h3PrecioU"><b>Precio unitario:</b> $${element.venta.precio.toFixed(
            2
          )}</h3>
        </div>

        <div class="resumenVenta">
    
        <div class="total">
          <h2><b>Total:</b> $${element.venta.totalventa.toFixed(2)}</h2>
        </div>

        <div class="puntos">
        <h2><b>Ptos. Canjeados:</b> ${element.venta.puntos_canjeados}</h2>
      </div>
        </div>

        <button class="btnCruz" onclick="borrar_venta(${
          element.venta.id_venta
        })"><img src="../../imagenes/cruz.png" class="cruz"></button>
      
      </div>`;
  });

  container_paginado.style.display = "block";
}

async function init() {
  await get20VentasClienteapp();
  listenerBtnSiguiente();
  listenerBtnAnterior();
}

init();

busqueda.addEventListener("submit", (e) => {
  e.preventDefault();
  const barra_busqueda = document.getElementById("barra-busqueda");
  newBusqueda = barra_busqueda.value;
  salto = 0;
  listaVentas.innerHTML = "";
  let h5Pagina = document.getElementById("h5Pagina");
  h5Pagina.textContent = 1;
  document.getElementById("btnAnterior").style.display = "none";
  document.getElementById("btnSiguiente").style.display = "block";
  get20VentasClienteapp();
});

function botonPersona(idCliente) {
  localStorage.setItem("historialCliente", idCliente);
  location.href = "../historialPersona/historialPersona.html";
}

let userDecision = null;
let isChecked = null;
async function borrar_venta(idVenta) {
  userDecision = await deleteSaleModal.show();

  if (userDecision) {
    // Lógica para borrar la venta
    await venta_controller.borrarVenta_RestarPuntos(idVenta, isChecked);
    location.reload();
  }
  userDecision = null;
  isChecked = null;
}

function listenerBtnSiguiente() {
  let btnSiguiente = document.getElementById("btnSiguiente");
  btnSiguiente.addEventListener("click", (e) => {
    e.preventDefault();
    paginaSiguiente();
  });
}

function paginaSiguiente() {
  document.getElementById("btnAnterior").style.display = "block";

  let h5Pagina = document.getElementById("h5Pagina");
  h5Pagina.textContent = parseInt(h5Pagina.textContent) + 1;
  salto = (parseInt(h5Pagina.textContent) - 1) * 20;
  get20VentasClienteapp();
}

function listenerBtnAnterior() {
  let btnAnterior = document.getElementById("btnAnterior");
  btnAnterior.addEventListener("click", (e) => {
    e.preventDefault();
    paginaAnterior();
  });
}

function paginaAnterior() {
  document.getElementById("btnSiguiente").style.display = "block";

  let h5Pagina = document.getElementById("h5Pagina");

  if (parseInt(h5Pagina.textContent) > 1) {
    h5Pagina.textContent = parseInt(h5Pagina.textContent) - 1;
    salto = (parseInt(h5Pagina.textContent) - 1) * 20;
    get20VentasClienteapp();
  }

  if (parseInt(h5Pagina.textContent) == 1) {
    document.getElementById("btnAnterior").style.display = "none";
  }
}

async function verificarUltimaPagina() {
  let ventas = [];
  ventas = await venta_controller.get20Ventas(newBusqueda, salto + 20);
  if (ventas.length == 0) {
    return true;
  } else {
    return false;
  }
}
