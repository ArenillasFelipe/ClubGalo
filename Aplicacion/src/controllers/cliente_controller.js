const clienteModel = require('../models/clienteModel');
const mascotaModel = require('../models/mascotaModel');
const ventaModel = require('../models/ventaModel');


async function getClienteSegunBusqueda(busqueda) {
    let cliente = await clienteModel.get20ClientesBySearch(busqueda);

    if (!cliente) {
        throw new Error("noExisteCliente");
    }

    if (cliente.length > 1) {
        throw new Error("variosClientes");
    }
    return cliente[0]
}


async function getClienteById(id_cliente) {
    let cliente = await clienteModel.getClienteById(id_cliente);
    return cliente;
}


async function get20ClientesConMascotasBySearch(busqueda, salto) {
    let clientes
    let clientesConMascotas = [];
    if(busqueda){
    clientes = await clienteModel.get20ClientesBySearch(busqueda, salto);
    }else{
        clientes = await clienteModel.get20Clientes(salto);
    }

    for (let i = 0; i < clientes.length; i++) {

        let mascotasCliente = await mascotaModel.getMascotasByIdCliente(clientes[i].id_cliente);

        for (let i = 0; i < mascotasCliente.length; i++) {
            
            dia = mascotasCliente[i].nacimiento;
            mes = mascotasCliente[i].nacimiento;
            anio = mascotasCliente[i].nacimiento;
    
            dia = dia.getDate();
            mes = mes.getMonth();
            mes = mes + 1;
            anio = anio.getFullYear();
            
            mascotasCliente[i].nacimiento = `${dia}/${mes}/${anio}`;
        }

        clientesConMascotas.push({
            cliente: clientes[i],
            mascotas: mascotasCliente
        });


    }

    return clientesConMascotas;
}



async function restarPuntosCliente(puntosActuales, puntosParaRestar, id_cliente) {
    console.log(puntosActuales, puntosParaRestar, id_cliente);
    let newPuntos = puntosActuales - puntosParaRestar;
    await clienteModel.actualizarPuntosClienteById(id_cliente, newPuntos);
    return newPuntos;
}

async function borrarClienteById(id_cliente) {
    await ventaModel.actualizarVentasClienteAInactivas(id_cliente);
    await clienteModel.deleteClienteById(id_cliente);
    await mascotaModel.deleteMascotasByIdCliente(id_cliente);
}


async function updateClienteById(newCliente) {
    await clienteModel.updateClienteById(newCliente);
}



async function insertCliente(newCliente) {
    let resultado = await clienteModel.insertCliente(newCliente);
    return resultado.insertId;
}


module.exports = {
    getClienteSegunBusqueda,
    getClienteById,
    get20ClientesConMascotasBySearch,
    restarPuntosCliente,
    borrarClienteById,
    updateClienteById,
    insertCliente
}