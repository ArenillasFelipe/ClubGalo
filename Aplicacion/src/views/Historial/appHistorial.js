const controller = require('../../controllers/historial_controller');
const sweetAlerts = require('../../utils/sweetAlerts');


let barra_busqueda = document.getElementById('barra-busqueda');
const listaVentas = document.getElementById('ventas');
const busqueda = document.getElementById('busqueda');
const doc = document.documentElement;
barra_busqueda.focus();


let salto = 0;

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
    get20VentasClienteapp(newBusqueda);
  }
});

let ventasConDatos;
let newBusqueda = "";


async function get20VentasClienteapp(newBusqueda) {
  ventasConDatos = await controller.get20Ventas(newBusqueda, salto);
  salto += 20;
  renderVentas(ventasConDatos);
}





function renderVentas() {
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
          <h3 class="h3Bolsa"><b>Bolsa:</b> ${element.bolsa.marca_bolsa}</h3>
          <h3 class="h3Cantidad"><b>Cantidad:</b> ${element.venta.cantidad} bolsa/s de ${element.bolsaKilo.kilos_bolsa}kg</h3>
          <h3 class="h3PrecioU"><b>Precio unitario:</b> $${(element.venta.precio).toFixed(2)}</h3>
        </div>
    
        <div class="total">
          <h2><b>Total:</b> $${(element.venta.totalventa).toFixed(2)}</h2>
        </div>

        <button class="btnCruz" onclick="borrar_venta(${element.venta.id_venta})"><img src="../../imagenes/cruz.png" class="cruz"></button>
    
      </div>`
    });
}


async function init() {
    await get20VentasClienteapp();
}

init();

busqueda.addEventListener('submit', (e) => {
  e.preventDefault();
  const barra_busqueda = document.getElementById('barra-busqueda');
  newBusqueda = barra_busqueda.value;
  salto = 0;
  listaVentas.innerHTML = "";
  get20VentasClienteapp(newBusqueda);

})


function botonPersona(idCliente){
  sessionStorage.setItem("historialCliente",  idCliente);
  location.href="../historialPersona/historialPersona.html";
}


async function borrar_venta(idVenta) {
  let resultados = await sweetAlerts.confirmar_borrado_venta();
  if (resultados.confirma_borrado) {

    if (resultados.confirma_borrar_puntos) {
      await controller.borrarVenta_RestarPuntos(idVenta, true);
      location.reload();
      return
    }
    await controller.borrarVenta_RestarPuntos(idVenta, false);
    location.reload();
  }
}
