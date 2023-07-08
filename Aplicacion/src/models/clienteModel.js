const { getConnection } = require('../database');
const { capitalizarPalabras } = require('../utils/palabras');

class Cliente {
    constructor(primernombre, nombrepila, apellido, telefono, calle, calle_numero, puntos, id_cliente) {
        this.primernombre = primernombre;
        this.nombrepila = nombrepila;
        this.apellido = apellido;
        this.telefono = telefono;
        this.calle = calle;
        this.calle_numero = calle_numero;
        this.puntos = puntos;
        this.id_cliente = id_cliente;
    }
}


async function get20Clientes(salto) {
    const conn = await getConnection();
    const result = await conn.query('SELECT * FROM clientes where validoCliente = true LIMIT ?, 20;', salto);
    // conn.release();
    return result.map(clienteData => new Cliente(
        clienteData.primernombre,
        clienteData.nombrepila,
        clienteData.apellido,
        clienteData.telefono,
        clienteData.calle,
        clienteData.calle_numero,
        clienteData.puntos,
        clienteData.id_cliente));
}

async function getClienteById(id_cliente) {
    const conn = await getConnection();
    const result = await conn.query('SELECT * FROM clientes WHERE id_cliente = ? and validoCliente = true', [id_cliente]);
    // conn.release();
    if (!result[0]) return null; // devuelve `null` si no se encuentra ningún cliente
    const clienteData = result[0];
    return new Cliente(
        clienteData.primernombre,
        clienteData.nombrepila,
        clienteData.apellido,
        clienteData.telefono,
        clienteData.calle,
        clienteData.calle_numero,
        clienteData.puntos,
        clienteData.id_cliente);
}

async function get20ClientesBySearch(cadenaBusqueda, salto) {

  if (!salto) {
    salto = 0;
  }

  try {
    const conn = await getConnection();
    const palabrasClave = cadenaBusqueda.split(' ');
    const condiciones = palabrasClave.map(palabra => {
      return `((primernombre LIKE '%${palabra}%'
        OR nombrepila LIKE '%${palabra}%'
        OR apellido LIKE '%${palabra}%'
        OR calle LIKE '%${palabra}%'
        OR id_cliente = '${palabra}'
        OR calle_numero = '${palabra}'
        OR telefono = '${palabra}') AND validoCliente = true)`;
    });

    const condicionesSQL = condiciones.join(' AND ');

    const sql = `
      SELECT *
      FROM clientes
      WHERE ${condicionesSQL}
      LIMIT ?, 20
    `;

    const results = await conn.query(sql, [salto]);

    return results.map(clienteData => new Cliente(
      clienteData.primernombre,
      clienteData.nombrepila,
      clienteData.apellido,
      clienteData.telefono,
      clienteData.calle,
      clienteData.calle_numero,
      clienteData.puntos,
      clienteData.id_cliente
    ));
  } catch (error) {
    throw error;
  }
}



async function updateClienteById(newCliente) {
    newCliente.primernombre = capitalizarPalabras(newCliente.primernombre);
    newCliente.nombrepila = capitalizarPalabras(newCliente.nombrepila);
    newCliente.apellido = capitalizarPalabras(newCliente.apellido);
    newCliente.calle = capitalizarPalabras(newCliente.calle);

    const conn = await getConnection();
    await conn.query('update clientes set clientes.primernombre = ?, clientes.nombrepila = ?, clientes.apellido = ?, clientes.telefono = ?, clientes.calle = ?, clientes.calle_numero = ?, clientes.puntos = ? where clientes.id_cliente = ? and validoCliente = true', [newCliente.primernombre, newCliente.nombrepila, newCliente.apellido, newCliente.telefono, newCliente.calle, newCliente.calle_numero, newCliente.puntos, newCliente.id_cliente]);
    // conn.release();
}

async function insertCliente(newCliente) {
    newCliente.primernombre = capitalizarPalabras(newCliente.primernombre);
    newCliente.nombrepila = capitalizarPalabras(newCliente.nombrepila);
    newCliente.apellido = capitalizarPalabras(newCliente.apellido);
    newCliente.calle = capitalizarPalabras(newCliente.calle);

    const conn = await getConnection();
    let resultado = await conn.query('insert into clientes(primernombre, nombrepila, apellido, telefono, calle, calle_numero, puntos) values(?, ?, ?, ?, ?, ?, ?)', [newCliente.primernombre, newCliente.nombrepila, newCliente.apellido, newCliente.telefono, newCliente.calle, newCliente.calle_numero, newCliente.puntos]);
    // conn.release();
    return resultado;
}

async function deleteClienteById(id_cliente) {
    const conn = await getConnection();
    await conn.query('update clientes set validoCliente = false where id_cliente = ?', id_cliente);
    // conn.release();
}


async function actualizarPuntosClienteById(id_cliente, newPuntos) {
    const conn = await getConnection();
    await conn.query('update clientes set puntos = ? where id_cliente = ?',[newPuntos, id_cliente]);
}

module.exports = {
    get20Clientes,
    getClienteById,
    get20ClientesBySearch,
    updateClienteById,
    deleteClienteById,
    insertCliente,
    Cliente,
    actualizarPuntosClienteById
}