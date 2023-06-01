const cliente_controller = require('../../controllers/cliente_controller');



let PerroBajaValores = {
  P1_3: 0.125,
  P4_5: 0.175,
  P6_7: 0.220,
  P8_9: 0.252,
  P10_11: 0.285,
  P12_13: 0.317,
  P14_15: 0.350,
  P16_17: 0.360,
  P18_19: 0.395,
  P20_21: 0.430,
  P22_23: 0.465,
  P24_25: 0.500,
  P26_27: 0.510,
  P28_29: 0.557,
  P30_31: 0.605,
  P32_33: 0.652,
  P34_35: 0.700,
  P36_37: 0.720,
  P38_39: 0.752,
  P40_41: 0.785,
  P42_43: 0.817,
  P44_45: 0.850
}

let PerroIntermediaValores = {
  P5_7: 0.160,
  P8_10: 0.200,
  P11_12: 0.230,
  P13_14: 0.260,
  P15_16: 0.290,
  P17_18: 0.320,
  P19_20: 0.350,
  P21_22: 0.360,
  P23_24: 0.385,
  P25_26: 0.410,
  P27_28: 0.435,
  P29_30: 0.460,
  P31_32: 0.470,
  P33_34: 0.490,
  P35_36: 0.510,
  P37_38: 0.530,
  P39_40: 0.550,
  P41_42: 0.560,
  P43_44: 0.580,
  P45_46: 0.600,
  P47_48: 0.620,
  P49_50: 0.640
}

let PerroPremiumValores = {
  P1_2: 0.043,
  P3_4: 0.068,
  P5_6: 0.099,
  P7_8: 0.128,
  P9_10: 0.167,
  P11_12: 0.1817,
  P13_14: 0.2112,
  P15_16: 0.226,
  P17_18: 0.2535,
  P19_20: 0.281,
  P21_22: 0.2937,
  P23_24: 0.3192,
  P25_26: 0.332,
  P27_28: 0.356,
  P29_30: 0.380,
  P31_32: 0.3917,
  P33_34: 0.4152,
  P35_36: 0.427,
  P37_38: 0.4495,
  P39_40: 0.472,
  P41_42: 0.4827,
  P43_44: 0.5042,
  P45_46: 0.515,
  P47_48: 0.5365,
  P49_50: 0.558,
  P51_52: 0.5682,
  P53_54: 0.5887,
  P55_56: 0.599,
  P57_58: 0.6195,
  P59_60: 0.640,
  P61_62: 0.6497,
  P63_64: 0.6692,
  P65_66: 0.679,
  P67_68: 0.6985,
  P69_70: 0.718,
  P71_72: 0.7275,
  P73_74: 0.7465,
  P75_76: 0.756,
  P77_78: 0.775,
  P79_80: 0.794
}

let PerroSuperPremiumValores = {
  P1_2: 0.043,
  P3_4: 0.068,
  P5_6: 0.099,
  P7_8: 0.128,
  P9_10: 0.167,
  P11_12: 0.1817,
  P13_14: 0.2112,
  P15_16: 0.226,
  P17_18: 0.2535,
  P19_20: 0.281,
  P21_22: 0.2937,
  P23_24: 0.3192,
  P25_26: 0.332,
  P27_28: 0.356,
  P29_30: 0.380,
  P31_32: 0.3917,
  P33_34: 0.4152,
  P35_36: 0.427,
  P37_38: 0.4495,
  P39_40: 0.472,
  P41_42: 0.4827,
  P43_44: 0.5042,
  P45_46: 0.515,
  P47_48: 0.5365,
  P49_50: 0.558,
  P51_52: 0.5682,
  P53_54: 0.5887,
  P55_56: 0.599,
  P57_58: 0.6195,
  P59_60: 0.640,
  P61_62: 0.6497,
  P63_64: 0.6692,
  P65_66: 0.679,
  P67_68: 0.6985,
  P69_70: 0.718,
  P71_72: 0.7275,
  P73_74: 0.7465,
  P75_76: 0.756,
  P77_78: 0.775,
  P79_80: 0.794
};


let GatoBajaValores = {
  P2_3: 0.070,
  P3_4: 0.080,
  P4_5: 0.090,
  P6_mas: 0.105 
}

let GatoIntermediaValores = {
  P2: 0.050,
  P3: 0.065,
  P4: 0.080,
  P5: 0.094,
  P6: 0.108
}

let GatoPremiumValores = {
  P2: 0.030,
  P3: 0.050,
  P4: 0.060,
  P5: 0.076,
  P6: 0.092,
  P7: 0.105,
  P8: 0.1213,
  P9: 0.1376,
  P10: 0.154,
  P11: 0.170
}


let GatoSuperPremiumValores = {
    P2: 0.030,
    P3: 0.043,
    P4: 0.057,
    P5: 0.071,
    P6: 0.083,
    P7: 0.097,
    P8: 0.1107,
    P9: 0.1227,
    P10: 0.136,
    P11: 0.150
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