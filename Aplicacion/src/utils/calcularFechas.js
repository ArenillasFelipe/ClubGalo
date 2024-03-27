function calcularDiasEntreFechas(fechaInicial, fechaFinal) {
  // Convertir las fechas a objetos Date
  const fecha1 = new Date(fechaInicial);
  const fecha2 = new Date(fechaFinal);

  // Establecer las horas, minutos, segundos y milisegundos a cero
  fecha1.setHours(0, 0, 0, 0);
  fecha2.setHours(0, 0, 0, 0);

  // Calcular la diferencia en milisegundos
  const diferenciaMs = Math.abs(fecha2 - fecha1);

  // Convertir la diferencia a días
  const dias = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));

  return dias;
}

function diasParaCumpleaños(fechaNacimiento) {
  var fechaNacimientoObj;
  
  // Comprobar si fechaNacimiento es una cadena
  if (typeof fechaNacimiento === 'string') {
    // Convertir la cadena de fecha al objeto Date
    var partes = fechaNacimiento.split('/');
    var dia = parseInt(partes[0], 10);
    var mes = parseInt(partes[1], 10) - 1; // Los meses en JavaScript van de 0 a 11
    var año = parseInt(partes[2], 10);
    fechaNacimientoObj = new Date(año, mes, dia);
  } else if (fechaNacimiento instanceof Date) {
    // Si fechaNacimiento es un objeto Date, simplemente asignarlo
    fechaNacimientoObj = fechaNacimiento;
  } else {
    // Manejar otros tipos de entrada
    console.error('El parámetro debe ser un objeto Date o una cadena de fecha en formato "DD/MM/AAAA".');
    return;
  }

  console.log("fecha de nacimiento: ", fechaNacimientoObj);
  var fechaActual = new Date();
  var añoActual = fechaActual.getFullYear();
  var añoNacimiento = fechaNacimientoObj.getFullYear();
  var proximoCumpleaños = new Date(añoActual, fechaNacimientoObj.getMonth(), fechaNacimientoObj.getDate());

  // Si el próximo cumpleaños es hoy, devolver 0
  if (fechaActual.toDateString() === proximoCumpleaños.toDateString()) {
      return 0;
  }

  if (fechaActual > proximoCumpleaños) {
      proximoCumpleaños.setFullYear(añoActual + 1);
  }

  var diferencia = proximoCumpleaños.getTime() - fechaActual.getTime();
  var diasParaCumpleaños = Math.ceil(diferencia / (1000 * 60 * 60 * 24));

  return diasParaCumpleaños;
}


function calcularEdadMascota(fechaNacimiento) {
  const partesFecha = fechaNacimiento.split("/"); // Separar la fecha en tres partes
  const dia = parseInt(partesFecha[0]);
  const mes = parseInt(partesFecha[1]) - 1; // Los meses en JavaScript van de 0 a 11
  const anio = parseInt(partesFecha[2]);

  const fechaNac = new Date(anio, mes, dia);
  const fechaActual = new Date();

  const tiempoEnMs = fechaActual.getTime() - fechaNac.getTime();
  const msEnAnio = 1000 * 60 * 60 * 24 * 365.25;

  if (tiempoEnMs < msEnAnio) {
    // La mascota tiene menos de un año, devolver la edad en meses
    const meses = Math.floor(tiempoEnMs / (1000 * 60 * 60 * 24 * 30.4375));
    return `${meses} meses`;
  } else {
    // La mascota tiene un año o más, devolver la edad en años
    const edad = Math.floor(tiempoEnMs / msEnAnio);
    return `${edad} años`;
  }
}




function calcularDuracionBolsa(mascotasVenta, bolsasVenta) {

  mascotasVenta.forEach(mascota => {
    mascota.peso = Math.round(mascota.peso);
    if (mascota.peso == 0) {
      mascota.peso = 1
    }
  });

  let ventaActual = {
    marca_bolsa: bolsasVenta.marcaActual,
    calidad_bolsa: bolsasVenta.calidadActual,
    kilos_bolsa: bolsasVenta.kilosActuales,
    cantidad: bolsasVenta.cantidadActual
  }

  let diasDuracion = calculosDuracionBolsa(mascotasVenta, ventaActual);

  if (bolsasVenta.calidadPrevia && (bolsasVenta.kilosPrevios != undefined || bolsasVenta.kilosPrevios != null || bolsasVenta.kilosPrevios != 0)) {

    let ventaPrevia = {
      marca_bolsa: bolsasVenta.marcaPrevia,
      calidad_bolsa: bolsasVenta.calidadPrevia,
      kilos_bolsa: bolsasVenta.kilosPrevios,
      cantidad: 1
    }

    diasDuracion += calculosDuracionBolsa(mascotasVenta, ventaPrevia);
  }


  return diasDuracion;

}


function calculosDuracionBolsa(mascotasVenta, venta) {

  console.log("CALCULANDO VENCIMIENTO PARA: ", venta);

  if (mascotasVenta[0].animal == "Perro") {

    if (venta.calidad_bolsa == "BAJA") {
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


      // Calcular el consumo diario individual de cada mascota
      let consumoDiarioTotal = 0;

      mascotasVenta.forEach((mascota) => {
        let pesoMascota = mascota.peso;

        // Encontrar el rango de peso correspondiente
        let rangoPeso = null;

        for (let rango in PerroBajaValores) {
          // console.log("rango: ", rango);
          let [rangoMin, rangoMax] = rango.split('_').map((valor) => parseFloat(valor.replace(/[^\d.-]/g, '')));

          // console.log("log antes de if, rangoMin:", rangoMin, "rangoMax: ", rangoMax);
          if (pesoMascota >= rangoMin && pesoMascota <= rangoMax) {
            rangoPeso = rango;
            break;
          }
        }

        // Sumar el consumo diario individual al consumo diario total
        if (rangoPeso) {
          // console.log("rangopeso de la mascota: ", rangoPeso);
          let consumoDiarioIndividual = PerroBajaValores[rangoPeso];
          consumoDiarioTotal += consumoDiarioIndividual;
        } else {
          //significa que la mascota pesa mas que lo que se contempla en PerroBajaValores
          //hago regla de 3 simple
          let consumoDiarioIndividual = (pesoMascota * PerroBajaValores.P44_45) / 45;
          consumoDiarioTotal += consumoDiarioIndividual;
        }
      });

      // Calcular los días que durará la bolsa de comida
      console.log("consumo diario total: ", consumoDiarioTotal);
      let diasDuracion = (venta.kilos_bolsa * venta.cantidad) / consumoDiarioTotal;

      return diasDuracion;


    }




    if (venta.calidad_bolsa == "INTERMEDIA") {
      let PerroIntermediaValores = {
        P1_2: 0.048,
        P3_4: 0.100,
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


      // Calcular el consumo diario individual de cada mascota
      let consumoDiarioTotal = 0;

      mascotasVenta.forEach((mascota) => {
        let pesoMascota = mascota.peso;

        // Encontrar el rango de peso correspondiente
        let rangoPeso = null;

        for (let rango in PerroIntermediaValores) {
          // console.log("rango: ", rango);
          let [rangoMin, rangoMax] = rango.split('_').map((valor) => parseFloat(valor.replace(/[^\d.-]/g, '')));

          // console.log("log antes de if, rangoMin:", rangoMin, "rangoMax: ", rangoMax);
          if (pesoMascota >= rangoMin && pesoMascota <= rangoMax) {
            rangoPeso = rango;
            break;
          }
        }

        // Sumar el consumo diario individual al consumo diario total
        if (rangoPeso) {
          // console.log("rangopeso de la mascota: ", rangoPeso);
          let consumoDiarioIndividual = PerroIntermediaValores[rangoPeso];
          consumoDiarioTotal += consumoDiarioIndividual;
        } else {
          //significa que la mascota pesa mas que lo que se contempla en PerroBajaValores
          //hago regla de 3 simple
          let consumoDiarioIndividual = (pesoMascota * PerroIntermediaValores.P49_50) / 50;
          consumoDiarioTotal += consumoDiarioIndividual;
        }
      });

      // Calcular los días que durará la bolsa de comida
      let diasDuracion = (venta.kilos_bolsa * venta.cantidad) / consumoDiarioTotal;
      return diasDuracion;
    }



    if (venta.calidad_bolsa == "PREMIUM") {
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


      // Calcular el consumo diario individual de cada mascota
      let consumoDiarioTotal = 0;

      mascotasVenta.forEach((mascota) => {
        let pesoMascota = mascota.peso;

        // Encontrar el rango de peso correspondiente
        let rangoPeso = null;

        for (let rango in PerroPremiumValores) {
          // console.log("rango: ", rango);
          let [rangoMin, rangoMax] = rango.split('_').map((valor) => parseFloat(valor.replace(/[^\d.-]/g, '')));

          // console.log("log antes de if, rangoMin:", rangoMin, "rangoMax: ", rangoMax);
          if (pesoMascota >= rangoMin && pesoMascota <= rangoMax) {
            rangoPeso = rango;
            break;
          }
        }

        // Sumar el consumo diario individual al consumo diario total
        if (rangoPeso) {
          // console.log("rangopeso de la mascota: ", rangoPeso);
          let consumoDiarioIndividual = PerroPremiumValores[rangoPeso];
          consumoDiarioTotal += consumoDiarioIndividual;
        } else {
          //significa que la mascota pesa mas que lo que se contempla en PerroBajaValores
          //hago regla de 3 simple
          let consumoDiarioIndividual = (pesoMascota * PerroPremiumValores.P79_80) / 80;
          consumoDiarioTotal += consumoDiarioIndividual;
        }
      });

      // Calcular los días que durará la bolsa de comida
      let diasDuracion = (venta.kilos_bolsa * venta.cantidad) / consumoDiarioTotal;
      return diasDuracion;
    }


    if (venta.calidad_bolsa == "SUPER PREMIUM") {
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


      // Calcular el consumo diario individual de cada mascota
      let consumoDiarioTotal = 0;

      mascotasVenta.forEach((mascota) => {
        let pesoMascota = mascota.peso;

        // Encontrar el rango de peso correspondiente
        let rangoPeso = null;

        for (let rango in PerroSuperPremiumValores) {
          // console.log("rango: ", rango);
          let [rangoMin, rangoMax] = rango.split('_').map((valor) => parseFloat(valor.replace(/[^\d.-]/g, '')));

          // console.log("log antes de if, rangoMin:", rangoMin, "rangoMax: ", rangoMax);
          if (pesoMascota >= rangoMin && pesoMascota <= rangoMax) {
            rangoPeso = rango;
            break;
          }
        }

        // Sumar el consumo diario individual al consumo diario total
        if (rangoPeso) {
          // console.log("rangopeso de la mascota: ", rangoPeso);
          let consumoDiarioIndividual = PerroSuperPremiumValores[rangoPeso];
          consumoDiarioTotal += consumoDiarioIndividual;
        } else {
          //significa que la mascota pesa mas que lo que se contempla en PerroBajaValores
          //hago regla de 3 simple
          let consumoDiarioIndividual = (pesoMascota * PerroSuperPremiumValores.P79_80) / 80;
          consumoDiarioTotal += consumoDiarioIndividual;
        }
      });

      // Calcular los días que durará la bolsa de comida
      let diasDuracion = (venta.kilos_bolsa * venta.cantidad) / consumoDiarioTotal;
      return diasDuracion;
    }

  }


  if (mascotasVenta[0].animal == "Gato") {


    if (venta.calidad_bolsa == "BAJA") {

      let GatoBajaValores = {
        P1: 0.055,
        P2: 0.065,
        P3: 0.075,
        P4: 0.085,
        P5: 0.095,
        P6: 0.105
      }


      // Calcular el consumo diario individual de cada mascota
      let consumoDiarioTotal = 0;

      mascotasVenta.forEach((mascota) => {
        let pesoMascota = mascota.peso;

        // Encontrar el rango de peso correspondiente
        let rangoPeso = null;

        for (let rango in GatoBajaValores) {
          let rangoPesoFloat = parseFloat(rango.slice(1)); // Obtener el valor de rango como número decimal
          let rangoPesoInt = Math.round(rangoPesoFloat); // Redondear al número entero más cercano

          if (Math.round(pesoMascota) === rangoPesoInt) {
            rangoPeso = rango;
            break;
          }
        }

        // Sumar el consumo diario individual al consumo diario total
        if (rangoPeso) {
          // console.log("rangopeso de la mascota: ", rangoPeso);
          let consumoDiarioIndividual = GatoBajaValores[rangoPeso];
          consumoDiarioTotal += consumoDiarioIndividual;
          // console.log("consumo diario individual :", consumoDiarioIndividual);
        } else {
          //significa que la mascota pesa mas que lo que se contempla
          //hago regla de 3 simple
          let consumoDiarioIndividual = (pesoMascota * GatoBajaValores.P6) / 6;
          consumoDiarioTotal += consumoDiarioIndividual;
        }
      });

      // Calcular los días que durará la bolsa de comida
      // console.log("consumo diario total: ", consumoDiarioTotal);
      let diasDuracion = (venta.kilos_bolsa * venta.cantidad) / consumoDiarioTotal;

      return diasDuracion;


    }




    if (venta.calidad_bolsa == "INTERMEDIA") {
      let GatoIntermediaValores = {
        P1: 0.025,
        P2: 0.050,
        P3: 0.065,
        P4: 0.080,
        P5: 0.094,
        P6: 0.108
      }


      // Calcular el consumo diario individual de cada mascota
      let consumoDiarioTotal = 0;

      mascotasVenta.forEach((mascota) => {
        let pesoMascota = mascota.peso;

        // Encontrar el rango de peso correspondiente
        let rangoPeso = null;

        for (let rango in GatoIntermediaValores) {
          let rangoPesoFloat = parseFloat(rango.slice(1)); // Obtener el valor de rango como número decimal
          let rangoPesoInt = Math.round(rangoPesoFloat); // Redondear al número entero más cercano

          if (Math.round(pesoMascota) === rangoPesoInt) {
            rangoPeso = rango;
            break;
          }
        }

        // Sumar el consumo diario individual al consumo diario total
        if (rangoPeso) {
          // console.log("rangopeso de la mascota: ", rangoPeso);
          let consumoDiarioIndividual = GatoIntermediaValores[rangoPeso];
          consumoDiarioTotal += consumoDiarioIndividual;
        } else {
          //significa que la mascota pesa mas que lo que se contempla
          //hago regla de 3 simple
          let consumoDiarioIndividual = (pesoMascota * GatoIntermediaValores.P6) / 6;
          consumoDiarioTotal += consumoDiarioIndividual;
        }
      });

      // Calcular los días que durará la bolsa de comida
      let diasDuracion = (venta.kilos_bolsa * venta.cantidad) / consumoDiarioTotal;
      return diasDuracion;
    }



    if (venta.calidad_bolsa == "PREMIUM") {
      let GatoPremiumValores = {
        P1: 0.015,
        P2: 0.030,
        P3: 0.050,
        P4: 0.060,
        P5: 0.076,
        P6: 0.092
      }


      // Calcular el consumo diario individual de cada mascota
      let consumoDiarioTotal = 0;

      mascotasVenta.forEach((mascota) => {
        let pesoMascota = mascota.peso;

        // Encontrar el rango de peso correspondiente
        let rangoPeso = null;

        for (let rango in GatoPremiumValores) {
          let rangoPesoFloat = parseFloat(rango.slice(1)); // Obtener el valor de rango como número decimal
          let rangoPesoInt = Math.round(rangoPesoFloat); // Redondear al número entero más cercano

          if (Math.round(pesoMascota) === rangoPesoInt) {
            rangoPeso = rango;
            break;
          }
        }

        // Sumar el consumo diario individual al consumo diario total
        if (rangoPeso) {
          // console.log("rangopeso de la mascota: ", rangoPeso);
          let consumoDiarioIndividual = GatoPremiumValores[rangoPeso];
          consumoDiarioTotal += consumoDiarioIndividual;
        } else {
          //significa que la mascota pesa mas que lo que se contempla
          //hago regla de 3 simple
          let consumoDiarioIndividual = (pesoMascota * GatoPremiumValores.P6) / 6;
          consumoDiarioTotal += consumoDiarioIndividual;
        }
      });

      // Calcular los días que durará la bolsa de comida
      let diasDuracion = (venta.kilos_bolsa * venta.cantidad) / consumoDiarioTotal;
      return diasDuracion;
    }


    if (venta.calidad_bolsa == "SUPER PREMIUM") {
      let GatoSuperPremiumValores = {
        P1: 0.015,
        P2: 0.030,
        P3: 0.045,
        P4: 0.060,
        P5: 0.075,
        P6: 0.085
      }


      // Calcular el consumo diario individual de cada mascota
      let consumoDiarioTotal = 0;

      mascotasVenta.forEach((mascota) => {
        let pesoMascota = mascota.peso;

        // Encontrar el rango de peso correspondiente
        let rangoPeso = null;

        for (let rango in GatoSuperPremiumValores) {
          let rangoPesoFloat = parseFloat(rango.slice(1)); // Obtener el valor de rango como número decimal
          let rangoPesoInt = Math.round(rangoPesoFloat); // Redondear al número entero más cercano

          if (Math.round(pesoMascota) === rangoPesoInt) {
            rangoPeso = rango;
            break;
          }
        }

        // Sumar el consumo diario individual al consumo diario total
        if (rangoPeso) {
          // console.log("rangopeso de la mascota: ", rangoPeso);
          let consumoDiarioIndividual = GatoSuperPremiumValores[rangoPeso];
          consumoDiarioTotal += consumoDiarioIndividual;
        } else {
          //significa que la mascota pesa mas que lo que se contempla
          //hago regla de 3 simple
          let consumoDiarioIndividual = (pesoMascota * GatoSuperPremiumValores.P6) / 6;
          consumoDiarioTotal += consumoDiarioIndividual;
        }
      });

      // Calcular los días que durará la bolsa de comida
      let diasDuracion = (venta.kilos_bolsa * venta.cantidad) / consumoDiarioTotal;
      return diasDuracion;
    }


  }
}









function calcularKilosRestantesBolsa(mascotasVenta, venta) {

  mascotasVenta.forEach(mascota => {
    mascota.peso = Math.round(mascota.peso);
  });

  if (mascotasVenta[0].animal == "Perro") {

    if (venta.calidad_bolsa == "BAJA") {
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


      // Calcular el consumo diario individual de cada mascota
      let consumoDiarioTotal = 0;

      mascotasVenta.forEach((mascota) => {
        let pesoMascota = mascota.peso;

        // Encontrar el rango de peso correspondiente
        let rangoPeso = null;

        for (let rango in PerroBajaValores) {
          // console.log("rango: ", rango);
          let [rangoMin, rangoMax] = rango.split('_').map((valor) => parseFloat(valor.replace(/[^\d.-]/g, '')));

          // console.log("log antes de if, rangoMin:", rangoMin, "rangoMax: ", rangoMax);
          if (pesoMascota >= rangoMin && pesoMascota <= rangoMax) {
            rangoPeso = rango;
            break;
          }
        }

        // Sumar el consumo diario individual al consumo diario total
        if (rangoPeso) {
          // console.log("rangopeso de la mascota: ", rangoPeso);
          let consumoDiarioIndividual = PerroBajaValores[rangoPeso];
          consumoDiarioTotal += consumoDiarioIndividual;
        } else {
          //significa que la mascota pesa mas que lo que se contempla
          //hago regla de 3 simple
          let consumoDiarioIndividual = (pesoMascota * PerroBajaValores.P44_45) / 45;
          consumoDiarioTotal += consumoDiarioIndividual;
        }
      });

      let diasTranscurridos = calcularDiasEntreFechas(venta.fecha, new Date());

      let kilosRestantes = (venta.kilos_bolsa * venta.cantidad) - (consumoDiarioTotal * diasTranscurridos);

      return kilosRestantes.toFixed(2);


    }




    if (venta.calidad_bolsa == "INTERMEDIA") {
      let PerroIntermediaValores = {
        P1_2: 0.048,
        P3_4: 0.100,
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


      // Calcular el consumo diario individual de cada mascota
      let consumoDiarioTotal = 0;

      mascotasVenta.forEach((mascota) => {
        let pesoMascota = mascota.peso;

        // Encontrar el rango de peso correspondiente
        let rangoPeso = null;

        for (let rango in PerroIntermediaValores) {
          // console.log("rango: ", rango);
          let [rangoMin, rangoMax] = rango.split('_').map((valor) => parseFloat(valor.replace(/[^\d.-]/g, '')));

          // console.log("log antes de if, rangoMin:", rangoMin, "rangoMax: ", rangoMax);
          if (pesoMascota >= rangoMin && pesoMascota <= rangoMax) {
            rangoPeso = rango;
            break;
          }
        }

        // Sumar el consumo diario individual al consumo diario total
        if (rangoPeso) {
          // console.log("rangopeso de la mascota: ", rangoPeso);
          let consumoDiarioIndividual = PerroIntermediaValores[rangoPeso];
          consumoDiarioTotal += consumoDiarioIndividual;
        } else {
          //significa que la mascota pesa mas que lo que se contempla
          //hago regla de 3 simple
          let consumoDiarioIndividual = (pesoMascota * PerroIntermediaValores.P49_50) / 50;
          consumoDiarioTotal += consumoDiarioIndividual;
        }
      });

      let diasTranscurridos = calcularDiasEntreFechas(venta.fecha, new Date());

      let kilosRestantes = (venta.kilos_bolsa * venta.cantidad) - (consumoDiarioTotal * diasTranscurridos);

      return kilosRestantes.toFixed(2);
    }



    if (venta.calidad_bolsa == "PREMIUM") {
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


      // Calcular el consumo diario individual de cada mascota
      let consumoDiarioTotal = 0;

      mascotasVenta.forEach((mascota) => {
        let pesoMascota = mascota.peso;

        // Encontrar el rango de peso correspondiente
        let rangoPeso = null;

        for (let rango in PerroPremiumValores) {
          // console.log("rango: ", rango);
          let [rangoMin, rangoMax] = rango.split('_').map((valor) => parseFloat(valor.replace(/[^\d.-]/g, '')));

          // console.log("log antes de if, rangoMin:", rangoMin, "rangoMax: ", rangoMax);
          if (pesoMascota >= rangoMin && pesoMascota <= rangoMax) {
            rangoPeso = rango;
            break;
          }
        }

        // Sumar el consumo diario individual al consumo diario total
        if (rangoPeso) {
          // console.log("rangopeso de la mascota: ", rangoPeso);
          let consumoDiarioIndividual = PerroPremiumValores[rangoPeso];
          consumoDiarioTotal += consumoDiarioIndividual;
        } else {
          //significa que la mascota pesa mas que lo que se contempla
          //hago regla de 3 simple
          let consumoDiarioIndividual = (pesoMascota * PerroPremiumValores.P79_80) / 80;
          consumoDiarioTotal += consumoDiarioIndividual;
        }
      });

      let diasTranscurridos = calcularDiasEntreFechas(venta.fecha, new Date());

      let kilosRestantes = (venta.kilos_bolsa * venta.cantidad) - (consumoDiarioTotal * diasTranscurridos);

      return kilosRestantes.toFixed(2);
    }


    if (venta.calidad_bolsa == "SUPER PREMIUM") {
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


      // Calcular el consumo diario individual de cada mascota
      let consumoDiarioTotal = 0;

      mascotasVenta.forEach((mascota) => {
        let pesoMascota = mascota.peso;

        // Encontrar el rango de peso correspondiente
        let rangoPeso = null;

        for (let rango in PerroSuperPremiumValores) {
          // console.log("rango: ", rango);
          let [rangoMin, rangoMax] = rango.split('_').map((valor) => parseFloat(valor.replace(/[^\d.-]/g, '')));

          // console.log("log antes de if, rangoMin:", rangoMin, "rangoMax: ", rangoMax);
          if (pesoMascota >= rangoMin && pesoMascota <= rangoMax) {
            rangoPeso = rango;
            break;
          }
        }

        // Sumar el consumo diario individual al consumo diario total
        if (rangoPeso) {
          // console.log("rangopeso de la mascota: ", rangoPeso);
          let consumoDiarioIndividual = PerroSuperPremiumValores[rangoPeso];
          consumoDiarioTotal += consumoDiarioIndividual;
        } else {
          //significa que la mascota pesa mas que lo que se contempla
          //hago regla de 3 simple
          let consumoDiarioIndividual = (pesoMascota * PerroSuperPremiumValores.P79_80) / 80;
          consumoDiarioTotal += consumoDiarioIndividual;
        }
      });

      let diasTranscurridos = calcularDiasEntreFechas(venta.fecha, new Date());

      let kilosRestantes = (venta.kilos_bolsa * venta.cantidad) - (consumoDiarioTotal * diasTranscurridos);

      return kilosRestantes.toFixed(2);
    }

  }


  if (mascotasVenta[0].animal == "Gato") {


    if (venta.calidad_bolsa == "BAJA") {

      let GatoBajaValores = {
        P1: 0.055,
        P2: 0.065,
        P3: 0.075,
        P4: 0.085,
        P5: 0.095,
        P6: 0.105
      }


      // Calcular el consumo diario individual de cada mascota
      let consumoDiarioTotal = 0;

      mascotasVenta.forEach((mascota) => {
        let pesoMascota = mascota.peso;

        // Encontrar el rango de peso correspondiente
        let rangoPeso = null;

        for (let rango in GatoBajaValores) {
          let rangoPesoFloat = parseFloat(rango.slice(1)); // Obtener el valor de rango como número decimal
          let rangoPesoInt = Math.round(rangoPesoFloat); // Redondear al número entero más cercano

          if (Math.round(pesoMascota) === rangoPesoInt) {
            rangoPeso = rango;
            break;
          }
        }

        // Sumar el consumo diario individual al consumo diario total
        if (rangoPeso) {
          // console.log("rangopeso de la mascota: ", rangoPeso);
          let consumoDiarioIndividual = GatoBajaValores[rangoPeso];
          consumoDiarioTotal += consumoDiarioIndividual;
          // console.log("consumo diario individual :", consumoDiarioIndividual);
        } else {
          //significa que la mascota pesa mas que lo que se contempla
          //hago regla de 3 simple
          let consumoDiarioIndividual = (pesoMascota * GatoBajaValores.P6) / 6;
          consumoDiarioTotal += consumoDiarioIndividual;
        }

      });

      let diasTranscurridos = calcularDiasEntreFechas(venta.fecha, new Date());

      let kilosRestantes = (venta.kilos_bolsa * venta.cantidad) - (consumoDiarioTotal * diasTranscurridos);

      return kilosRestantes.toFixed(2);


    }




    if (venta.calidad_bolsa == "INTERMEDIA") {
      let GatoIntermediaValores = {
        P1: 0.025,
        P2: 0.050,
        P3: 0.065,
        P4: 0.080,
        P5: 0.094,
        P6: 0.108
      }


      // Calcular el consumo diario individual de cada mascota
      let consumoDiarioTotal = 0;

      mascotasVenta.forEach((mascota) => {
        let pesoMascota = mascota.peso;

        // Encontrar el rango de peso correspondiente
        let rangoPeso = null;

        for (let rango in GatoIntermediaValores) {
          let rangoPesoFloat = parseFloat(rango.slice(1)); // Obtener el valor de rango como número decimal
          let rangoPesoInt = Math.round(rangoPesoFloat); // Redondear al número entero más cercano

          if (Math.round(pesoMascota) === rangoPesoInt) {
            rangoPeso = rango;
            break;
          }
        }

        // Sumar el consumo diario individual al consumo diario total
        if (rangoPeso) {
          // console.log("rangopeso de la mascota: ", rangoPeso);
          let consumoDiarioIndividual = GatoIntermediaValores[rangoPeso];
          consumoDiarioTotal += consumoDiarioIndividual;
        } else {
          //significa que la mascota pesa mas que lo que se contempla
          //hago regla de 3 simple
          let consumoDiarioIndividual = (pesoMascota * GatoIntermediaValores.P6) / 6;
          consumoDiarioTotal += consumoDiarioIndividual;
        }
      });

      let diasTranscurridos = calcularDiasEntreFechas(venta.fecha, new Date());

      let kilosRestantes = (venta.kilos_bolsa * venta.cantidad) - (consumoDiarioTotal * diasTranscurridos);

      return kilosRestantes.toFixed(2);
    }



    if (venta.calidad_bolsa == "PREMIUM") {
      let GatoPremiumValores = {
        P1: 0.015,
        P2: 0.030,
        P3: 0.050,
        P4: 0.060,
        P5: 0.076,
        P6: 0.092
      }


      // Calcular el consumo diario individual de cada mascota
      let consumoDiarioTotal = 0;

      mascotasVenta.forEach((mascota) => {
        let pesoMascota = mascota.peso;

        // Encontrar el rango de peso correspondiente
        let rangoPeso = null;

        for (let rango in GatoPremiumValores) {
          let rangoPesoFloat = parseFloat(rango.slice(1)); // Obtener el valor de rango como número decimal
          let rangoPesoInt = Math.round(rangoPesoFloat); // Redondear al número entero más cercano

          if (Math.round(pesoMascota) === rangoPesoInt) {
            rangoPeso = rango;
            break;
          }
        }

        // Sumar el consumo diario individual al consumo diario total
        if (rangoPeso) {
          // console.log("rangopeso de la mascota: ", rangoPeso);
          let consumoDiarioIndividual = GatoPremiumValores[rangoPeso];
          consumoDiarioTotal += consumoDiarioIndividual;
        } else {
          //significa que la mascota pesa mas que lo que se contempla
          //hago regla de 3 simple
          let consumoDiarioIndividual = (pesoMascota * GatoPremiumValores.P6) / 6;
          consumoDiarioTotal += consumoDiarioIndividual;
        }
      });

      let diasTranscurridos = calcularDiasEntreFechas(venta.fecha, new Date());

      let kilosRestantes = (venta.kilos_bolsa * venta.cantidad) - (consumoDiarioTotal * diasTranscurridos);

      return kilosRestantes.toFixed(2);
    }


    if (venta.calidad_bolsa == "SUPER PREMIUM") {
      let GatoSuperPremiumValores = {
        P1: 0.015,
        P2: 0.030,
        P3: 0.045,
        P4: 0.060,
        P5: 0.075,
        P6: 0.085
      }


      // Calcular el consumo diario individual de cada mascota
      let consumoDiarioTotal = 0;

      mascotasVenta.forEach((mascota) => {
        let pesoMascota = mascota.peso;

        // Encontrar el rango de peso correspondiente
        let rangoPeso = null;

        for (let rango in GatoSuperPremiumValores) {
          let rangoPesoFloat = parseFloat(rango.slice(1)); // Obtener el valor de rango como número decimal
          let rangoPesoInt = Math.round(rangoPesoFloat); // Redondear al número entero más cercano

          if (Math.round(pesoMascota) === rangoPesoInt) {
            rangoPeso = rango;
            break;
          }
        }

        // Sumar el consumo diario individual al consumo diario total
        if (rangoPeso) {
          // console.log("rangopeso de la mascota: ", rangoPeso);
          let consumoDiarioIndividual = GatoSuperPremiumValores[rangoPeso];
          consumoDiarioTotal += consumoDiarioIndividual;
        } else {
          //significa que la mascota pesa mas que lo que se contempla
          //hago regla de 3 simple
          let consumoDiarioIndividual = (pesoMascota * GatoSuperPremiumValores.P6) / 6;
          consumoDiarioTotal += consumoDiarioIndividual;
        }
      });

      let diasTranscurridos = calcularDiasEntreFechas(venta.fecha, new Date());

      let kilosRestantes = (venta.kilos_bolsa * venta.cantidad) - (consumoDiarioTotal * diasTranscurridos);

      return kilosRestantes.toFixed(2);
    }


  }



}



































function sumarDiasAFechaActual(diasASumar) {
  const milisegundosPorDia = 24 * 60 * 60 * 1000;
  const fechaActual = new Date();
  const diasEnMilisegundos = diasASumar * milisegundosPorDia;
  const nuevaFecha = new Date(fechaActual.getTime() + diasEnMilisegundos);

  return nuevaFecha;
}



module.exports = { calcularDiasEntreFechas, calcularEdadMascota, calcularDuracionBolsa, sumarDiasAFechaActual, calcularKilosRestantesBolsa, diasParaCumpleaños }