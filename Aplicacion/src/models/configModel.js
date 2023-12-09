const { getConnection } = require('../database');
const { convertirMayusculas } = require('../utils/palabras');

class Config {
    constructor(id_config, nombre_config, valor_config) {
        this.id_config = id_config;
        this.nombre_config = nombre_config;
        this.valor_config = valor_config;
    }
}



async function getMultiplicadorPuntos() {
    const conn = await getConnection();
    const result = await conn.query('SELECT * FROM config where id_config = 1');
    // conn.release();
    if (!result[0]) return null; // devuelve `null` si no hay nada
    const configData = result[0];
    return new Config(
        configData.id_config,
        configData.nombre_config,
        configData.valor_config);
}


async function modificarMultiplicadorPuntos(multiplicador) {
    const conn = await getConnection();
    await conn.query('UPDATE config SET valor_config = ? WHERE id_config = 1;', multiplicador);
    // conn.release();
}


module.exports = {
    modificarMultiplicadorPuntos,
    getMultiplicadorPuntos
}