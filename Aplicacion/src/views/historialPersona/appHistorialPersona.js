const venta_controller = require("../../controllers/venta_controller");
const cliente_controller = require("../../controllers/cliente_controller");

let salto = 0;
let newBusqueda;
let cliente;

let barra_busqueda = document.getElementById("barra-busqueda");
barra_busqueda.focus();

init();
function init() {
  listenerBotonExportar();

  newBusqueda = localStorage.getItem("historialCliente");
  localStorage.clear();

  crearListenerBuscador();
  listenerScrollParaTopeDePagina();

  if (newBusqueda) {
    mainFunctionHistorialPersona(newBusqueda);
  }
}

////////////////////////////////////////////////LISTENER BUSCADOR//////////////////////////////////////////////////////////////
function crearListenerBuscador() {
  const busqueda = document.getElementById("busqueda");
  busqueda.addEventListener("submit", (e) => {
    e.preventDefault();

    barra_busqueda = document.getElementById("barra-busqueda");
    newBusqueda = barra_busqueda.value;
    localStorage.setItem("historialCliente", newBusqueda);
    location.href = "../historialPersona/historialPersona.html";
  });
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function mainFunctionHistorialPersona(newBusqueda) {
  try {
    cliente = await cliente_controller.getClienteSegunBusqueda(newBusqueda);
  } catch (error) {
    console.log(error);
    if (error.message == "variosClientes") {
      await variosClientesModal.show();
      setTimeout(function () {
        barra_busqueda.focus();
      }, 100);
      return;
    }
    if (error.message == "noExisteCliente") {
      await noSeDetectoClienteModal.show();
      setTimeout(function () {
        barra_busqueda.focus();
      }, 100);
      return;
    }
  }
  renderTablaCliente(cliente);
  renderSelectorFiltros();
  crearListenerFiltrado();
  await mainCrearTablaPrincipalSegunFiltros(newBusqueda, "total", "");
}

function renderTablaCliente(cliente) {
  divTablaCliente = document.getElementById("divTablaCliente");

  if (cliente.calle_numero == null) {
    cliente.calle_numero = 0;
  }

  let direccion;
  if (cliente.dpto) {
    direccion =
      cliente.calle + ` ` + cliente.calle_numero + ` (Dpto: ${cliente.dpto})`;
  } else {
    direccion = cliente.calle + ` ` + cliente.calle_numero;
  }

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
    <TD id="tddireccion">${direccion}</TD>
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
  selectFiltrado.addEventListener("change", (e) => {
    e.preventDefault();

    /////RESETEO TABLA PRINCIPAL, SALTO Y TOTALES/////////////////////////////
    tablaVentas = document.getElementById("tablaventas");
    tablaTotales = document.getElementById("tablaTotales");
    tablaVentas.innerHTML = "";
    tablaTotales.innerHTML = "";
    salto = 0;
    importeTotal = 0;
    totalBolsas = 0;
    //QUITAR COMENTADO DE LA LINEA DE ABAJO CUANDO SE SOLUCIONE EXPORTACION A EXCEL EN SIGUIENTE ENTREGA
    //document.getElementById("btnExportar").style.display = "none";
    /////////////////////////////////////////////
    if (selectFiltrado.value == "elegir") {
      insertInputMonth();
      crearListenerFormMonth();
    } else {
      deleteInputMonth();
      mainCrearTablaPrincipalSegunFiltros(
        newBusqueda,
        selectFiltrado.value,
        ""
      );
    }
  });
}

function insertInputMonth() {
  divInputMonth = document.getElementById("divForm1");

  divInputMonth.innerHTML = `<form id="form1">
  <input type="month" class="inputmonth" id="inputmonth1">
  <button type="submit"><img src="../../imagenes/lupanegra.png" width="10px" id="lupanegra"></button>
  </form>`;
}

function deleteInputMonth() {
  divInputMonth = document.getElementById("divForm1");
  divInputMonth.innerHTML = "";
}

function crearListenerFormMonth() {
  form1 = document.getElementById("form1");
  form1.addEventListener("submit", (e) => {
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
    mainCrearTablaPrincipalSegunFiltros(
      newBusqueda,
      selectFiltrado.value,
      inputMonth.value
    );
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
</table>`;
}

let importeTotal = 0;
let totalBolsas = 0;

async function CrearOAgregarContenidoDeTablaPrincipalSegunFiltros(
  ventasCliente
) {
  tablaPrincipal = document.getElementById("tablaprincipal");
  let contador_paraColorDeFondo = 1;
  ventasCliente.forEach((element) => {
    importeTotal += element.totalventa;
    totalBolsas += element.cantidad;

    contador_paraColorDeFondo += 1;

    if (contador_paraColorDeFondo % 2 == 0) {
      tablaPrincipal.innerHTML += `<tr class="trventas1">
  <td>${element.fecha}</td>
  <td class="tdMarca">${element.marca_bolsa} ${element.kilos_bolsa}kg</td>
  <td>${element.cantidad}</td>
  <td>$${element.totalventa.toFixed(2)}</td>
  <td><button class="btnCruz" onclick="borrar_venta(${
    element.id_venta
  })"><img src="../../imagenes/cruz.png" class="cruz"></button></td>
</tr>`;
    } else {
      tablaPrincipal.innerHTML += `<tr class="trventas2">
  <td>${element.fecha}</td>
  <td class="tdMarca">${element.marca_bolsa} ${element.kilos_bolsa}kg</td>
  <td>${element.cantidad}</td>
  <td>$${element.totalventa.toFixed(2)}</td>
  <td><button class="btnCruz" onclick="borrar_venta(${
    element.id_venta
  })"><img src="../../imagenes/cruz.png" class="cruz"></button></td>
</tr>`;
    }
  });
}

function CrearTablaTotales() {
  divTablaTotales = document.getElementById("tablaprincipal");

  let trTotales = document.getElementById("trTotales");
  if (trTotales) trTotales.remove();

  divTablaTotales.innerHTML += `<tr class="trtotal" id="trTotales">
    <td colspan="2" id="tdCantTotal"><div class="container-totales">Cantidad total: ${totalBolsas}</div></td>
    <td colspan="3" id="tdImporteTotal"><div class="container-totales">Importe total: $${importeTotal.toFixed(
      2
    )}</div></td>
  </tr>`;
}

async function mainCrearTablaPrincipalSegunFiltros(
  newBusqueda,
  filtradoPrincipal,
  filtradoMes
) {
  let ventas = await venta_controller.get20VentasByIdClienteByFiltersController(
    cliente.id_cliente,
    filtradoPrincipal,
    filtradoMes,
    salto
  );
  console.log(ventas);
  if (salto == 0) {
    CrearTitulosTablaPrincipal();
  }

  CrearOAgregarContenidoDeTablaPrincipalSegunFiltros(ventas);

  if (ventas.length === 0 || ventas.length < 20) {
    CrearTablaTotales();
    //QUITAR COMENTADO DE LA LINEA DE ABAJO CUANDO SE SOLUCIONE EXPORTACION A EXCEL EN SIGUIENTE ENTREGA
    //document.getElementById("btnExportar").style.display = "block";
  }

  if (ventas.length != 0) {
    salto += 20;
  }
}

///////////////////////////////////////////////SCROLL////////////////////////////////////////////////////////////////////
function listenerScrollParaTopeDePagina() {
  const doc = document.documentElement;

  let flechaArriba = document.getElementById("flechaArriba");
  flechaArriba.style.display = "none";

  // Agrega un eventListener al evento scroll
  window.addEventListener("scroll", () => {
    var scrollPos =
      window.scrollY ||
      window.scrollTop ||
      document.getElementsByTagName("html")[0].scrollTop;
    var windowHeight = document.documentElement.clientHeight;

    //Mostrar el elemento si la posición actual de scroll es menor o igual a 0
    if (scrollPos <= 0) {
      flechaArriba.style.display = "none";
    } else {
      flechaArriba.style.display = "block";
    }

    // Si el usuario ha llegado al final de la página
    if (doc.scrollTop + window.innerHeight === doc.scrollHeight) {
      let select = document.getElementById("selectfiltrado");
      if (select.value == "elegir") {
        input = document.getElementById("inputmonth1");
        mainCrearTablaPrincipalSegunFiltros(
          newBusqueda,
          select.value,
          input.value
        );
      } else {
        console.log("holaa");
        mainCrearTablaPrincipalSegunFiltros(newBusqueda, select.value, "");
      }
    }
  });
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let userDecision = null;
let isChecked = null;
async function borrar_venta(idVenta) {
  userDecision = await deleteSaleModal.show();
  if (userDecision) {
    await venta_controller.borrarVenta_RestarPuntos(idVenta, isChecked);
    localStorage.setItem("historialCliente", cliente.id_cliente);
    location.reload();
    return;
  }

  userDecision = null;
  isChecked = null;
}

function listenerBotonExportar() {
  let btnExportar = document.getElementById("btnExportar");
  btnExportar.addEventListener("click", (e) => {
    e.preventDefault();
    exportarExcel();
  });
}

function exportarExcel() {
  let nombreArchivo;
  let intervaloTiempo;
  if (selectfiltrado.value == "elegir") {
    let inputMonth = document.getElementById("inputmonth1");
    let fecha = inputMonth.value;
    console.log(inputMonth.value);
    let fechaDividida = fecha.split("-");
    let mes = fechaDividida[1];
    let ano = fechaDividida[0];

    intervaloTiempo = mes + "-" + ano;
  }
  if (selectfiltrado.value == "total") {
    intervaloTiempo = "En total";
  }
  if (selectfiltrado.value == "anioatras") {
    intervaloTiempo = "1 año atras";
  }
  if (selectfiltrado.value == "anio") {
    intervaloTiempo = "En este año";
  }

  nombreArchivo = `Historial de Compras ${cliente.primernombre} ${cliente.nombrepila} ${cliente.apellido} (${intervaloTiempo}).`;

  let fileName = nombreArchivo + "xlsx";
  // Obtén la tabla por su ID
  var table = document.getElementById("tablaprincipal");

  // Crea un objeto de libro de Excel
  var wb = XLSX.utils.table_to_book(table, { sheet: "Hoja1" });

  // Crea un archivo XLSX y lo descarga
  XLSX.writeFile(wb, "tabla.xlsx");
}
