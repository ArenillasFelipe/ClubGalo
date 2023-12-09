const { getConnection } = require('../database');
const { capitalizarPalabras } = require('../utils/palabras');



class Mascota {
    constructor(nacimiento, nombremascota, raza, peso, afecciones, animal, actividad, id_mascota, id_cliente) {
      this.nacimiento = nacimiento;
      this.nombremascota = nombremascota;
      this.raza = raza;
      this.peso = peso;
      this.afecciones = afecciones;
      this.animal = animal;
      this.actividad = actividad;
      this.id_mascota = id_mascota;
      this.id_cliente = id_cliente;
    }
  }

async function getMascotasByIdCliente(id_cliente) {
    const conn = await getConnection();
    const result = await conn.query('SELECT * FROM mascotas where validoMascota = true and id_cliente = ?', id_cliente);
    // conn.release();
    return result.map(mascotaData => new Mascota(
        mascotaData.nacimiento,
        mascotaData.nombremascota,
        mascotaData.raza,
        mascotaData.peso,
        mascotaData.afecciones,
        mascotaData.animal,
        mascotaData.actividad,
        mascotaData.id_mascota,
        mascotaData.id_cliente));
}


async function getMascotas() {
    const conn = await getConnection();
    const result = await conn.query('SELECT * FROM mascotas where validoMascota = true');
    // conn.release();
    return result.map(mascotaData => new Mascota(
        mascotaData.nacimiento,
        mascotaData.nombremascota,
        mascotaData.raza,
        mascotaData.peso,
        mascotaData.afecciones,
        mascotaData.animal,
        mascotaData.actividad,
        mascotaData.id_mascota,
        mascotaData.id_cliente));
}

async function getMascotaById(id_mascota) {
    const conn = await getConnection();
    const result = await conn.query('SELECT * FROM mascotas WHERE id_mascota = ?', id_mascota);
    // conn.release();
    if (!result[0]) return null; // devuelve `null` si no se encuentra ninguna mascota
    const mascotaData = result[0];
    return new Mascota(
        mascotaData.nacimiento,
        mascotaData.nombremascota,
        mascotaData.raza,
        mascotaData.peso,
        mascotaData.afecciones,
        mascotaData.animal,
        mascotaData.actividad,
        mascotaData.id_mascota,
        mascotaData.id_cliente);
}

async function updateMascotaById(newMascota) {
    newMascota.nombremascota = capitalizarPalabras(newMascota.nombremascota);
    newMascota.raza = capitalizarPalabras(newMascota.raza);
    newMascota.animal = capitalizarPalabras(newMascota.animal);
    newMascota.actividad = capitalizarPalabras(newMascota.actividad);


    const conn = await getConnection();
    await conn.query('update mascotas set mascotas.animal = ?, mascotas.raza = ?, mascotas.peso = ?, mascotas.actividad = ?, mascotas.afecciones = ?, mascotas.nacimiento = ?, mascotas.nombremascota = ? where mascotas.id_mascota = ?;', [newMascota.animal, newMascota.raza, newMascota.peso, newMascota.actividad, newMascota.afecciones, newMascota.nacimiento, newMascota.nombremascota, newMascota.id_mascota]);
    // conn.release();
}

async function insertMascota(newMascota) {
    newMascota.nombremascota = capitalizarPalabras(newMascota.nombremascota);
    newMascota.raza = capitalizarPalabras(newMascota.raza);
    newMascota.animal = capitalizarPalabras(newMascota.animal);
    newMascota.actividad = capitalizarPalabras(newMascota.actividad);

    const conn = await getConnection();
    await conn.query('insert into mascotas(nacimiento, nombremascota, raza, peso, afecciones, animal, actividad, id_cliente) values(?, ?, ?, ?, ?, ?, ?, ?)', [newMascota.nacimiento,newMascota.nombremascota,newMascota.raza,newMascota.peso,newMascota.afecciones,newMascota.animal, newMascota.actividad,newMascota.id_cliente]);
    // conn.release();
}

async function deleteMascotaById(id_mascota) {
    const conn = await getConnection();
    await conn.query('update mascotas set validoMascota = false where id_mascota = ?', id_mascota);
    // conn.release();
}

async function deleteMascotasByIdCliente(id_cliente) {
    const conn = await getConnection();
    await conn.query('update mascotas set validoMascota = false where id_cliente = ?', id_cliente);
    // conn.release();
}


module.exports = {
    Mascota,
    getMascotas,
    getMascotaById,
    updateMascotaById,
    insertMascota,
    deleteMascotaById,
    deleteMascotasByIdCliente,
    getMascotasByIdCliente
    }