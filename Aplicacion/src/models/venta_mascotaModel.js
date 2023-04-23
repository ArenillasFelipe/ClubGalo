const { getConnection } = require('../database');

class Venta_Mascota {
    constructor(id_ventamascota, id_venta, id_mascota) {
      this.id_ventamascota = id_ventamascota;
      this.id_venta = id_venta;
      this.id_mascota = id_mascota;
    }
  }  


  async function getVenta_MascotasByIdVenta(id_venta) {
    const conn = await getConnection();
    const result = await conn.query('SELECT * FROM venta_mascota where id_venta = ?', id_venta);
    // conn.release();
    return result.map(ventaMascotaData => new Venta_Mascota(
        ventaMascotaData.id_ventamascota,
        ventaMascotaData.id_venta,
        ventaMascotaData.id_mascota));
}

async function getVenta_MascotaActivaByIdMascota(id_mascota) {
  console.log("id de la masctoa:" , id_mascota)
  const conn = await getConnection();
  const result = await conn.query('SELECT venta_mascota.* FROM venta_mascota inner join venta on venta.id_venta = venta_mascota.id_venta where venta_mascota.id_mascota = ? and venta.activo = true', id_mascota);
  // conn.release();
  if (!result[0]) {
    return null;
}
const ventaMascotaData = result[0];
  return new Venta_Mascota(
      ventaMascotaData.id_ventamascota,
      ventaMascotaData.id_venta,
      ventaMascotaData.id_mascota);
}

async function insertVenta_Mascota(id_venta, id_mascota) {
  console.log("idVenta: ", id_venta, "idMascota: ", id_mascota);
    const conn = await getConnection();
    await conn.query('insert into venta_mascota(id_venta, id_mascota) values(?, ?)', [id_venta, id_mascota]);
    // conn.release();
}

async function deleteVenta_MascotaByIdVenta(id_venta) {
    const conn = await getConnection();
    await conn.query('delete from venta_mascota where id_venta = ?', id_venta);
    // conn.release();
}


module.exports = {
    Venta_Mascota,
    getVenta_MascotasByIdVenta,
    insertVenta_Mascota,
    deleteVenta_MascotaByIdVenta,
    getVenta_MascotaActivaByIdMascota
    }