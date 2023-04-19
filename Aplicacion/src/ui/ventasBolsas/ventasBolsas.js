const { remote, app } = require('electron');
const { get20VentasPorBolsaSegunFiltros, cerrarVentanasEmergentes } = require('../../main');
const main = remote.require('./main');

mainFunctionVentasBolsas();
async function mainFunctionVentasBolsas() {
  listenerCruz();
  listenerBotonExportar();
  mainGetYRender20BolsasVentasSegunFiltros("total", "");
  listenerSelectFiltrado();
  listenerScroll();

}



function listenerCruz() {
  btnCruz = document.getElementById("btnCruz");

  btnCruz.addEventListener('click', (e) => {
    e.preventDefault();

    main.cerrarVentanasEmergentes();



  });
}


async function get20BolsasVentasSegunFiltrosApp(filtro, filtro2) {
  let bolsasVentas = await get20VentasPorBolsaSegunFiltros(filtro, filtro2);
  return bolsasVentas;
}


async function mainGetYRender20BolsasVentasSegunFiltros(filtro, filtro2) {

  let bolsasVentas = await get20BolsasVentasSegunFiltrosApp(filtro, filtro2);

  renderBolsasVentas(bolsasVentas);

}


function renderBolsasVentas(bolsasVentas) {
  let tabla = document.getElementById("tablaprincipal");

  bolsasVentas.forEach((element, index) => {
    let className = (index % 2 === 0) ? "trventas2" : "trventas1";
    tabla.innerHTML += `<tr class="${className}">
          <td class="tdBolsa">${element.marca_bolsa}</td>
          <td class="tdVentas">${element.cantventas}</td>
        </tr>`;
  });



}




function listenerSelectFiltrado() {
  let selectFiltrado = document.getElementById("selectfiltrado");
  selectFiltrado.addEventListener('change', (e) => {
    e.preventDefault();


    /////RESETEO TABLA PRINCIPAL//////////////////////
    CrearTitulosTablaPrincipal();
    /////////////////////////////////////////////
    if (selectFiltrado.value == "elegir") {
      insertInputMonth();
      crearListenerFormMonth();
    } else {
      deleteInputMonth();
      mainGetYRender20BolsasVentasSegunFiltros(selectFiltrado.value, "");
    }


  })
}



function CrearTitulosTablaPrincipal() {
  tabla = document.getElementById("tablaprincipal");
  tabla.innerHTML = `        <tr>
    <th>Bolsa</th>
    <th>Ventas</th>
</tr>`
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


    /////RESETEO TABLA PRINCIPAL//////////////////////
    CrearTitulosTablaPrincipal();
    /////////////////////////////////////////////


    selectFiltrado = document.getElementById("selectfiltrado");
    inputMonth = document.getElementById("inputmonth1");
    mainGetYRender20BolsasVentasSegunFiltros(selectFiltrado.value, inputMonth.value);
  });
}




function listenerScroll() {
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
  });
}



function descargarExcel(tabla, nombreArchivo) {
  // Crear un nuevo libro de Excel
  var libro = XLSX.utils.book_new();

  // Crear una hoja de trabajo a partir de la tabla
  var hoja = XLSX.utils.table_to_sheet(tabla);

  // Añadir la hoja al libro
  XLSX.utils.book_append_sheet(libro, hoja, 'Hoja1');

  // Crear un archivo binario a partir del libro de Excel
  var archivoBinario = XLSX.write(libro, { bookType: 'xlsx', type: 'binary' });

  // Crear un objeto Blob a partir del archivo binario
  var blob = new Blob([s2ab(archivoBinario)], { type: 'application/octet-stream' });

  // Crear un enlace de descarga para el archivo Blob
  var enlaceDescarga = document.createElement('a');
  enlaceDescarga.href = URL.createObjectURL(blob);
  enlaceDescarga.download = nombreArchivo;

  // Simular un clic en el enlace de descarga para iniciar la descarga
  enlaceDescarga.click();
}

function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
}


function listenerBotonExportar() {
  let btnExportar = document.getElementById("btnExportar");
  btnExportar.addEventListener('click', (e) => {
    e.preventDefault();
    var tabla = document.getElementById('tablaprincipal');
    var nombreArchivo = 'Ventas de bolsas.xlsx';
    descargarExcel(tabla, nombreArchivo);
  });
}

