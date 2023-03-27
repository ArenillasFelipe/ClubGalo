const { remote, app } = require('electron');
const { getCLientesmain, get20VentasClientemain, borrar_venta_main } = require('../../main');
const main = remote.require('./main');



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
        <p><b>Nombre: </b><button class="btn-nombre" onclick="botonPersona(${venta.id_cliente})"><h3>${venta.primernombre} ${venta.nombrepila} ${venta.apellido} (id:${venta.id_cliente})</h3></button></p>
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



function alertExplicacion(){
  alert(`  -Si se ingresa SOLO UNA palabra o numero se buscara coincidencia en cualquier dato de la venta
  -DOS PALABRAS se busca por primer nombre o nombre de pila y apellido (En ese orden)
  -TRES PALABRASse busca por Primer nombre, Nombre de pila y apellido (En ese orden)
  -Para buscar por FECHAS debe seguir el siguiente formato: DD/MM/AAAA`)
  location.reload();
}



function botonPersona(idCliente){
  sessionStorage.setItem("historialCliente",  idCliente);
  location.href="../historialPersona/historialPersona.html";
}


async function borrar_venta(idVenta) {
  let confirma_borrado = await sweetAlert_confirmar_borrado()
  if (confirma_borrado) {
    await borrar_venta_main(idVenta);
    location.reload();
  }
}



async function sweetAlert_confirmar_borrado(){
  let resultado;
  await Swal.fire({
    title: '¿Seguro que desea borrar la venta?',
    text: "Se perderan todos los datos de la venta y no se realizara seguimiento",
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
    }else{
      resultado = false;
    }
  })

  return resultado;
}
