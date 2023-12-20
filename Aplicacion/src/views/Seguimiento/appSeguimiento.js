const venta_controller = require('../../controllers/venta_controller');

let salto = 0;

actualizarVentasVencidas();
async function actualizarVentasVencidas(){
  await venta_controller.actualizarVentasVencidas();
}

listenerBtnSiguiente();
listenerBtnAnterior();

get20VentasPorVencer();
async function get20VentasPorVencer() {
  let ventasConClienteMascotas = [];
  ventasConClienteMascotas = await venta_controller.get20VentasPorVencerConMascotas(salto);
  if (ventasConClienteMascotas.length > 0) {
    if(await verificarUltimaPagina()) {
      document.getElementById('btnSiguiente').style.display = "none";
    }
    renderVentasPorVencer(ventasConClienteMascotas);
  }
}


function renderVentasPorVencer(ventasConClienteMascotas) {

  let container_paginado = document.getElementById("container-paginado");
  container_paginado.style.display = "none";

  divAvisos = document.getElementById("avisos");
  divAvisos.innerHTML = "";

  let direccion;

  ventasConClienteMascotas.forEach(element => {

    if (element.cliente.dpto) {
      direccion = element.cliente.calle + ` ` + element.cliente.calle_numero + ` (Dpto: ${element.cliente.dpto})`;
    }else{
      direccion = element.cliente.calle + ` ` + element.cliente.calle_numero;
    }

    let claseParaCss = "dia" + element.venta.vencimiento;
    let tituloAviso = element.venta.vencimiento == 1 ? `Queda ${element.venta.vencimiento} dia o menos` : `Quedan ${element.venta.vencimiento} dias`;
    if(element.venta.vencimiento == 0) tituloAviso = "Vence hoy";

    divAvisos = document.getElementById("avisos");

    if (element.cliente.validoCliente == true) {
      divAvisos.innerHTML +=
      `
    <div class="container-aviso ${claseParaCss}">
        <h1>${tituloAviso}</h1>
        <img src="../../imagenes/perro-gato.png" class="img-perrogato">
        <div class="container-mascotas">
          <p class="pmascotas" id="pmascotas`+ element.venta.id_venta + `"><b>Mascotas:</b> </p>
        </div>
        <p class="panimal"><b>Animal/es:</b> ${element.mascotas[0].animal}
        </p>
      <img src="../../imagenes/persona.png" class="img-persona">
      <p class="pnombre"><b>Nombre:</b> ${element.cliente.primernombre + " " + element.cliente.nombrepila + " " + element.cliente.apellido}</p>
      <p class="ptelefono"><b>Tel:</b> ${element.cliente.telefono}</p>
      <p class="pdireccion"><b>Direccion:</b> ${direccion}</p>
      <p class="ppuntos"><b>Puntos:</b> ${element.cliente.puntos}</p>
      <button onclick="btnVenta(${element.cliente.id_cliente})" class="btnVenta">Venta</button>
    </div>`
    }else{
      divAvisos.innerHTML +=
      `
    <div class="container-aviso ${claseParaCss}">
        <h1>${tituloAviso}</h1>
        <img src="../../imagenes/perro-gato.png" class="img-perrogato">
        <div class="container-mascotas">
          <p class="pmascotas" id="pmascotas`+ element.venta.id_venta + `"><b>Mascotas:</b> </p>
        </div>
        <p class="panimal"><b>Animal/es:</b> ${element.mascotas[0].animal}
        </p>
      <img src="../../imagenes/persona.png" class="img-persona">
      <p class="pnombre"><b>Nombre:</b> ${element.cliente.primernombre + " " + element.cliente.nombrepila + " " + element.cliente.apellido}</p>
      <p class="ptelefono"><b>Tel:</b> ${element.cliente.telefono}</p>
      <p class="pdireccion"><b>Direccion:</b> ${element.cliente.calle + " " + element.cliente.calle_numero}</p>
      <p class="ppuntos"><b>Puntos:</b> ${element.cliente.puntos}</p>
    </div>`
    }



    
    container_paginado.style.display = "block";

    let idmascotas = "pmascotas" + element.venta.id_venta;
    pmascotas = document.getElementById(idmascotas);
    let mascotas = element.mascotas;

    mascotas.forEach(element => {
      pmascotas.innerHTML += ` ` + element.nombremascota + ` -`;
      
    });



  });

}



function listenerBtnSiguiente() {
  let btnSiguiente = document.getElementById('btnSiguiente')
  btnSiguiente.addEventListener('click', (e) => {
    e.preventDefault();
    paginaSiguiente();
  })

}

function paginaSiguiente() {

  document.getElementById('btnAnterior').style.display = "block";

  let h5Pagina = document.getElementById('h5Pagina');
  h5Pagina.textContent = parseInt(h5Pagina.textContent) + 1;
  salto = (parseInt(h5Pagina.textContent) - 1) * 20;
  get20VentasPorVencer();
}


function listenerBtnAnterior() {
  let btnAnterior = document.getElementById('btnAnterior')
  btnAnterior.addEventListener('click', (e) => {
    e.preventDefault();
    paginaAnterior();
  })

}

function paginaAnterior() {

  document.getElementById('btnSiguiente').style.display = "block";

  let h5Pagina = document.getElementById('h5Pagina');


  if (parseInt(h5Pagina.textContent) > 1) {

  h5Pagina.textContent = parseInt(h5Pagina.textContent) - 1;
  salto = (parseInt(h5Pagina.textContent) - 1) * 20;
  get20VentasPorVencer();
  }

  if (parseInt(h5Pagina.textContent) == 1) {
    document.getElementById('btnAnterior').style.display = "none";
  }


}

async function verificarUltimaPagina() {
  let ventasConClienteMascotas = [];
  ventasConClienteMascotas = await venta_controller.get20VentasPorVencerConMascotas(salto + 20);
  if (ventasConClienteMascotas.length == 0) {
    return true
  }else{
    return false
  }
}


function btnVenta(id_cliente) {
  localStorage.setItem("ClienteVenta",  id_cliente);
  location.href="../Venta/venta.html";
}