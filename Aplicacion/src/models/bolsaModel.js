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


async function get18BolsasBySearch(cadenaBusqueda, salto) {
    const conn = await getConnection();

///////

const palabrasClave = cadenaBusqueda.split(' ');
  
    const condiciones = palabrasClave.map(palabra => {
      return `(
        bolsas.marca_bolsa LIKE '%${palabra}%'
        OR bolsas.calidad_bolsa like '%${palabra}%'
        OR bolsas_kilos.kilos_bolsa = '${parseFloat(palabra)}'
      )`;
    });
  
    const condicionesSQL = condiciones.join(' AND ');
    console.log(condicionesSQL);
    const sql = `
      SELECT DISTINCT bolsas.id_bolsa, bolsas.marca_bolsa, bolsas.calidad_bolsa
      FROM bolsas
      inner join bolsas_kilos on bolsas_kilos.id_bolsa = bolsas.id_bolsa
      WHERE (${condicionesSQL}) AND bolsas.validoBolsa = true AND bolsas_kilos.validoBolsaKilo = true
      LIMIT ?, 18
    `;

    const results = await conn.query(sql, [salto]);

    return results.map(bolsaData => new Bolsa(
        bolsaData.id_bolsa,
        bolsaData.marca_bolsa,
        bolsaData.calidad_bolsa
      ));

//////////
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
    let result = await conn.query('insert into bolsas(marca_bolsa, calidad_bolsa) values(?, ?)', [newBolsa.marca_bolsa, newBolsa.calidad_bolsa]);
    // conn.release();
    return result;
}

async function deleteBolsaById(id_bolsa) {
    const conn = await getConnection();
    await conn.query('update bolsas set validoBolsa = false where id_bolsa = ?', id_bolsa);
    // conn.release();
}

async function getBolsaByName(marca_bolsa) {
    const conn = await getConnection();
    let result = await conn.query('select * from bolsas where marca_bolsa = ? and validoBolsa = true', marca_bolsa);
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

module.exports = {
    get18Bolsas,
    getBolsaById,
    get18BolsasBySearch,
    updateBolsaById,
    insertBolsa,
    deleteBolsaById,
    Bolsa,
    getAllBolsas,
    getBolsaByName
}
