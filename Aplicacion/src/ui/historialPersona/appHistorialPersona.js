const { remote, app } = require('electron');
const { getCLientesmain, borrar_venta_main, getVentasClientemain, getClientefullnamemain, getsoloClientefullnamemain, notificacionNoVenta, notificacionNoCliente } = require('../../main');
const main = remote.require('./main')

let salto = 0;
let newBusqueda;

PreguntarClickNombreDesdeHistorialGeneralOBuscador();
function PreguntarClickNombreDesdeHistorialGeneralOBuscador() {
  newBusqueda = sessionStorage.getItem("historialCliente");
  sessionStorage.setItem("historialCliente", undefined);

  crearListenerBuscador();
  listenerScrollParaTopeDePagina();

  if (newBusqueda != "undefined") {
    mainFunctionHistorialPersona(newBusqueda);
  }

}





////////////////////////////////////////////////LISTENER BUSCADOR//////////////////////////////////////////////////////////////
function crearListenerBuscador() {
  const busqueda = document.getElementById('busqueda')
  busqueda.addEventListener('submit', (e) => {
    e.preventDefault();

    barra_busqueda = document.getElementById('barra-busqueda')
    newBusqueda = barra_busqueda.value;
    sessionStorage.setItem("historialCliente",  newBusqueda);
    location.href="../historialPersona/historialPersona.html";

  })
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function mainFunctionHistorialPersona(newBusqueda) {
  let cliente = await getClienteSegunBusqueda(newBusqueda)
  if (cliente.length > 1) {
    sweetAlertVariosClientes();
    return
  }
  if (cliente.length == 0) {
    sweetAlertNoCliente();
    return
  }
  renderTablaCliente(cliente[0]);
  renderSelectorFiltros();
  crearListenerFiltrado();
  mainCrearTablaPrincipalSegunFiltros(newBusqueda, "total", "");


}


async function getClienteSegunBusqueda(newBusqueda) {
  console.log("newBusqueda en getSoloCLiente: ", newBusqueda)
  resultado = await getsoloClientefullnamemain(newBusqueda);
  return resultado;
}


async function getTotalVentasYClienteSegunBusquedaApp(newBusqueda) {

  VentasYCliente = await main.getClientefullnamemain(newBusqueda, "total", "", salto);
  return ventasCliente;

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

    importeTotal += element.totalventa;
    totalBolsas += element.cantidad;

    contador_paraColorDeFondo += 1;

    var dia = new Date();
    var mes = new Date();
    var anio = new Date();
    dia = element.fecha.getDate();
    mes = element.fecha.getMonth();
    mes = mes + 1;
    anio = element.fecha.getFullYear();

    if (contador_paraColorDeFondo % 2 == 0) {
      tablaPrincipal.innerHTML += `<tr class="trventas1">
  <td>${dia}/${mes}/${anio}</td>
  <td class="tdMarca">${element.marca_bolsa} ${element.kilos_bolsa}kg</td>
  <td>${element.cantidad}</td>
  <td>$${(element.totalventa).toFixed(2)}</td>
  <td><button class="btnCruz" onclick="borrar_venta(${element.id_venta})"><img src="../../imagenes/cruz.png" class="cruz"></button></td>
</tr>`
    } else {
      tablaPrincipal.innerHTML += `<tr class="trventas2">
  <td>${dia}/${mes}/${anio}</td>
  <td class="tdMarca">${element.marca_bolsa} ${element.kilos_bolsa}kg</td>
  <td>${element.cantidad}</td>
  <td>$${(element.totalventa).toFixed(2)}</td>
  <td><button class="btnCruz" onclick="borrar_venta(${element.id_venta})"><img src="../../imagenes/cruz.png" class="cruz"></button></td>
</tr>`
    }

  });

}


function CrearTablaTotales() {
    divTablaTotales = document.getElementById("tablaprincipal");

    try {
      let trTotales = document.getElementById("trTotales");
      trTotales.remove();
    } catch (error) {
      //no hace nada
    }


    divTablaTotales.innerHTML += `<tr class="trtotal" id="trTotales">
    <td colspan="2" id="tdCantTotal"><div class="container-totales">Cantidad total: ${totalBolsas}</div></td>
    <td colspan="3" id="tdImporteTotal"><div class="container-totales">Importe total: $${importeTotal.toFixed(2)}</div></td>
  </tr>`
}



async function mainCrearTablaPrincipalSegunFiltros(newBusqueda, filtradoPrincipal, filtradoMes) {

  let VentasSegunFiltro = await getClientefullnamemain(newBusqueda, filtradoPrincipal, filtradoMes, salto);

  if (salto == 0) {
    CrearTitulosTablaPrincipal();
  }

  CrearOAgregarContenidoDeTablaPrincipalSegunFiltros(VentasSegunFiltro);

  if (VentasSegunFiltro.length === 0 || VentasSegunFiltro.length < 20) {
    CrearTablaTotales();
  }

  if (VentasSegunFiltro.length != 0) {
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



// Selecciona el objeto document.documentElement para acceder a las propiedades de la página




// botonHistorial();

// function botonHistorial() {
//   let idCliente = sessionStorage.getItem("historialCliente");
//   sessionStorage.setItem("historialCliente", undefined);
//   if (idCliente != "undefined") {
//     buscarCliente(idCliente);
//   }
// }

// async function buscarCliente(newBusqueda) {
//   console.log("newBusqueda:", newBusqueda)
//   resultado = await getsoloClientefullnamemain(newBusqueda);
//   console.log("length:", resultado.length);
//   if (resultado.length > 1) {
//     await sweetAlertVariosClientes();
//     location.reload();
//   } else if (resultado.length == 0) {
//     sweetAlertNoCliente();
//   } else {
//     await actualizarSegunFiltros(newBusqueda);
//   }

// }

// function innerDatosCliente(ventasCliente) {
//   console.log(ventasCliente);
//   divtabla1 = document.getElementById("divtabla1");

//   divtabla1.innerHTML = "";
//   divtabla1.innerHTML += `    <TABLE class="tabla1">
//   <TR>
//     <TH id="thnombre">Nombre:</TH>
//     <TD id="tdnombre">${ventasCliente[0].primernombre} ${ventasCliente[0].nombrepila} ${ventasCliente[0].apellido}</TD>
//   </TR>
//   <TR>
//     <TH id="thtelefono">Telefono:</TH>
//     <TD id="tdtelefono">${ventasCliente[0].telefono}</TD>
//   </TR>
//   <TR>
//     <TH id="thdireccion">Direccion:</TH>
//     <TD id="tddireccion">${ventasCliente[0].calle} ${ventasCliente[0].calle_numero}</TD>
//   </TR>
//   <TR>
//   <TH id="thdireccion">Puntos:</TH>
//   <TD id="tddireccion">${ventasCliente[0].puntos}</TD>
// </TR>
// </TABLE>`;

//   divtabla1.innerHTML += `<div id="filtrar">
// <div class="container-filtrar">
//   <label>Intervalo de tiempo:</label>
//   <select name="selectfiltrado" id="selectfiltrado">
//   <option value="total">En total</option>
//   <option value="anioatras">1 año atras</option> 
//   <option value="anio">En este año</option>
//   <option value="elegir">Elegir mes:</option>
//   </select>
//   <div id="divForm1">
// </div>
// </div></div>`;
//   selectFiltrado = document.getElementById("selectfiltrado");
//   divForm1 = document.getElementById("divForm1");

//   selectFiltrado.addEventListener('change', (e) => {
//     e.preventDefault();
//     tablaVentas = document.getElementById("tablaventas");
//     tablaTotales = document.getElementById("tablaTotales");
//     tablaVentas.innerHTML = "";
//     tablaTotales.innerHTML = "";
//     salto = 0;
//     select = document.getElementById("selectfiltrado");
//     input = document.getElementById("inputmonth1");

//     if (select.value != "elegir") {
//       divForm1.innerHTML = "";
//       actualizarSegunFiltros(newBusqueda, select.value, algo);
//     } else {
//       divForm1.innerHTML = `<form id="form1">
//       <input type="month" class="inputmonth" id="inputmonth1">
//       <button type="submit"><img src="../../imagenes/lupanegra.png" width="10px" id="lupanegra"></button>
//       </form>`

//       form1 = document.getElementById("form1");

//       form1.addEventListener('submit', (e) => {
//         e.preventDefault();
//         select = document.getElementById("selectfiltrado");
//         input = document.getElementById("inputmonth1");

//         actualizarSegunFiltros(newBusqueda, select.value, input.value);
//       });
//     }


//   })







//   innerTablaPrincipal(ventasCliente);



// }

// function innerTablaPrincipal(ventasCliente) {
//   tablaVentas = document.getElementById("tablaventas");
//   tablaVentas.innerHTML += ` <table id="tablaprincipal" class="tabla">
// <tr>
//   <th class="date">Fecha</th>
//   <th class="producto">Producto</th>
//   <th class="cantidad">Cantidad</th>
//   <th class="importe">Importe</th>
//   <th></th>
// </tr>
// </table>;`
//   let total = 0;
//   let cantidad = 0;

//   tablaVentas = document.getElementById("tablaprincipal");
//   tablaTotales = document.getElementById("tablaTotales");
//   let contador = 1;
//   ventasCliente.forEach(element => {
//     contador += 1
//     total += (element.totalventa);
//     cantidad += element.cantidad;
//     var dia = new Date();
//     var mes = new Date();
//     var anio = new Date();

//     dia = element.fecha.getDate();
//     mes = element.fecha.getMonth();
//     mes = mes + 1;
//     anio = element.fecha.getFullYear();

//     if (contador % 2 == 0) {
//       tablaVentas.innerHTML += `<tr class="trventas1">
//   <td>${dia}/${mes}/${anio}</td>
//   <td class="tdMarca">${element.marca_bolsa} ${element.kilos_bolsa}kg</td>
//   <td>${element.cantidad}</td>
//   <td>$${(element.totalventa).toFixed(2)}</td>
//   <td><button class="btnCruz" onclick="borrar_venta(${element.id_venta})"><img src="../../imagenes/cruz.png" class="cruz"></button></td>
// </tr>`;
//     } else {
//       tablaVentas.innerHTML += `<tr class="trventas2">
//   <td>${dia}/${mes}/${anio}</td>
//   <td class="tdMarca">${element.marca_bolsa} ${element.kilos_bolsa}kg</td>
//   <td>${element.cantidad}</td>
//   <td>$${(element.totalventa).toFixed(2)}</td>
//   <td><button class="btnCruz" onclick="borrar_venta(${element.id_venta})"><img src="../../imagenes/cruz.png" class="cruz"></button></td>
// </tr>`;
//     }

//   });

//   salto += 20;

//   tablaTotales.innerHTML = `<tr class="trtotal">
//   <td colspan="2">Cantidad total: ${cantidad}</td>
//   <td colspan="3">Importe total: $${total.toFixed(2)}</td>
// </tr>`





// }



// const busqueda = document.getElementById('busqueda')

// busqueda.addEventListener('submit', (e) => {
//   e.preventDefault();
//   barra_busqueda = document.getElementById('barra-busqueda')

//   newBusqueda = barra_busqueda.value;

//   buscarCliente(newBusqueda);

// })



// async function actualizarSegunFiltros(newBusqueda, filtrado, filtrado2) {
//   console.log("filtrado y filtrado 2 en app:", filtrado, filtrado2);
//   if (filtrado != "total" && filtrado != "elegir" && filtrado != "anio" && filtrado != "anioatras") {
//     console.log("entro");
//     let total = "total";
//     resultado = await main.getClientefullnamemain(newBusqueda, total, algo, salto);
//     console.log("termino llamada con total entre comillas");
//     if (resultado.length != 0) {
//       innerDatosCliente(resultado);
//     } else {
//       //sweetAlertNoVentas()
//     }
//   } else {
//     resultado = await main.getClientefullnamemain(newBusqueda, filtrado, filtrado2, salto);
//     if (resultado.length != 0) {
//       innerTablaPrincipal(resultado);
//     } else {
//       //sweetAlertNoVentas();
//       innerTablaPrincipal(resultado);
//     }
//   }

// }

async function sweetAlertNoCliente() {
  await Swal.fire({
    title: "No se ha detectado ese cliente",
    icon: "error",
    backdrop: true,
    showConfirmButton: true,
    allowOutsideClick: true,
    allowEscapeKey: true,
    allowEnterKey: true,
    stopKeydownPropagation: false,
    position: "center",
  })
}


async function sweetAlertNoVentas() {
  await Swal.fire({
    title: "El cliente no tiene ventas en el filtro seleccionado",
    icon: "error",
    backdrop: true,
    showConfirmButton: true,
    allowOutsideClick: true,
    allowEscapeKey: true,
    allowEnterKey: true,
    stopKeydownPropagation: false,
    position: "center",
  })
}


async function sweetAlertVariosClientes() {
  await Swal.fire({
    title: "Existen varios clientes con ese nombre",
    text: "Ingrese el nombre completo o el id",
    icon: "error",
    backdrop: true,
    showConfirmButton: true,
    allowOutsideClick: true,
    allowEscapeKey: true,
    allowEnterKey: true,
    stopKeydownPropagation: false,
    position: "center",
  })
}

async function borrar_venta(idVenta) {
  let confirma_borrado = await sweetAlert_confirmar_borrado()
  if (confirma_borrado) {
    await borrar_venta_main(idVenta);
    sessionStorage.setItem("historialCliente",  newBusqueda);
    location.href="../historialPersona/historialPersona.html";
  }
}



async function sweetAlert_confirmar_borrado() {
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
    } else {
      resultado = false;
    }
  })

  return resultado;
}