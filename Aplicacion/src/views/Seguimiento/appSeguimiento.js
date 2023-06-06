const venta_controller = require('../../controllers/venta_controller');

actualizarVentasVencidas();
async function actualizarVentasVencidas(){
  await venta_controller.actualizarVentasVencidas();
}

getVentasPorVencer();
async function getVentasPorVencer() {
  let ventasConClienteMascotas = [];
  ventasConClienteMascotas = await venta_controller.getVentasPorVencerConMascotas();
  if (ventasConClienteMascotas.length > 0) {
    renderVentasPorVencer(ventasConClienteMascotas);
  }
}


function renderVentasPorVencer(ventasConClienteMascotas) {
  ventasConClienteMascotas.forEach(element => {


    let claseParaCss = "dia" + element.venta.vencimiento;
    let tituloAviso = element.venta.vencimiento == 1 ? `Queda ${element.venta.vencimiento} dia o menos` : `Quedan ${element.venta.vencimiento} dias`;
    if(element.venta.vencimiento == 0) tituloAviso = "Vence hoy";

    divAvisos = document.getElementById("avisos");
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


    let idmascotas = "pmascotas" + element.venta.id_venta;
    pmascotas = document.getElementById(idmascotas);
    let mascotas = element.mascotas;

    mascotas.forEach(element => {
      pmascotas.innerHTML += ` ` + element.nombremascota + ` -`;
      
    });



  });

}