const configModel = require('../models/configModel');


async function getMultiplicadorPuntos() {
    let multiplicador = await configModel.getMultiplicadorPuntos();
    console.log(multiplicador);
    return multiplicador.valor_config;
}


async function modificarMultiplicadorPuntos(multiplicador) {
    await configModel.modificarMultiplicadorPuntos(multiplicador);
}

module.exports = {
    modificarMultiplicadorPuntos,
    getMultiplicadorPuntos
  }