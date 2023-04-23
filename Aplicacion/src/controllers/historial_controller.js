const clienteModel = require('../models/clienteModel');
const ventaModel = require('../models/ventaModel');
const bolsaModel = require('../models/bolsaModel');
const bolsaKiloModel = require('../models/bolsa_kiloModel');
const venta_mascotaModel = require('../models/venta_mascotaModel');


async function get20Ventas(newBusqueda, salto) {
  
// Obtener todas las ventas desde el modelo de ventas
let ventas = [];
if (newBusqueda == "" || newBusqueda == undefined) {
    ventas = await ventaModel.get20Ventas(salto);
}else {
  ventas = await ventaModel.get20VentasBySearch(newBusqueda, salto);
}
// Crear un arreglo para almacenar los datos de todas las ventas con la información del cliente relacionado
let ventasConDatos = [];
// Iterar sobre cada venta
for (let i = 0; i < ventas.length; i++) {
  let cliente = await clienteModel.getClienteById(ventas[i].id_cliente);
  let bolsaKilo = await bolsaKiloModel.getBolsa_KiloById(ventas[i].id_bolsa_kilo);
  let bolsa = await bolsaModel.getBolsaById(bolsaKilo.id_bolsa);

  dia = ventas[i].fecha;
  mes = ventas[i].fecha;
  anio = ventas[i].fecha;
  dia = dia.getDate();
  mes = mes.getMonth();
  mes = mes + 1;
  anio = anio.getFullYear();
  ventas[i].fecha = `${dia}/${mes}/${anio}`;



  // Agregar la información del cliente a la venta correspondiente
  ventasConDatos.push({
    venta: ventas[i],
    cliente: cliente,
    bolsaKilo: bolsaKilo,
    bolsa: bolsa
  });
}
console.log(ventasConDatos);
// Enviar el arreglo a la vista para que se muestre la información
  return ventasConDatos;
}




async function borrarVenta_RestarPuntos(id_venta, confirmaRestarPuntos) {
    if (confirmaRestarPuntos) {
        let venta = await ventaModel.getVentaById(id_venta);
        await clienteModel.restarPuntosClienteById(venta.puntos_obtenidos, venta.id_cliente);
    }

    await venta_mascotaModel.deleteVenta_MascotaByIdVenta(id_venta);
    await ventaModel.deleteVentaById(id_venta);
}





module.exports = {
  get20Ventas,
  borrarVenta_RestarPuntos,
}



