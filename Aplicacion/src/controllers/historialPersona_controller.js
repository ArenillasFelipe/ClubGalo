const clienteModel = require('../models/clienteModel');
const ventaModel = require('../models/ventaModel');
const bolsaModel = require('../models/bolsaModel');
const bolsaKiloModel = require('../models/bolsa_kiloModel');
const venta_mascotaModel = require('../models/venta_mascotaModel');



async function borrarVenta_RestarPuntos(id_venta, confirmaRestarPuntos) {
    if (confirmaRestarPuntos) {
        let venta = await ventaModel.getVentaById(id_venta);
        await clienteModel.restarPuntosClienteById(venta.puntos_obtenidos, venta.id_cliente);
    }

    await venta_mascotaModel.deleteVenta_MascotaByIdVenta(id_venta);
    await ventaModel.deleteVentaById(id_venta);
}

async function getClienteSegunBusqueda(busqueda) {
    let cliente = await clienteModel.get20ClientesBySearch(busqueda);
    if (cliente.length > 1) {
        throw new Error("variosClientes");
    }
    if (cliente.length === 0) {
        throw new Error("noExisteCliente");
    }
    return cliente[0]
}


async function get20VentasByIdClienteByFiltersController(id_cliente, filtro, filtroMes, salto) {
    let ventas = await ventaModel.get20VentasByIdClienteByFilters(id_cliente, filtro, filtroMes, salto);
    let ventasConDatos = [];
    // Iterar sobre cada venta
    for (let i = 0; i < ventas.length; i++) {
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
            bolsaKilo: bolsaKilo,
            bolsa: bolsa
        });
    }
    // Enviar el arreglo a la vista para que se muestre la información
    return ventasConDatos;
}



module.exports = {
    borrarVenta_RestarPuntos,
    getClienteSegunBusqueda,
    get20VentasByIdClienteByFiltersController
}
