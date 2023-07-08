const { getConnection } = require('../database');
const { convertirMayusculas } = require('../utils/palabras');

class Venta {
  constructor(fecha, precio, id_cliente, cantidad, marca_bolsa, kilos_bolsa, calidad_bolsa, marca_previa, kilos_previos, calidad_previa, activo, totalventa, puntos_obtenidos, puntos_canjeados, vencimiento, id_venta) {
    this.fecha = fecha;
    this.precio = precio;
    this.id_cliente = id_cliente;
    this.cantidad = cantidad;
    this.marca_bolsa = marca_bolsa;
    this.kilos_bolsa = kilos_bolsa;
    this.calidad_bolsa = calidad_bolsa;
    this.marca_previa = marca_previa;
    this.kilos_previos = kilos_previos
    this.calidad_previa = calidad_previa;
    this.activo = activo;
    this.totalventa = totalventa;
    this.puntos_obtenidos = puntos_obtenidos;
    this.puntos_canjeados = puntos_canjeados;
    this.vencimiento = vencimiento;
    this.id_venta = id_venta;
  }
}





async function get20Ventas(salto) {
  const conn = await getConnection();
  const result = await conn.query('SELECT * FROM venta ORDER BY fecha DESC LIMIT ?, 20;', salto);
  // conn.release();
  return result.map(ventaData => new Venta(
    ventaData.fecha,
    ventaData.precio,
    ventaData.id_cliente,
    ventaData.cantidad,
    ventaData.marca_bolsa,
    ventaData.kilos_bolsa,
    ventaData.calidad_bolsa,
    ventaData.marca_previa,
    ventaData.kilos_previos,
    ventaData.calidad_previa,
    ventaData.activo,
    ventaData.totalventa,
    ventaData.puntos_obtenidos,
    ventaData.puntos_canjeados,
    ventaData.vencimiento,
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
    ventaData.marca_bolsa,
    ventaData.kilos_bolsa,
    ventaData.calidad_bolsa,
    ventaData.marca_previa,
    ventaData.kilos_previos,
    ventaData.calidad_previa,
    ventaData.activo,
    ventaData.totalventa,
    ventaData.puntos_obtenidos,
    ventaData.puntos_canjeados,
    ventaData.vencimiento,
    ventaData.id_venta
  );
}

async function get20VentasBySearch(busqueda, salto) {
  const conn = await getConnection();

  let result;

  if (!salto) {
    salto = 0;
  }

  if (busqueda === "" || busqueda === undefined) {
    result = await conn.query(`select * from venta order by venta.fecha DESC LIMIT ?, 20;`, salto);
    // conn.release();
  }


  if (busqueda.includes('/')) {
    busqueda = busqueda.split("/");

    if (busqueda.length == 3) {
      result = await conn.query(`select * from venta where (day(venta.fecha) = ? and month(venta.fecha) = ? and year(venta.fecha) = ?) order by venta.fecha DESC LIMIT ?, 20;`, [busqueda[0], busqueda[1], busqueda[2], salto]);
      // conn.release();
    }
    if (busqueda.length == 2) {
      result = await conn.query(`select * from venta where (month(venta.fecha) = ? and year(venta.fecha) = ?) order by venta.fecha DESC LIMIT ?, 20;`, [busqueda[0], busqueda[1], salto]);
      // conn.release();
    }
  } else {
    let busquedaMod = "%" + busqueda + "%";
    result = await conn.query(`select venta.* from venta where precio like ? or totalventa like ? or marca_bolsa like ? or kilos_bolsa like ? or calidad_bolsa like ? order by fecha DESC LIMIT ?, 20;`, [busquedaMod, busquedaMod, busquedaMod, busquedaMod, busquedaMod, salto]);
    // conn.release();
  }



  return result.map(ventaData => new Venta(
    ventaData.fecha,
    ventaData.precio,
    ventaData.id_cliente,
    ventaData.cantidad,
    ventaData.marca_bolsa,
    ventaData.kilos_bolsa,
    ventaData.calidad_bolsa,
    ventaData.marca_previa,
    ventaData.kilos_previos,
    ventaData.calidad_previa,
    ventaData.activo,
    ventaData.totalventa,
    ventaData.puntos_obtenidos,
    ventaData.puntos_canjeados,
    ventaData.vencimiento,
    ventaData.id_venta
  ));
}

async function insertVenta(newVenta) {
  console.log("newVenta antes de insertar:", newVenta);
  const conn = await getConnection();
  newVenta.marca_bolsa = convertirMayusculas(newVenta.marca_bolsa);
  result = await conn.query('INSERT INTO venta(fecha, precio, id_cliente, cantidad, marca_bolsa, kilos_bolsa, calidad_bolsa, marca_previa, kilos_previos, calidad_previa, activo, puntos_obtenidos, puntos_canjeados, vencimiento) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [newVenta.fecha, newVenta.precio, newVenta.id_cliente, newVenta.cantidad, newVenta.marca_bolsa, newVenta.kilos_bolsa, newVenta.calidad_bolsa, newVenta.marca_previa, newVenta.kilos_previos, newVenta.calidad_previa, newVenta.activo, newVenta.puntos_obtenidos, newVenta.puntos_canjeados, newVenta.vencimiento]);
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

  let result;

  if (filtro == "anio") {
    anio = new Date();
    anio = anio.getFullYear();
    result = await conn.query('select venta.* from venta inner join clientes on venta.id_cliente = clientes.id_cliente where clientes.id_cliente = ? and year(venta.fecha) = ? order by venta.fecha ASC limit ?, 20;', [id_cliente, anio, salto]);
  }


  if (filtro == "total") {
    result = await conn.query('select venta.* from venta inner join clientes on venta.id_cliente = clientes.id_cliente where clientes.id_cliente = ? order by venta.fecha ASC limit ?, 20;', [id_cliente, salto]);
  }


  if (filtro == "elegir" && filtroMes != "") {
    anio = filtroMes[0] + filtroMes[1] + filtroMes[2] + filtroMes[3];
    mes = filtroMes[5] + filtroMes[6];
    result = await conn.query('select venta.* from venta inner join clientes on venta.id_cliente = clientes.id_cliente where clientes.id_cliente = ? and year(venta.fecha) = ? and month(venta.fecha) = ? order by venta.fecha ASC limit ?, 20;', [id_cliente, anio, mes, salto]);
  }


  if (filtro == "anioatras") {
    let fechaActual = new Date();
    let aniomenos = fechaActual.getFullYear() - 1;
    let mes = fechaActual.getMonth() + 1;
    let dia = fechaActual.getDate();
    result = await conn.query('select venta.* from venta inner join clientes on venta.id_cliente = clientes.id_cliente where clientes.id_cliente = ? and venta.fecha >= "?-?-?" order by venta.fecha ASC limit ?, 20;', [id_cliente, aniomenos, mes, dia, salto]);
  }
  return result.map(ventaData => new Venta(
    ventaData.fecha,
    ventaData.precio,
    ventaData.id_cliente,
    ventaData.cantidad,
    ventaData.marca_bolsa,
    ventaData.kilos_bolsa,
    ventaData.calidad_bolsa,
    ventaData.marca_previa,
    ventaData.kilos_previos,
    ventaData.calidad_previa,
    ventaData.activo,
    ventaData.totalventa,
    ventaData.puntos_obtenidos,
    ventaData.puntos_canjeados,
    ventaData.vencimiento,
    ventaData.id_venta
  ));
}


async function getVentasActivasByIdCliente(id_cliente) {
  const conn = await getConnection();
  const result = await conn.query('SELECT * FROM venta where id_cliente = ? and activo = true order by venta.fecha', id_cliente);
  // conn.release();
  console.log("result: ", result);
  return result.map(ventaData => new Venta(
    ventaData.fecha,
    ventaData.precio,
    ventaData.id_cliente,
    ventaData.cantidad,
    ventaData.marca_bolsa,
    ventaData.kilos_bolsa,
    ventaData.calidad_bolsa,
    ventaData.marca_previa,
    ventaData.kilos_previos,
    ventaData.calidad_previa,
    ventaData.activo,
    ventaData.totalventa,
    ventaData.puntos_obtenidos,
    ventaData.puntos_canjeados,
    ventaData.vencimiento,
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
    ventaData.marca_bolsa,
    ventaData.kilos_bolsa,
    ventaData.calidad_bolsa,
    ventaData.marca_previa,
    ventaData.kilos_previos,
    ventaData.calidad_previa,
    ventaData.activo,
    ventaData.totalventa,
    ventaData.puntos_obtenidos,
    ventaData.puntos_canjeados,
    ventaData.vencimiento,
    ventaData.id_venta
  ));
}


async function actualizarVentaAInactivaById(id_venta) {
  const conn = await getConnection();
  await conn.query('update venta set activo = false where id_venta = ?', id_venta);
  // conn.release();
}


async function actualizarVentasClienteAInactivas(id_cliente) {
  const conn = await getConnection();
  await conn.query('update venta set activo = false where id_cliente = ?', id_cliente);
  // conn.release();
}


async function get20VentasPorVencer(salto) {
  const conn = await getConnection();
  const result = await conn.query('SELECT * FROM venta WHERE vencimiento <= DATE_ADD(CURDATE(), INTERVAL 8 DAY) AND vencimiento >= CURDATE() AND activo = true ORDER BY vencimiento ASC limit ?, 20;', salto);
  // conn.release();
  return result.map(ventaData => new Venta(
    ventaData.fecha,
    ventaData.precio,
    ventaData.id_cliente,
    ventaData.cantidad,
    ventaData.marca_bolsa,
    ventaData.kilos_bolsa,
    ventaData.calidad_bolsa,
    ventaData.marca_previa,
    ventaData.kilos_previos,
    ventaData.calidad_previa,
    ventaData.activo,
    ventaData.totalventa,
    ventaData.puntos_obtenidos,
    ventaData.puntos_canjeados,
    ventaData.vencimiento,
    ventaData.id_venta
  ));
}


async function actualizarVentasVencidas() {
  const conn = await getConnection();

// Obtener la fecha actual
var fechaAyer = new Date();

// Restar un día a la fecha actual
fechaAyer.setDate(fechaAyer.getDate() - 1);

// Establecer la hora a la última hora del día
fechaAyer.setHours(23, 59, 59, 999);


  await conn.query('UPDATE venta SET activo = false WHERE vencimiento <= ? ', fechaAyer);
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
  actualizarVentaAInactivaById,
  actualizarVentasClienteAInactivas,
  get20VentasPorVencer,
  actualizarVentasVencidas
}
