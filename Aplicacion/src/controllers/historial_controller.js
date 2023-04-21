const clienteModel = require('../models/clienteModel');
const ventaModel = require('../models/ventaModel');
const bolsaModel = require('../models/bolsaModel');
const bolsaKiloModel = require('../models/bolsa_kiloModel');

let salto = 0;


async function get20Ventas(newBusqueda, salto) {
  
// Obtener todas las ventas desde el modelo de ventas

if (newBusqueda == "" || newBusqueda == undefined) {
    new Venta = await ventaModel.get20Ventas(salto);
}else {
    ventas = await ventaModel.get20VentasBySearch(newBusqueda, salto);
}

// Crear un arreglo para almacenar los datos de todas las ventas con la información del cliente relacionado
let ventasConCliente = [];

// Iterar sobre cada venta
for (let i = 0; i < ventas.length; i++) {
  
  // Obtener el cliente relacionado con la venta desde el modelo de clientes
  let cliente = await clienteModel.obtenerDatosCliente(ventas[i].id_cliente);

  // Agregar la información del cliente a la venta correspondiente
  ventasConCliente.push({
    venta: ventas[i],
    cliente: cliente
  });
}

// Enviar el arreglo a la vista para que se muestre la información
res.render('historialVentas', { ventasConCliente });
}

}



