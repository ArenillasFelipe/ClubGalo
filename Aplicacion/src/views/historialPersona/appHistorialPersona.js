const controller = require('../../controllers/historialPersona_controller');
const sweetAlerts = require('../../utils/sweetAlerts');


let salto = 0;
let newBusqueda;
let cliente;

let barra_busqueda = document.getElementById('barra-busqueda');
barra_busqueda.focus();

init();
function init() {

  newBusqueda = sessionStorage.getItem("historialCliente");
  sessionStorage.clear();

  crearListenerBuscador();
  listenerScrollParaTopeDePagina();

  if (newBusqueda) {
    mainFunctionHistorialPersona(newBusqueda);
  }

}





////////////////////////////////////////////////LISTENER BUSCADOR//////////////////////////////////////////////////////////////
function crearListenerBuscador() {
  const busqueda = document.getElementById('busqueda');
  busqueda.addEventListener('submit', (e) => {
    e.preventDefault();

    barra_busqueda = document.getElementById('barra-busqueda')
    newBusqueda = barra_busqueda.value;
    sessionStorage.setItem("historialCliente", newBusqueda);
    location.href = "../historialPersona/historialPersona.html";

  })
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function mainFunctionHistorialPersona(newBusqueda) {
  try {
    cliente = await controller.getClienteSegunBusqueda(newBusqueda);
  } catch (error) {
    console.log(error)
    if (error.message == "variosClientes") {
    await sweetAlerts.variosClientes();
    return
    }
    if (error.message == "noExisteCliente") {
      await sweetAlerts.noSeDetectoCliente();
      return
    }
  }
  renderTablaCliente(cliente);
  renderSelectorFiltros();
  crearListenerFiltrado();
  await mainCrearTablaPrincipalSegunFiltros(newBusqueda, "total", "");


}





function renderTablaCliente(cliente) {
  divTablaCliente = document.getElementById("divTablaCliente");

  divTablaCliente.innerHTML = `    <TABLE class="tabla1">
  <TR>
    <TH id="thnombre">Nombre:</TH>
    <TD id="tdnombre">${cliente.primernombre} ${cliente.nombrepila} ${cliente.apellido}</TD>
  </TR>
  <TR>
    <TH id="thtelefono">Telefono:</TH>
    <TD id="tdtelefono">${cliente.telefono}</TD>
  </TR>
  <TR>
    <TH id="thdireccion">Direccion:</TH>
    <TD id="tddireccion">${cliente.calle} ${cliente.calle_numero}</TD>
  </TR>
  <TR>
  <TH id="thdireccion">Puntos:</TH>
  <TD id="tddireccion">${cliente.puntos}</TD>
</TR>
</TABLE>`;
}

function renderSelectorFiltros() {
  divTablaCliente = document.getElementById("divTablaCliente");

  divTablaCliente.innerHTML += `<div id="filtrar">
<div class="container-filtrar">
  <label>Intervalo de tiempo:</label>
  <select name="selectfiltrado" id="selectfiltrado">
  <option value="total">En total</option>
  <option value="anioatras">1 año atras</option> 
  <option value="anio">En este año</option>
  <option value="elegir">Elegir mes:</option>
  </select>
  <div id="divForm1">
</div>
</div></div>`;

}


function crearListenerFiltrado() {

  let selectFiltrado = document.getElementById("selectfiltrado");
  selectFiltrado.addEventListener('change', (e) => {
    e.preventDefault();

    /////RESETEO TABLA PRINCIPAL, SALTO Y TOTALES/////////////////////////////
    tablaVentas = document.getElementById("tablaventas");
    tablaTotales = document.getElementById("tablaTotales");
    tablaVentas.innerHTML = "";
    tablaTotales.innerHTML = "";
    salto = 0;
    importeTotal = 0;
    totalBolsas = 0;
    /////////////////////////////////////////////
    if (selectFiltrado.value == "elegir") {
      insertInputMonth();
      crearListenerFormMonth();
    } else {
      deleteInputMonth();
      mainCrearTablaPrincipalSegunFiltros(newBusqueda, selectFiltrado.value, "");
    }


  })
}

function insertInputMonth() {
  divInputMonth = document.getElementById("divForm1");

  divInputMonth.innerHTML = `<form id="form1">
  <input type="month" class="inputmonth" id="inputmonth1">
  <button type="submit"><img src="../../imagenes/lupanegra.png" width="10px" id="lupanegra"></button>
  </form>`

}

function deleteInputMonth() {
  divInputMonth = document.getElementById("divForm1");
  divInputMonth.innerHTML = "";
}


function crearListenerFormMonth() {

  form1 = document.getElementById("form1");
  form1.addEventListener('submit', (e) => {
    e.preventDefault();


    /////RESETEO TABLA PRINCIPAL, SALTO Y TOTALES/////////////////////////////
    tablaVentas = document.getElementById("tablaventas");
    tablaTotales = document.getElementById("tablaTotales");
    tablaVentas.innerHTML = "";
    tablaTotales.innerHTML = "";
    salto = 0;
    importeTotal = 0;
    totalBolsas = 0;
    /////////////////////////////////////////////


    selectFiltrado = document.getElementById("selectfiltrado");
    inputMonth = document.getElementById("inputmonth1");
    mainCrearTablaPrincipalSegunFiltros(newBusqueda, selectFiltrado.value, inputMonth.value);
  });
}


function CrearTitulosTablaPrincipal() {
  tablaPrincipal = document.getElementById("tablaventas");
  tablaPrincipal.innerHTML += `<table id="tablaprincipal" class="tabla">
<tr>
  <th class="date">Fecha</th>
  <th class="producto">Producto</th>
  <th class="cantidad">Cantidad</th>
  <th class="importe">Importe</th>
  <th></th>
</tr>
</table>`
}

let importeTotal = 0;
let totalBolsas = 0;

async function CrearOAgregarContenidoDeTablaPrincipalSegunFiltros(ventasCliente) {

  tablaPrincipal = document.getElementById("tablaprincipal");
  let contador_paraColorDeFondo = 1;
  ventasCliente.forEach(element => {

    importeTotal += element.venta.totalventa;
    totalBolsas += element.venta.cantidad;

    contador_paraColorDeFondo += 1;

    if (contador_paraColorDeFondo % 2 == 0) {
      tablaPrincipal.innerHTML += `<tr class="trventas1">
  <td>${element.venta.fecha}</td>
  <td class="tdMarca">${element.bolsa.marca_bolsa} ${element.bolsaKilo.kilos_bolsa}kg</td>
  <td>${(element.venta).cantidad}</td>
  <td>$${((element.venta).totalventa).toFixed(2)}</td>
  <td><button class="btnCruz" onclick="borrar_venta(${(element.venta).id_venta})"><img src="../../imagenes/cruz.png" class="cruz"></button></td>
</tr>`
    } else {
      tablaPrincipal.innerHTML += `<tr class="trventas2">
  <td>${element.venta.fecha}</td>
  <td class="tdMarca">${element.bolsa.marca_bolsa} ${element.bolsaKilo.kilos_bolsa}kg</td>
  <td>${(element.venta).cantidad}</td>
  <td>$${((element.venta).totalventa).toFixed(2)}</td>
  <td><button class="btnCruz" onclick="borrar_venta(${(element.venta).id_venta})"><img src="../../imagenes/cruz.png" class="cruz"></button></td>
</tr>`
    }

  });

}


function CrearTablaTotales() {
  divTablaTotales = document.getElementById("tablaprincipal");


  let trTotales = document.getElementById("trTotales");
  if (trTotales) trTotales.remove();

  divTablaTotales.innerHTML += `<tr class="trtotal" id="trTotales">
    <td colspan="2" id="tdCantTotal"><div class="container-totales">Cantidad total: ${totalBolsas}</div></td>
    <td colspan="3" id="tdImporteTotal"><div class="container-totales">Importe total: $${importeTotal.toFixed(2)}</div></td>
  </tr>`
}



async function mainCrearTablaPrincipalSegunFiltros(newBusqueda, filtradoPrincipal, filtradoMes) {

  let ventasConDatos = await controller.get20VentasByIdClienteByFiltersController(cliente.id_cliente, filtradoPrincipal, filtradoMes, salto);
  console.log(ventasConDatos);
  if (salto == 0) {
    CrearTitulosTablaPrincipal();
  }

  CrearOAgregarContenidoDeTablaPrincipalSegunFiltros(ventasConDatos);

  if (ventasConDatos.length === 0 || ventasConDatos.length < 20) {
    CrearTablaTotales();
  }

  if (ventasConDatos.length != 0) {
    salto += 20;
  }

}

///////////////////////////////////////////////SCROLL////////////////////////////////////////////////////////////////////
function listenerScrollParaTopeDePagina() {
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
      let select = document.getElementById("selectfiltrado");
      if (select.value == "elegir") {
        input = document.getElementById("inputmonth1");
        mainCrearTablaPrincipalSegunFiltros(newBusqueda, filtradoPrincipal, filtradoMes);
      } else {
        console.log("holaa")
        mainCrearTablaPrincipalSegunFiltros(newBusqueda, select.value, "");
      }



    }
  });
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function borrar_venta(idVenta) {
  let resultados = await sweetAlerts.confirmar_borrado_venta();
  if (resultados.confirma_borrado) {

    if (resultados.confirma_borrar_puntos) {
      await controller.borrarVenta_RestarPuntos(idVenta, true);
      sessionStorage.setItem("historialCliente", cliente.id_cliente);
      location.reload();
      return
    }
    await controller.borrarVenta_RestarPuntos(idVenta, false);
    sessionStorage.setItem("historialCliente", cliente.id_cliente);
    location.reload();
  }
}
