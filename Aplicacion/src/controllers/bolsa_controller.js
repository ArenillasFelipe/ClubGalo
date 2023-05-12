const bolsaModel = require('../models/bolsaModel');
const bolsaKiloModel = require('../models/bolsa_kiloModel');



async function getAllBolsasOrdenadas() {
  let bolsas = await bolsaModel.getAllBolsas();
  bolsas.sort((bolsa1, bolsa2) => {
    if (bolsa1.marca_bolsa < bolsa2.marca_bolsa) {
      return -1;
    } else if (bolsa1.marca_bolsa > bolsa2.marca_bolsa) {
      return 1;
    } else {
      return 0;
    }
  });
  return bolsas;
}


async function getKilosBolsaByIdBolsa(id_bolsa) {
  let kilos = await bolsaKiloModel.getKilosBolsaByIdBolsa(id_bolsa);
  kilos.sort((a, b) => a.kilos_bolsa - b.kilos_bolsa);
  return kilos;
}

async function get18BolsasSegunBusqueda(busqueda, salto) {
  let bolsas;

  if (!busqueda) {
    bolsas = await bolsaModel.get18Bolsas(salto);
  } else {
    bolsas = await bolsaModel.get18BolsasBySearch(busqueda, salto);
  }

  let bolsasConKilos = [];
  for (let i = 0; i < bolsas.length; i++) {
    const element = bolsas[i];

    kilos_bolsa = await bolsaKiloModel.getKilosBolsaByIdBolsa(element.id_bolsa);

    bolsasConKilos.push({
      bolsa: element,
      kilosBolsa: kilos_bolsa
    });
  }

  return bolsasConKilos;
}


async function getBolsaById(id_bolsa) {
  let bolsa = await bolsaModel.getBolsaById(id_bolsa);
  let kilosBolsa = await bolsaKiloModel.getKilosBolsaByIdBolsa(id_bolsa);

  let bolsasConKilos = {
    bolsa: bolsa,
    kilosBolsa: kilosBolsa
  }
  return bolsasConKilos;
}

async function actualizarDatosBolsa(newBolsa, kilosBolsa) {

  let bolsasConMismoNombre = await bolsaModel.getBolsaByName(newBolsa.marca_bolsa);
  try {
    console.log(`-${bolsasConMismoNombre.marca_bolsa}-`, `-${newBolsa.marca_bolsa}-`);
    console.log((bolsasConMismoNombre.marca_bolsa != newBolsa.marca_bolsa))
  } catch (error) {
    
  }

  if ((bolsasConMismoNombre) && (bolsasConMismoNombre.id_bolsa != newBolsa.id_bolsa)) {
    throw new Error("bolsaRepetida");
  }

    newBolsa.marca_bolsa = (newBolsa.marca_bolsa).toUpperCase();


    await bolsaModel.updateBolsaById(newBolsa);

    await bolsaKiloModel.deleteBolsas_KilosByIdBolsa(newBolsa.id_bolsa);

    for (let i = 0; i < kilosBolsa.length; i++) {
      const element = kilosBolsa[i];

      await bolsaKiloModel.insertBolsa_Kilo(newBolsa.id_bolsa, element);

    }
}


async function borrarBolsaById(id_bolsa) {
  await bolsaKiloModel.deleteBolsas_KilosByIdBolsa(id_bolsa);
  await bolsaModel.deleteBolsaById(id_bolsa);
}



async function insertBolsa(newBolsa, kilosBolsa) {

  let bolsasConMismoNombre = await bolsaModel.getBolsaByName(newBolsa.marca_bolsa);

  if (bolsasConMismoNombre) {
    throw new Error("bolsaRepetida");
  }

    newBolsa.marca_bolsa = (newBolsa.marca_bolsa).toUpperCase();

  let result = await bolsaModel.insertBolsa(newBolsa);

  for (let i = 0; i < kilosBolsa.length; i++) {
    const element = kilosBolsa[i];
    await bolsaKiloModel.insertBolsa_Kilo(result.insertId, element);
  }


}


module.exports = {
  getAllBolsasOrdenadas,
  getKilosBolsaByIdBolsa,
  get18BolsasSegunBusqueda,
  getBolsaById,
  actualizarDatosBolsa,
  borrarBolsaById,
  insertBolsa
}