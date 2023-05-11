const { getConnection } = require('../database');
const { convertirMayusculas } = require('../utils/palabras');

class Bolsa {
    constructor(id_bolsa, marca_bolsa, calidad_bolsa) {
        this.id_bolsa = id_bolsa;
        this.marca_bolsa = marca_bolsa;
        this.calidad_bolsa = calidad_bolsa;
    }
}


async function getAllBolsas() {
    const conn = await getConnection();
    const result = await conn.query('SELECT * FROM bolsas where validoBolsa = true');
    // conn.release();
    return result.map(bolsaData => new Bolsa(
      bolsaData.id_bolsa,
      bolsaData.marca_bolsa,
      bolsaData.calidad_bolsa
    ));
}


async function get18Bolsas(salto) {
    const conn = await getConnection();
    const result = await conn.query('SELECT * FROM bolsas where validoBolsa = true LIMIT ?, 18;', salto);
    // conn.release();
    return result.map(bolsaData => new Bolsa(
      bolsaData.id_bolsa,
      bolsaData.marca_bolsa,
      bolsaData.calidad_bolsa
    ));
  }
  

async function getBolsaById(id_bolsa) {
    const conn = await getConnection();
    const result = await conn.query('SELECT * FROM bolsas WHERE id_bolsa = ? and validoBolsa = true', id_bolsa);
    // conn.release();
    if (!result[0]) {
        return null;
    }
    const bolsaData = result[0];
    return new Bolsa(
        bolsaData.id_bolsa,
        bolsaData.marca_bolsa,
        bolsaData.calidad_bolsa
    );
}


async function get18BolsasBySearch(busqueda, salto) {
    const conn = await getConnection();
    busqueda = "%" + busqueda + "%";
    const result = await conn.query('SELECT * FROM bolsas WHERE (marca_bolsa like ? or calidad_bolsa like ?) and validoBolsa = true LIMIT ?, 18;', [busqueda, busqueda, salto]);
    // conn.release();
    if (!result[0]) {
        return null;
    }
    return result.map(bolsaData => new Bolsa(
        bolsaData.id_bolsa,
        bolsaData.marca_bolsa,
        bolsaData.calidad_bolsa
      ));
}

async function updateBolsaById(newBolsa) {
    newBolsa.marca_bolsa = convertirMayusculas(newBolsa.marca_bolsa);
    const conn = await getConnection();
    await conn.query('update bolsas set marca_bolsa = ?, calidad_bolsa = ? where id_bolsa = ?', [newBolsa.marca_bolsa, newBolsa.calidad_bolsa, newBolsa.id_bolsa]);
    // conn.release();
}

async function insertBolsa(newBolsa) {
    newBolsa.marca_bolsa = convertirMayusculas(newBolsa.marca_bolsa);
    const conn = await getConnection();
    await conn.query('insert into bolsas(marca_bolsa, calidad_bolsa) values(?, ?)', [newBolsa.marca_bolsa, newBolsa.calidad_bolsa]);
    // conn.release();
}

async function deleteBolsaById(id_bolsa) {
    const conn = await getConnection();
    await conn.query('update from bolsas set validoBolsa = false where id_bolsa = ?', id_bolsa);
    // conn.release();
}

module.exports = {
    get18Bolsas,
    getBolsaById,
    get18BolsasBySearch,
    updateBolsaById,
    insertBolsa,
    deleteBolsaById,
    Bolsa,
    getAllBolsas
}
