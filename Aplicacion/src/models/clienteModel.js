const { getConnection } = require('../database');
const { capitalizarPalabras } = require('../utils/palabras');

class Cliente {
    constructor(primernombre, nombrepila, apellido, telefono, calle, calle_numero, dpto, puntos, id_cliente, validoCliente) {
        this.primernombre = primernombre;
        this.nombrepila = nombrepila;
        this.apellido = apellido;
        this.telefono = telefono;
        this.calle = calle;
        this.calle_numero = calle_numero;
        this.dpto = dpto;
        this.puntos = puntos;
        this.id_cliente = id_cliente;
        this.validoCliente = validoCliente
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
        clienteData.dpto,
        clienteData.puntos,
        clienteData.id_cliente,
        clienteData.validoCliente));
}

async function getClienteById(id_cliente) {
    const conn = await getConnection();
    const result = await conn.query('SELECT * FROM clientes WHERE id_cliente = ?', [id_cliente]);
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
      clienteData.dpto,
      clienteData.puntos,
      clienteData.id_cliente,
      clienteData.validoCliente);
}


async function get20ClientesBySearchMascotas(cadenaBusqueda, salto) {
  if (!salto) {
    salto = 0;
  }

  try {
    const conn = await getConnection();

    const sql = `
      SELECT clientes.*
      FROM clientes
      INNER JOIN mascotas ON mascotas.id_cliente = clientes.id_cliente
      WHERE validoCliente = true
      AND (mascotas.nombremascota LIKE '%${cadenaBusqueda}%')
      GROUP BY clientes.id_cliente
      LIMIT ?, 20
    `;

    const results = await conn.query(sql, [salto]);
    console.log("Resultados de búsqueda:", results);

    return results.map(clienteData => new Cliente(
      clienteData.primernombre,
      clienteData.nombrepila,
      clienteData.apellido,
      clienteData.telefono,
      clienteData.calle,
      clienteData.calle_numero,
      clienteData.dpto,
      clienteData.puntos,
      clienteData.id_cliente,
      clienteData.validoCliente
    ));
  } catch (error) {
    throw error;
  }
}

async function get20ClientesBySearch(cadenaBusqueda, salto) {

  if (!salto) {
    salto = 0;
  }

  try {
    const conn = await getConnection();
    const palabrasClave = cadenaBusqueda.split(' ');
    console.log("palabras clave length: ", palabrasClave.length);

    let condiciones;
    let condicionesSQL;
    let sql;

    if (palabrasClave.length == 1 && !isNaN(palabrasClave[0]) && palabrasClave[0].length <= 4) {
      console.log("entro al if");

      condiciones = `(
        clientes.id_cliente = '${palabrasClave[0]}'
      )`

    }else{

      console.log("entro al else");
      condiciones = palabrasClave.map(palabra => {
        return `(
          clientes.primernombre LIKE '%${palabra}%'
          OR clientes.nombrepila LIKE '%${palabra}%'
          OR clientes.apellido LIKE '%${palabra}%'
          OR clientes.calle LIKE '%${palabra}%'
          OR clientes.telefono = '${palabra}'
          OR clientes.calle_numero = '${palabra}'
          OR clientes.dpto = '${palabra}'
        )`;
      });

      condicionesSQL = condiciones.join(' AND ');
    }
  
    if (condicionesSQL) {
      sql = `
      SELECT clientes.*
      FROM clientes
      WHERE (${condicionesSQL}) AND validoCliente = true
      LIMIT ?, 20
    `;
    }else{
      sql = `
      SELECT clientes.*
      FROM clientes
      WHERE (${condiciones}) AND validoCliente = true
      LIMIT ?, 20
    `;
    }


    console.log(sql);
  
    const results = await conn.query(sql, [salto]);

    console.log("resultado de busqueda justo despues de query a bd: ", results);

    return results.map(clienteData => new Cliente(
      clienteData.primernombre,
      clienteData.nombrepila,
      clienteData.apellido,
      clienteData.telefono,
      clienteData.calle,
      clienteData.calle_numero,
      clienteData.dpto,
      clienteData.puntos,
      clienteData.id_cliente,
      clienteData.validoCliente
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
    await conn.query('update clientes set clientes.primernombre = ?, clientes.nombrepila = ?, clientes.apellido = ?, clientes.telefono = ?, clientes.calle = ?, clientes.calle_numero = ?, clientes.dpto = ?, clientes.puntos = ? where clientes.id_cliente = ? and validoCliente = true', [newCliente.primernombre, newCliente.nombrepila, newCliente.apellido, newCliente.telefono, newCliente.calle, newCliente.calle_numero, newCliente.dpto, newCliente.puntos, newCliente.id_cliente]);
    // conn.release();
}

async function insertCliente(newCliente) {
    newCliente.primernombre = capitalizarPalabras(newCliente.primernombre);
    newCliente.nombrepila = capitalizarPalabras(newCliente.nombrepila);
    newCliente.apellido = capitalizarPalabras(newCliente.apellido);
    newCliente.calle = capitalizarPalabras(newCliente.calle);

    const conn = await getConnection();
    let resultado = await conn.query('insert into clientes(primernombre, nombrepila, apellido, telefono, calle, calle_numero, dpto, puntos) values(?, ?, ?, ?, ?, ?, ?, ?)', [newCliente.primernombre, newCliente.nombrepila, newCliente.apellido, newCliente.telefono, newCliente.calle, newCliente.calle_numero, newCliente.dpto, newCliente.puntos]);
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
    actualizarPuntosClienteById,
    get20ClientesBySearchMascotas
}