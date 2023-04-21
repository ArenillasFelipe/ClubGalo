const { remote, app } = require('electron');
const { getCLientesmain, get20VentasClientemain, borrar_venta_main, restarPuntosClientePorBorradoDeVenta } = require('../../main');
const controller = require('../../controllers/historial_controller');
const main = remote.require('./main');


let barra_busqueda = document.getElementById('barra-busqueda');
barra_busqueda.focus();


let salto = 0;
// Selecciona el objeto document.documentElement para acceder a las propiedades de la página
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
    get20VentasClienteapp();
  }
});

let ventas = []
var newBusqueda = "";

const get20VentasClienteapp = async () => {
    ventas = await main.get20VentasClientemain(newBusqueda, salto);
    salto += 20;
    renderVentas(ventas);
}


const listaVentas = document.getElementById('ventas');

var dia = new Date();
var mes = new Date();
var anio = new Date();


function renderVentas(ventas) {
    ventas.forEach(venta => {
      dia = venta.fecha;
      mes = venta.fecha;

      anio = venta.fecha;
      dia = dia.getDate();
      mes = mes.getMonth();
      mes = mes + 1;
      anio = anio.getFullYear();
        listaVentas.innerHTML +=
        `<div class="proto-venta">
    
        <div class="fecha">
          <h2><b>` + dia + `/` + mes + `/` + anio + `</b></h2>
          </div>
        
        <div class="imagen-persona">
          <img src="../../imagenes/persona.png" width="75">
        </div>
    
        <div class="datos-persona">
        <p><b>Nombre: </b><button class="btn-nombre" onclick="botonPersona(${venta.id_cliente})"><h3>${venta.primernombre} ${venta.nombrepila} ${venta.apellido} (Nº:${venta.id_cliente})</h3></button></p>
          <h3 class="h3persona"><b>Tel:</b> ${venta.telefono}</h3>
          <h3 class="h3persona"><b>Direccion:</b> ${venta.calle} ${venta.calle_numero}</h3>
        </div>
        <div class="datos-venta">
          <h3 class="h3Bolsa"><b>Bolsa:</b> ${venta.marca_bolsa}</h3>
          <h3 class="h3Cantidad"><b>Cantidad:</b> ${venta.cantidad} bolsa/s de ${venta.kilos_bolsa}kg</h3>
          <h3 class="h3PrecioU"><b>Precio unitario:</b> $${(venta.precio).toFixed(2)}</h3>
        </div>
    
        <div class="total">
          <h2><b>Total:</b> $${(venta.totalventa).toFixed(2)}</h2>
        </div>

        <button class="btnCruz" onclick="borrar_venta(${venta.id_venta})"><img src="../../imagenes/cruz.png" class="cruz"></button>
    
      </div>`
    });
}


async function init() {
    await get20VentasClienteapp();
}

init();

const busqueda = document.getElementById('busqueda')

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
  let resultados = await sweetAlert_confirmar_borrado();
  console.log("confirma borrado:", resultados.confirma_borrado);
  console.log("confirma borrado de puntos:", resultados.confirma_borrar_puntos);
  if (resultados.confirma_borrado) {

    if (resultados.confirma_borrar_puntos) {
      await restarPuntosClientePorBorradoDeVenta(idVenta, ventas[0].id_cliente);
    }
    await borrar_venta_main(idVenta);
    location.reload();
  }
}



async function sweetAlert_confirmar_borrado(){
  let resultado;
  let checkBorrarPuntos;

  await Swal.fire({
    title: '¿Seguro que desea borrar la venta?',
    text: "Se perderán todos los datos de la venta y no se realizará seguimiento.",
    footer: "No se podrán revertir los cambios.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonText: "Cancelar",
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, borrar',
    html:
      '<div class="form-check">' +
      '  <input class="form-check-input" type="checkbox" id="borrar-puntos-checkbox" style="transform: scale(1.5);" checked>' +
      '  <label class="form-check-label" for="borrar-puntos-checkbox">' +
      '    Borrar puntos otorgados por la venta' +
      '  </label>' +
      '</div>'
  }).then((result) => {
    if (result.isConfirmed) {
      resultado = true;
      checkBorrarPuntos = document.getElementById('borrar-puntos-checkbox').checked;
    } else {
      resultado = false;
    }
  });

  let resultados = {
    confirma_borrado: resultado,
    confirma_borrar_puntos: checkBorrarPuntos
  }

  console.log(resultados);

  return resultados;
}
