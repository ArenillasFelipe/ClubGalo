const { getConnection } = require('./database');

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
    conn.release();
    return result.map(ventaMascotaData => new Venta_Mascota(
        ventaMascotaData.id_ventamascota,
        ventaMascotaData.id_venta,
        ventaMascotaData.id_mascota));
}

async function insertVenta_Mascota(id_venta, id_mascota) {
    const conn = await getConnection();
    await conn.query('insert into venta_mascota(id_venta, id_mascota) values(?, ?)', [id_venta, id_mascota]);
    conn.release();
}

async function deleteVenta_MascotaByIdVenta(id_venta) {
    const conn = await getConnection();
    await conn.query('delete from venta_mascota where id_venta = ?', id_venta);
    conn.release();
}


module.exports = {
    Venta_Mascota,
    getVenta_MascotasByIdVenta,
    insertVenta_Mascota,
    deleteVenta_MascotaByIdVenta
    }