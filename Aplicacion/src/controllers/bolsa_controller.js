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

module.exports = {
    getAllBolsasOrdenadas,
    getKilosBolsaByIdBolsa
}