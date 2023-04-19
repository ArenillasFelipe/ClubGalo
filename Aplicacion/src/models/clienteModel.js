const { getConnection } = require('./database');

class cliente {
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


async function getAllClientes() {
    const conn = await getConnection();
    result = await conn.query('select * from clientes');
    return result;
}

async function getClienteById(id_cliente) {
    const conn = await getConnection();
    result = await conn.query('select * from clientes');
    return result;
}