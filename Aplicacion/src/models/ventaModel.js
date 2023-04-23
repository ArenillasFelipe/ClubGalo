const { getConnection } = require('../database');

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
  const result = await conn.query('SELECT * FROM venta order by venta.fecha DESC LIMIT ?, 20;', salto);
  // conn.release();
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
  // conn.release();
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

  if (busqueda === "" || busqueda === undefined) {
    const result = await conn.query(`select * from venta order by venta.fecha DESC LIMIT ?, 20;`, salto);
    // conn.release();
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

  if (!salto) {
    salto = 0;
  }


  if (busqueda.includes('/')) {
    busqueda = busqueda.split("/");

    if (busqueda.length == 3) {
      const result = await conn.query(`select * from venta where (day(venta.fecha) = ? and month(venta.fecha) = ? and year(venta.fecha) = ?) order by venta.fecha DESC LIMIT ?, 20;`, [busqueda[0], busqueda[1], busqueda[2], salto]);
      // conn.release();
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
    if (busqueda.length == 2) {
      const result = await conn.query(`select * from venta where (month(venta.fecha) = ? and year(venta.fecha) = ?) order by venta.fecha DESC LIMIT ?, 20;`, [busqueda[0], busqueda[1], salto]);
      // conn.release();
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
  } else {
    let busquedaMod = "%" + busqueda + "%";
    const result = await conn.query(`select venta.* from venta inner join bolsas_kilos on bolsas_kilos.id_bolsa_kilo = venta.id_bolsa_kilo inner join bolsas on bolsas.id_bolsa = bolsas_kilos.id_bolsa where venta.precio like ? or venta.totalventa like ? or bolsas.marca_bolsa like ? or bolsas_kilos.kilos_bolsa like ? order by venta.fecha DESC LIMIT ?, 20;`, [busquedaMod, busquedaMod, busquedaMod, busquedaMod, salto]);
    // conn.release();
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


}

async function insertVenta(newVenta) {
  const conn = await getConnection();
  result = await conn.query('insert into venta(fecha, precio, id_cliente, cantidad, id_bolsa_kilo, activo) values(?, ?, ?, ?, ?, ?)', [newVenta.fecha, newVenta.precio, newVenta.id_cliente, newVenta.cantidad, newVenta.id_bolsa_kilo, newVenta.activo]);
  // conn.release();
  return result;
}

async function deleteVentaById(id_venta) {
  const conn = await getConnection();
  await conn.query('delete from venta where id_venta = ?', id_venta);
  // conn.release();
}


async function get20VentasByIdClienteByFilters(id_cliente, filtro, filtroMes, salto) {
  const conn = await getConnection();
  if (filtro == "anio") {
    anio = new Date();
    anio = anio.getFullYear();
    const result = await conn.query('select venta.* from venta inner join clientes on venta.id_cliente = clientes.id_cliente where clientes.id_cliente = ? and year(venta.fecha) = ? order by venta.fecha ASC limit ?, 20;', [id_cliente, anio, salto]);
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


  if (filtro == "total") {
    const result = await conn.query('select venta.* from venta inner join clientes on venta.id_cliente = clientes.id_cliente where clientes.id_cliente = ? order by venta.fecha ASC limit ?, 20;', [id_cliente, salto]);
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


  if (filtro == "elegir" && filtroMes != "") {
    anio = filtroMes[0] + filtroMes[1] + filtroMes[2] + filtroMes[3];
    mes = filtroMes[5] + filtroMes[6];
    const result = await conn.query('select venta.* from venta inner join clientes on venta.id_cliente = clientes.id_cliente where clientes.id_cliente = ? and year(venta.fecha) = ? and month(venta.fecha) = ? order by venta.fecha ASC limit ?, 20;', [id_cliente, anio, mes, salto]);
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


  if (filtro == "anioatras") {
    let fechaActual = new Date();
    let aniomenos = fechaActual.getFullYear() - 1;
    let mes = fechaActual.getMonth() + 1;
    let dia = fechaActual.getDate();
    const result = await conn.query('select venta.* from venta inner join clientes on venta.id_cliente = clientes.id_cliente where clientes.id_cliente = ? and venta.fecha >= "?-?-?" order by venta.fecha ASC limit ?, 20;', [id_cliente, aniomenos, mes, dia, salto]);
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
}


async function getVentasActivasByIdCliente(id_cliente) {
  const conn = await getConnection();
  const result = await conn.query('SELECT * FROM venta where id_cliente = ? and activo = true order by venta.fecha', id_cliente);
  // conn.release();
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


async function getUltimas20VentasByIdCliente(id_cliente) {
  const conn = await getConnection();
  const result = await conn.query('SELECT * FROM venta where id_cliente = ? order by venta.fecha DESC limit 20', id_cliente);
  // conn.release();
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


async function actualizarVentaAInactivaById(id_venta) {
  const conn = await getConnection();
  await conn.query('update venta set activo = false where id_venta = ?', id_venta);
  // conn.release();
}


module.exports = {
  Venta,
  get20Ventas,
  getVentaById,
  get20VentasBySearch,
  insertVenta,
  deleteVentaById,
  get20VentasByIdClienteByFilters,
  getVentasActivasByIdCliente,
  getUltimas20VentasByIdCliente,
  actualizarVentaAInactivaById
}
