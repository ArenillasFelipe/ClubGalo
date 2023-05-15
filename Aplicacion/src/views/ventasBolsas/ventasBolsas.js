const { remote } = require('electron');
const main = remote.require('./main');
const estadisticas_controller = require('../../controllers/estadisticas_controller');

mainFunctionVentasBolsas();
async function mainFunctionVentasBolsas() {
  listenerCruz();
  listenerBotonExportar();
  mainGetYRenderBolsasVentasSegunFiltros("total");
  listenerSelectFiltrado();

}



function listenerCruz() {
  btnCruz = document.getElementById("btnCruz");

  btnCruz.addEventListener('click', (e) => {
    e.preventDefault();

    main.cerrarVentanasEmergentes();



  });
}


async function getBolsasVentasSegunFiltrosApp(filtro, filtro2) {
  let bolsasVentas = await estadisticas_controller.getVentasPorBolsaSegunFiltros(filtro, filtro2)
  return bolsasVentas;
}


async function mainGetYRenderBolsasVentasSegunFiltros(filtro, filtro2) {

  let bolsasVentas = await getBolsasVentasSegunFiltrosApp(filtro, filtro2);

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
      mainGetYRenderBolsasVentasSegunFiltros(selectFiltrado.value);
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
    mainGetYRenderBolsasVentasSegunFiltros(selectFiltrado.value, inputMonth.value);
  });
}



function exportTableToExcel(tableID, filename = ''){
  var downloadLink;
  var dataType = 'application/vnd.ms-excel';
  var tableSelect = document.getElementById(tableID);
  var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
  
  // Specify file name
  filename = filename?filename+'.xls':'excel_data.xls';
  
  // Create download link element
  downloadLink = document.createElement("a");
  
  document.body.appendChild(downloadLink);
  
  if(navigator.msSaveOrOpenBlob){
      var blob = new Blob(['ufeff', tableHTML], {
          type: dataType
      });
      navigator.msSaveOrOpenBlob( blob, filename);
  }else{
      // Create a link to the file
      downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
  
      // Setting the file name
      downloadLink.download = filename;
      
      //triggering the function
      downloadLink.click();
  }
}


function listenerBotonExportar() {
  let btnExportar = document.getElementById("btnExportar");
  btnExportar.addEventListener('click', (e) => {
    e.preventDefault();
    var nombreArchivo = 'Ventas de bolsas';
    exportTableToExcel("tablaprincipal", nombreArchivo);
  });
}

