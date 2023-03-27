const { remote, app } = require('electron');
const { getCLientesmain, getClientesTodos, getVentasActivasmain, getVentasClientemain } = require('../../main');
const main = remote.require('./main')


let premiumPocoValores = {
  P1_5: 0.065,
  P6_10: 0.135,
  P11_15: 0.190,
  P16_20: 0.237,
  P21_25: 0.282,
  P26_30: 0.320,
  P31_35: 0.355,
  P36_40: 0.392,
  P41_45: 0.427,
  P46_50: 0.457,
  P51_55: 0.490,
  P56_60: 0.522
}

let premiumMedioValores = {
  P1_5: 0.072,
  P6_10: 0.150,
  P11_15: 0.207,
  P16_20: 0.260,
  P21_25: 0.307,
  P26_30: 0.352,
  P31_35: 0.392,
  P36_40: 0.430,
  P41_45: 0.470,
  P46_50: 0.505,
  P51_55: 0.537,
  P56_60: 0.572
}

let premiumAltoValores = {
  P1_5: 0.080,
  P6_10: 0.167,
  P11_15: 0.230,
  P16_20: 0.287,
  P21_25: 0.340,
  P26_30: 0.387,
  P31_35: 0.432,
  P36_40: 0.475,
  P41_45: 0.515,
  P46_50: 0.555,
  P51_55: 0.595,
  P56_60: 0.630
}


function premium(venta) {
  let dias;
  let kilosComida;
  let kilosDia = 0;
  let diasRestantes = 0;

  dias = calcularDias(venta[0].fecha);
  kilosComida = venta[0].kilos;

  for (let i = 0; i < venta.length; i++) {
    const element = venta[i];

    console.log(element);

    if (element.actividad == "baja") {
      if (element.peso >= 1 && element.peso <= 5) {
        kilosComida = kilosComida - (premiumPocoValores.P1_5 * dias);
        kilosDia = kilosDia + premiumPocoValores.P1_5;
        console.log("Valor kilosDia: ", kilosDia);
      } else if (element.peso >= 6 && element.peso <= 10) {
        kilosComida = kilosComida - (premiumPocoValores.P6_10 * dias);
        kilosDia = kilosDia + premiumPocoValores.P6_10;
      } else if (element.peso >= 11 && element.peso <= 15) {
        kilosComida = kilosComida - (premiumPocoValores.P11_15 * dias);
        kilosDia = kilosDia + premiumPocoValores.P11_15;
      } else if (element.peso >= 16 && element.peso <= 20) {
        kilosComida = kilosComida - (premiumPocoValores.P16_20 * dias);
        kilosDia = kilosDia + premiumPocoValores.P16_20;
      } else if (element.peso >= 21 && element.peso <= 25) {
        kilosComida = kilosComida - (premiumPocoValores.P21_25 * dias);
        kilosDia = kilosDia + premiumPocoValores.P21_25;
      } else if (element.peso >= 26 && element.peso <= 30) {
        kilosComida = kilosComida - (premiumPocoValores.P26_30 * dias);
        kilosDia = kilosDia + premiumPocoValores.P26_30;
      } else if (element.peso >= 31 && element.peso <= 35) {
        kilosComida = kilosComida - (premiumPocoValores.P31_35 * dias);
        kilosDia = kilosDia + premiumPocoValores.P31_35;
      } else if (element.peso >= 36 && element.peso <= 40) {
        kilosComida = kilosComida - (premiumPocoValores.P36_40 * dias);
        kilosDia = kilosDia + premiumPocoValores.P36_40;
      } else if (element.peso >= 41 && element.peso <= 45) {
        kilosComida = kilosComida - (premiumPocoValores.P41_45 * dias);
        kilosDia = kilosDia + premiumPocoValores.P41_45;
      } else if (element.peso >= 46 && element.peso <= 50) {
        kilosComida = kilosComida - (premiumPocoValores.P46_50 * dias);
        kilosDia = kilosDia + premiumPocoValores.P46_50;
      } else if (element.peso >= 51 && element.peso <= 55) {
        kilosComida = kilosComida - (premiumPocoValores.P51_55 * dias);
        kilosDia = kilosDia + premiumPocoValores.P51_55;
        console.log("Valor kilosDia: ", kilosDia);
      } else if (element.peso >= 56) {
        kilosComida = kilosComida - (premiumPocoValores.P56_60 * dias);
        kilosDia = kilosDia + premiumPocoValores.P56_60;
      }
    } else if (element.actividad == "media") {
      if (element.peso >= 1 && element.peso <= 5) {
        kilosComida = kilosComida - (premiumMedioValores.P1_5 * dias);
        kilosDia = kilosDia + premiumMedioValores.P1_5;
        console.log("Valor kilosDia: ", kilosDia);
      } else if (element.peso >= 6 && element.peso <= 10) {
        kilosComida = kilosComida - (premiumMedioValores.P6_10 * dias);
        kilosDia = kilosDia + premiumMedioValores.P6_10;
      } else if (element.peso >= 11 && element.peso <= 15) {
        kilosComida = kilosComida - (premiumMedioValores.P11_15 * dias);
        kilosDia = kilosDia + premiumMedioValores.P11_15;
      } else if (element.peso >= 16 && element.peso <= 20) {
        kilosComida = kilosComida - (premiumMedioValores.P16_20 * dias);
        kilosDia = kilosDia + premiumMedioValores.P16_20;
      } else if (element.peso >= 21 && element.peso <= 25) {
        kilosComida = kilosComida - (premiumMedioValores.P21_25 * dias);
        kilosDia = kilosDia + premiumMedioValores.P21_25;
      } else if (element.peso >= 26 && element.peso <= 30) {
        kilosComida = kilosComida - (premiumMedioValores.P26_30 * dias);
        kilosDia = kilosDia + premiumMedioValores.P26_30;
      } else if (element.peso >= 31 && element.peso <= 35) {
        kilosComida = kilosComida - (premiumMedioValores.P31_35 * dias);
        kilosDia = kilosDia + premiumMedioValores.P31_35;
      } else if (element.peso >= 36 && element.peso <= 40) {
        kilosComida = kilosComida - (premiumMedioValores.P36_40 * dias);
        kilosDia = kilosDia + premiumMedioValores.P36_40;
      } else if (element.peso >= 41 && element.peso <= 45) {
        kilosComida = kilosComida - (premiumMedioValores.P41_45 * dias);
        kilosDia = kilosDia + premiumMedioValores.P41_45;
      } else if (element.peso >= 46 && element.peso <= 50) {
        kilosComida = kilosComida - (premiumMedioValores.P46_50 * dias);
        kilosDia = kilosDia + premiumMedioValores.P46_50;
      } else if (element.peso >= 51 && element.peso <= 55) {
        kilosComida = kilosComida - (premiumMedioValores.P51_55 * dias);
        kilosDia = kilosDia + premiumMedioValores.P51_55;
        console.log("Valor kilosDia: ", kilosDia);
      } else if (element.peso >= 56) {
        kilosComida = kilosComida - (premiumMedioValores.P56_60 * dias);
        kilosDia = kilosDia + premiumMedioValores.P56_60;
      }
    } else if (element.actividad == "alta") {
      if (element.peso >= 1 && element.peso <= 5) {
        kilosComida = kilosComida - (premiumAltoValores.P1_5 * dias);
        kilosDia = kilosDia + premiumAltoValores.P1_5;
        console.log("Valor kilosDia: ", kilosDia);
      } else if (element.peso >= 6 && element.peso <= 10) {
        kilosComida = kilosComida - (premiumAltoValores.P6_10 * dias);
        kilosDia = kilosDia + premiumAltoValores.P6_10;
      } else if (element.peso >= 11 && element.peso <= 15) {
        kilosComida = kilosComida - (premiumAltoValores.P11_15 * dias);
        kilosDia = kilosDia + premiumAltoValores.P11_15;
      } else if (element.peso >= 16 && element.peso <= 20) {
        kilosComida = kilosComida - (premiumAltoValores.P16_20 * dias);
        kilosDia = kilosDia + premiumAltoValores.P16_20;
      } else if (element.peso >= 21 && element.peso <= 25) {
        kilosComida = kilosComida - (premiumAltoValores.P21_25 * dias);
        kilosDia = kilosDia + premiumAltoValores.P21_25;
      } else if (element.peso >= 26 && element.peso <= 30) {
        kilosComida = kilosComida - (premiumAltoValores.P26_30 * dias);
        kilosDia = kilosDia + premiumAltoValores.P26_30;
      } else if (element.peso >= 31 && element.peso <= 35) {
        kilosComida = kilosComida - (premiumAltoValores.P31_35 * dias);
        kilosDia = kilosDia + premiumAltoValores.P31_35;
      } else if (element.peso >= 36 && element.peso <= 40) {
        kilosComida = kilosComida - (premiumAltoValores.P36_40 * dias);
        kilosDia = kilosDia + premiumAltoValores.P36_40;
      } else if (element.peso >= 41 && element.peso <= 45) {
        kilosComida = kilosComida - (premiumAltoValores.P41_45 * dias);
        kilosDia = kilosDia + premiumAltoValores.P41_45;
      } else if (element.peso >= 46 && element.peso <= 50) {
        kilosComida = kilosComida - (premiumAltoValores.P46_50 * dias);
        kilosDia = kilosDia + premiumAltoValores.P46_50;
      } else if (element.peso >= 51 && element.peso <= 55) {
        kilosComida = kilosComida - (premiumAltoValores.P51_55 * dias);
        kilosDia = kilosDia + premiumAltoValores.P51_55;
        console.log("Valor kilosDia: ", kilosDia);
      } else if (element.peso >= 56) {
        kilosComida = kilosComida - (premiumAltoValores.P56_60 * dias);
        kilosDia = kilosDia + premiumAltoValores.P56_60;
      }
    }




  }

  console.log("Kilos que quedan en la bolsa: ", kilosComida);

  console.log("Kilos por dia ", kilosDia)

  diasRestantes = kilosComida / kilosDia;

  console.log("Dias Restantes: ", diasRestantes);

  if (diasRestantes <= 3.9 && diasRestantes >= 3) {
    return 3;
  } else if (diasRestantes <= 2.99 && diasRestantes >= 2) {
    return 2;
  } else if (diasRestantes <= 1.99 && diasRestantes >= 0) {
    return 1;
  } else {
    return false;
  }

}




Avisos();


async function Avisos() {
  let ventaActiva = [];
  let clientes = [];
  let idCliente;
  let dias;

  clientes = await main.getClientesTodos();




  for (let index = 0; index < clientes.length; index++) {
    const element = clientes[index];
    idCliente = element.id_cliente;
    ventaActiva = await main.getVentasActivasmain(idCliente);

    if (ventaActiva.length != 0) {




      if (ventaActiva[0].tipo == "economico") {
        dias = economico(ventaActiva);
      } else if (ventaActiva[0].tipo == "premium") {
        dias = premium(ventaActiva);
      }
      if (dias == 1) {
        queda1Dia(ventaActiva, element);
      } else if (dias == 2) {
        quedan2Dias(ventaActiva, element);
      } else if (dias == 3) {
        quedan3Dias(ventaActiva, element);
      }


    }

  }


}



function queda1Dia(venta, cliente) {
  divAvisos = document.getElementById("div1dia");
  divAvisos.innerHTML +=
    `
  <div class="container-aviso" id="dia1">
      <h1>Queda 1 dia o menos</h1>
      <img src="../imagenes/perro-gato.png" class="img-perrogato">
      <div class="container-mascotas">
        <p class="pmascotas" id="pmascotas`+ venta[0].id_venta + `">Mascotas: </p>
      </div>
      <p class="panimal">Animal/es: ${venta[0].animal}
      <p>
      <p class="pcumple" id="pcumple`+ venta[0].id_venta + `">Cumpleaños: </p>
    <img src="../imagenes/persona.png" class="img-persona">
    <p class="pnombre">Nombre: ${cliente.primernombre + " " + cliente.nombrepila + " " + cliente.apellido}</p>
    <p class="ptelefono">Tel: ${cliente.telefono}</p>
    <p class="pdireccion">Direccion: ${cliente.calle + " " + cliente.calle_numero}</p>
    <p class="pbolsas">Bolsas compradas: ${cliente.cantbolsas}</p>
  </div>`


  let idmascotas = "pmascotas" + venta[0].id_venta;
  let idcumple = "pcumple" + venta[0].id_venta;
  pmascotas = document.getElementById(idmascotas);
  pcumple = document.getElementById(idcumple)
  venta.forEach(element => {
    pmascotas.innerHTML += ` ` + element.nombremascota + ` -`;
    dia = element.nacimiento;
    dia = dia.getDate();
    mes = element.nacimiento;
    mes = mes.getMonth();
    mes += 1;
    pcumple.innerHTML += ` ` + dia + `/` + mes + ` -`;
  });

}

function quedan2Dias(venta, cliente) {
  divAvisos = document.getElementById("div2dias");

  divAvisos.innerHTML +=
    `
    <div class="container-aviso" id="dia2">
        <h1>Quedan 2 dias</h1>
        <img src="../imagenes/perro-gato.png" class="img-perrogato">
        <div class="container-mascotas">
          <p class="pmascotas" id="pmascotas`+ venta[0].id_venta + `">Mascotas: </p>
        </div>
        <p class="panimal">Animal/es: ${venta[0].animal}
        <p>
        <p class="pcumple" id="pcumple`+ venta[0].id_venta + `">Cumpleaños: </p>
      <img src="../imagenes/persona.png" class="img-persona">
      <p class="pnombre">Nombre: ${cliente.primernombre + " " + cliente.nombrepila + " " + cliente.apellido}</p>
      <p class="ptelefono">Tel: ${cliente.telefono}</p>
      <p class="pdireccion">Direccion: ${cliente.calle + " " + cliente.calle_numero}</p>
      <p class="pbolsas">Bolsas compradas: ${cliente.cantbolsas}</p>
    </div>`


  let idmascotas = "pmascotas" + venta[0].id_venta;
  let idcumple = "pcumple" + venta[0].id_venta;
  pmascotas = document.getElementById(idmascotas);
  pcumple = document.getElementById(idcumple)
  venta.forEach(element => {
    pmascotas.innerHTML += ` ` + element.nombremascota + ` -`;
    dia = element.nacimiento;
    dia = dia.getDate();
    mes = element.nacimiento;
    mes = mes.getMonth();
    mes += 1;
    pcumple.innerHTML += ` ` + dia + `/` + mes + ` -`;
  });

}

function quedan3Dias(venta, cliente) {
  divAvisos = document.getElementById("div3dias");

  divAvisos.innerHTML +=
    `
    <div class="container-aviso" id="dia3">
        <h1>Quedan 3 dias</h1>
        <img src="../imagenes/perro-gato.png" class="img-perrogato">
        <div class="container-mascotas">
          <p class="pmascotas" id="pmascotas`+ venta[0].id_venta + `">Mascotas: </p>
        </div>
        <p class="panimal">Animal/es: ${venta[0].animal}
        <p>
        <p class="pcumple" id="pcumple`+ venta[0].id_venta + `">Cumpleaños: </p>
      <img src="../imagenes/persona.png" class="img-persona">
      <p class="pnombre">Nombre: ${cliente.primernombre + " " + cliente.nombrepila + " " + cliente.apellido}</p>
      <p class="ptelefono">Tel: ${cliente.telefono}</p>
      <p class="pdireccion">Direccion: ${cliente.calle + " " + cliente.calle_numero}</p>
      <p class="pbolsas">Bolsas compradas: ${cliente.cantbolsas}</p>
    </div>`


  let idmascotas = "pmascotas" + venta[0].id_venta;
  let idcumple = "pcumple" + venta[0].id_venta;
  pmascotas = document.getElementById(idmascotas);
  pcumple = document.getElementById(idcumple);
  venta.forEach(element => {
    pmascotas.innerHTML += ` ` + element.nombremascota + ` -`;
    dia = element.nacimiento;
    dia = dia.getDate();
    mes = element.nacimiento;
    mes = mes.getMonth();
    mes += 1;
    pcumple.innerHTML += ` ` + dia + `/` + mes + ` -`;
  });

}














function calcularDias(fecha) {
  fechaActual = new Date();
  console.log(fecha, fechaActual);

  let diferencia = (fechaActual - fecha) / (1000 * 60 * 60 * 24);

  diferencia = Math.floor(diferencia);

  console.log("Dias que pasaron desde la compra: ", diferencia);
  return diferencia;

}