const sweetAlerts = require('../../utils/sweetAlerts');
const venta_controller = require('../../controllers/venta_controller');






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
















let barra_busqueda = document.getElementById('barra-busqueda');
const listaVentas = document.getElementById('ventas');
const busqueda = document.getElementById('busqueda');
barra_busqueda.focus();


let salto = 0;

let ventasConDatos;
let newBusqueda = "";


async function get20VentasClienteapp() {
  console.log(salto);
  ventasConDatos = await venta_controller.get20Ventas(newBusqueda, salto);
  renderVentas();
}





function renderVentas() {

  let container_paginado = document.getElementById("container-paginado");
  container_paginado.style.opacity = 0;

  listaVentas.innerHTML = "";
    ventasConDatos.forEach(element => {
        listaVentas.innerHTML +=
        `<div class="proto-venta">
    
        <div class="fecha">
          <h2><b>${element.venta.fecha}</b></h2>
          </div>
        
        <div class="imagen-persona">
          <img src="../../imagenes/persona.png" width="75">
        </div>
    
        <div class="datos-persona">
        <p><b>Nombre: </b><button class="btn-nombre" onclick="botonPersona(${element.cliente.id_cliente})"><h3>${element.cliente.primernombre} ${element.cliente.nombrepila} ${element.cliente.apellido} (Nº:${element.cliente.id_cliente})</h3></button></p>
          <h3 class="h3persona"><b>Tel:</b> ${element.cliente.telefono}</h3>
          <h3 class="h3persona"><b>Direccion:</b> ${element.cliente.calle} ${element.cliente.calle_numero}</h3>
        </div>
        <div class="datos-venta">
          <h3 class="h3Bolsa"><b>Bolsa:</b> ${element.venta.marca_bolsa}</h3>
          <h3 class="h3Cantidad"><b>Cantidad:</b> ${element.venta.cantidad} bolsa/s de ${element.venta.kilos_bolsa}kg</h3>
          <h3 class="h3PrecioU"><b>Precio unitario:</b> $${(element.venta.precio).toFixed(2)}</h3>
        </div>
    
        <div class="total">
          <h2><b>Total:</b> $${(element.venta.totalventa).toFixed(2)}</h2>
        </div>

        <button class="btnCruz" onclick="borrar_venta(${element.venta.id_venta})"><img src="../../imagenes/cruz.png" class="cruz"></button>
    
      </div>`
    });

    container_paginado.style.opacity = 1;
}


async function init() {
    await get20VentasClienteapp();
    listenerBtnSiguiente();
    listenerBtnAnterior();
}

init();

busqueda.addEventListener('submit', (e) => {
  e.preventDefault();
  const barra_busqueda = document.getElementById('barra-busqueda');
  newBusqueda = barra_busqueda.value;
  salto = 0;
  listaVentas.innerHTML = "";
  get20VentasClienteapp();

})


function botonPersona(idCliente){
  sessionStorage.setItem("historialCliente",  idCliente);
  location.href="../historialPersona/historialPersona.html";
}


async function borrar_venta(idVenta) {
  let resultados = await sweetAlerts.confirmar_borrado_venta();
  if (resultados.confirma_borrado) {

    if (resultados.confirma_borrar_puntos) {
      await venta_controller.borrarVenta_RestarPuntos(idVenta, true);
      location.reload();
      return
    }
    await venta_controller.borrarVenta_RestarPuntos(idVenta, false);
    location.reload();
  }
}


function listenerBtnSiguiente() {
  let btnSiguiente = document.getElementById('btnSiguiente')
  btnSiguiente.addEventListener('click', (e) => {
    e.preventDefault();
    paginaSiguiente();
  })

}

function paginaSiguiente() {
  let h5Pagina = document.getElementById('h5Pagina');
  h5Pagina.textContent = parseInt(h5Pagina.textContent) + 1;
  salto = (parseInt(h5Pagina.textContent) - 1) * 20;
  get20VentasClienteapp();
}


function listenerBtnAnterior() {
  let btnAnterior = document.getElementById('btnAnterior')
  btnAnterior.addEventListener('click', (e) => {
    e.preventDefault();
    paginaAnterior();
  })

}

function paginaAnterior() {
  let h5Pagina = document.getElementById('h5Pagina');


  if (parseInt(h5Pagina.textContent) > 1) {

  h5Pagina.textContent = parseInt(h5Pagina.textContent) - 1;
  salto = (parseInt(h5Pagina.textContent) - 1) * 20;
  get20VentasClienteapp();

  }


}
