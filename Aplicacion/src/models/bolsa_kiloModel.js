const { getConnection } = require('./database');

class Bolsa_Kilo {
    constructor(id_bolsa, id_bolsa_kilo, kilos_bolsa) {
        this.id_bolsa = id_bolsa;
        this.id_bolsa_kilo = id_bolsa_kilo;
        this.kilos_bolsa = kilos_bolsa;
    }
}

async function getKilosBolsaByIdBolsa(id_bolsa) {
    const conn = await getConnection();
    const result = await conn.query('SELECT * FROM bolsas_kilos where id_bolsa = ? and validoBolsaKilo = true', id_bolsa);
    conn.release();
    return result.map(bolsaKiloData => new Bolsa_Kilo(
        bolsaKiloData.id_bolsa,
        bolsaKiloData.id_bolsa_kilo,
        bolsaKiloData.kilos_bolsa
    ));
}


async function getBolsa_KiloById(id_bolsa_kilo) {
    const conn = await getConnection();
    const result = await conn.query('SELECT * FROM bolsas_kilos WHERE id_bolsa_kilo = ? and validoBolsaKilo = true', id_bolsa_kilo);
    conn.release();
    if (!result[0]) {
        return null;
    }
    const bolsaKiloData = result[0];
    return new Bolsa_Kilo(
        bolsaKiloData.id_bolsa,
        bolsaKiloData.id_bolsa_kilo,
        bolsaKiloData.kilos_bolsa
    );
}

async function insertBolsa_Kilo(id_bolsa, kilos_bolsa) {
    const conn = await getConnection();
    await conn.query('insert into bolsas_kilos(id_bolsa, kilos_bolsa) values(?, ?)', [id_bolsa, kilos_bolsa]);
    conn.release();
}

async function deleteBolsa_KiloById(id_bolsa_kilo) {
    const conn = await getConnection();
    await conn.query('update from bolsas_kilos set validoBolsaKilo = false where id_bolsa_kilo = ?', id_bolsa_kilo);
    conn.release();
}

async function deleteBolsas_KilosByIdBolsa(id_bolsa) {
    const conn = await getConnection();
    await conn.query('update from bolsas_kilos set validoBolsaKilo = false where id_bolsa = ?', id_bolsa);
    conn.release();
}

module.exports = {
    getKilosBolsaByIdBolsa,
    getBolsa_KiloById,
    insertBolsa_Kilo,
    deleteBolsa_KiloById,
    deleteBolsas_KilosByIdBolsa,
    Bolsa_Kilo
}
