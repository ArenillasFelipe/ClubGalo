const { getConnection } = require('./database');
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
    conn.release();
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
    conn.release();
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

async function get20ClientesBySearch(busqueda, salto) {
    busqueda = busqueda.split(/\s+/);
    let busqueda0 = busqueda[0];
    for (let i = 0; i < busqueda.length; i++) {
        busqueda[i] = busqueda[i] + '%';
    }
    const conn = await getConnection();
    if (busqueda.length == 1) {
        const result = await conn.query('select * from clientes where (clientes.id_cliente = ? or clientes.primernombre like ? or clientes.nombrepila like ? or clientes.apellido like ? or clientes.telefono = ?) and validoCliente = true LIMIT ?, 20;', [busqueda0, busqueda[0], busqueda[0], busqueda[0], busqueda0, salto]);
        conn.release();
        if (!result[0]) return null; // devuelve `null` si no se encuentra ningún cliente
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

    if (busqueda.length == 2) {
        const result = await conn.query('select * from clientes where (clientes.primernombre like ? or clientes.nombrepila like ? or clientes.apellido like ? ) and (clientes.primernombre like ? or clientes.nombrepila like ? or clientes.apellido like ? ) and validoCliente = true LIMIT ?, 20;', [busqueda[0], busqueda[0], busqueda[0], busqueda[1], busqueda[1], busqueda[1], salto]);
        conn.release();
        if (!result[0]) return null; // devuelve `null` si no se encuentra ningún cliente
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

    if (busqueda.length == 3) {
        const result = await conn.query('select * from clientes where (clientes.primernombre like ? or clientes.nombrepila like ? or clientes.apellido like ?) and (clientes.primernombre like ? or clientes.nombrepila like ? or clientes.apellido like ?) and (clientes.primernombre like ? or clientes.nombrepila like ? or clientes.apellido like ?) and validoCliente = true LIMIT ?, 20;', [busqueda[0], busqueda[0], busqueda[0], busqueda[1], busqueda[1], busqueda[1], busqueda[2], busqueda[2], busqueda[2], salto]);
        conn.release();
        if (!result[0]) return null; // devuelve `null` si no se encuentra ningún cliente
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
}

async function updateClienteById(newCliente) {
    newCliente.primernombre = capitalizar.capitalizarPalabras(newCliente.primernombre);
    newCliente.nombrepila = capitalizar.capitalizarPalabras(newCliente.nombrepila);
    newCliente.apellido = capitalizar.capitalizarPalabras(newCliente.apellido);
    newCliente.calle = capitalizar.capitalizarPalabras(newCliente.calle);

    const conn = await getConnection();
    await conn.query('update clientes set clientes.primernombre = ?, clientes.nombrepila = ?, clientes.apellido = ?, clientes.telefono = ?, clientes.calle = ?, clientes.calle_numero = ?, clientes.puntos = ? where clientes.id_cliente = ? and validoCliente = true', [newCliente.primernombre, newCliente.nombrepila, newCliente.apellido, newCliente.telefono, newCliente.calle, newCliente.calle_numero, newCliente.puntos, newCliente.idCliente]);
    conn.release();
}

async function insertCliente(newCliente) {
    newCliente.primernombre = capitalizar.capitalizarPalabras(newCliente.primernombre);
    newCliente.nombrepila = capitalizar.capitalizarPalabras(newCliente.nombrepila);
    newCliente.apellido = capitalizar.capitalizarPalabras(newCliente.apellido);
    newCliente.calle = capitalizar.capitalizarPalabras(newCliente.calle);

    const conn = await getConnection();
    await conn.query('insert into clientes(primernombre, nombrepila, apellido, telefono, calle, calle_numero, puntos) values(?, ?, ?, ?, ?, ?, ?)', [newCliente.primernombre, newCliente.nombrepila, newCliente.apellido, newCliente.telefono, newCliente.calle, newCliente.calle_numero, newCliente.puntos]);
    conn.release();
}

async function deleteClienteById(id_cliente) {
    const conn = await getConnection();
    await conn.query('update from clientes set validoCliente = false where id_cliente = ?', id_cliente);
    conn.release();
}

module.exports = {
    getClientes,
    getClienteById,
    getClienteBySearch,
    updateClienteById,
    deleteClienteById,
    insertCliente,
    Cliente
}