const { getConnection } = require('./database');

class Venta {
  constructor(fecha, precio, id_cliente, cantidad, id_bolsa_kilo, activo, totalventa, puntos_obtenidos, id_venta) {
    this.fecha = fecha;
    this.precio = precio;
    this.id_cliente = id_cliente;
    this.cantidad = cantidad;
    this.id_bolsa_kilo = id_bolsa_kilo;
    this.activo = activo;
    this.totalventa = totalventa;
    this.puntos_obtenidos = puntos_obtenidos;
    this.id_venta = id_venta;
  }
}

async function get20Ventas(salto) {
  const conn = await getConnection();
    const result = await conn.query('SELECT * FROM ventas order by venta.fecha DESC LIMIT ?, 20;', salto);
    conn.release();
    return result.map(ventaData => new Venta(
      ventaData.fecha,
      ventaData.precio,
      ventaData.id_cliente,
      ventaData.cantidad,
      ventaData.id_bolsa_kilo,
      ventaData.activo,
      ventaData.totalventa,
      ventaData.puntos_obtenidos,
      ventaData.id_venta
    ));
}


async function getVentaById(id_venta) {
    const conn = await getConnection();
    const result = await conn.query('SELECT * FROM venta WHERE id_venta = ?', id_venta);
    conn.release();
    if (!result[0]) return null; // devuelve `null` si no se encuentra ninguna mascota
    const ventaData = result[0];
    return new Venta(
        ventaData.fecha,
        ventaData.precio,
        ventaData.id_cliente,
        ventaData.cantidad,
        ventaData.id_bolsa_kilo,
        ventaData.activo,
        ventaData.totalventa,
        ventaData.puntos_obtenidos,
        ventaData.id_venta
      );
}

async function get20VentasBySearch(busqueda, salto) {
    const conn = await getConnection();

    if (busqueda == "" || busqueda == undefined) {
        const resultado = await conn.query(`select * from venta order by venta.fecha DESC LIMIT ?, 20;`, salto);
        conn.release();
        return resultado;
    }


    if (busqueda.includes('/')) {
        busqueda = busqueda.split("/");

        if (busqueda.length == 3) {
            const resultado = await conn.query(`select * from venta where (day(venta.fecha) = ? and month(venta.fecha) = ? and year(venta.fecha) = ?) order by venta.fecha DESC LIMIT ?, 20;`, [busqueda[0], busqueda[1], busqueda[2], salto]);
            conn.release();
            return resultado;
        }
        if (busqueda.length == 2) {
            const resultado = await conn.query(`select * from venta where (month(venta.fecha) = ? and year(venta.fecha) = ?) order by venta.fecha DESC LIMIT ?, 20;`, [busqueda[0], busqueda[1], salto]);
            conn.release();
            return resultado;
        }
    } else {
        let busquedaMod = "%" + busqueda + "%";
        const resultado = await conn.query(`select * from venta where venta.precio like ? or venta.totalventa like ? or bolsas.marca_bolsa like ? or bolsas_kilos.kilos_bolsa like ? order by venta.fecha DESC LIMIT ?, 20;`, [busquedaMod, busquedaMod, busquedaMod, busquedaMod, salto]);
        conn.release();
        return resultado;
    }


}

async function insertVenta(newVenta) {
    const conn = await getConnection();
    await conn.query('insert into venta(fecha, precio, id_cliente, cantidad, id_bolsa_kilo, activo, totalventa, puntos_obtenidos) values(?, ?, ?, ?, ?, ?, ?, ?)', [newVenta.fecha,newVenta.precio,newVenta.id_cliente,newVenta.cantidad,newVenta.id_bolsa_kilo,newVenta.activo,newVenta.totalventa,newVenta.puntos_obtenidos,newVenta.id_venta]);
    conn.release();
}

async function deleteVentaById(id_venta) {
    const conn = await getConnection();
    await conn.query('delete from venta where id_venta = ?', id_venta);
    conn.release();
}


module.exports = {
    Venta,
    get20Ventas,
    getVentaById,
    get20VentasBySearch,
    insertVenta,
    deleteVentaById
  }
  