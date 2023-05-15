const clienteModel = require('../models/clienteModel');
const ventaModel = require('../models/ventaModel');
const mascotaModel = require('../models/mascotaModel');
const venta_mascotaModel = require('../models/venta_mascotaModel');


async function get20VentasByIdClienteByFiltersController(id_cliente, filtro, filtroMes, salto) {
    let ventas = await ventaModel.get20VentasByIdClienteByFilters(id_cliente, filtro, filtroMes, salto);

    for (let i = 0; i < ventas.length; i++) {
        dia = ventas[i].fecha;
        mes = ventas[i].fecha;
        anio = ventas[i].fecha;
        dia = dia.getDate();
        mes = mes.getMonth();
        mes = mes + 1;
        anio = anio.getFullYear();
        ventas[i].fecha = `${dia}/${mes}/${anio}`;
    }

    return ventas;
}




async function get20Ventas(newBusqueda, salto) {

    // Obtener todas las ventas desde el modelo de ventas
    let ventas = [];
    if (newBusqueda == "" || newBusqueda == undefined) {
        ventas = await ventaModel.get20Ventas(salto);
    } else {
        ventas = await ventaModel.get20VentasBySearch(newBusqueda, salto);
    }
    // Crear un arreglo para almacenar los datos de todas las ventas con la información del cliente relacionado
    let ventasConDatos = [];
    // Iterar sobre cada venta
    for (let i = 0; i < ventas.length; i++) {
        let cliente = await clienteModel.getClienteById(ventas[i].id_cliente);

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
        });
    }
    console.log(ventasConDatos);
    // Enviar el arreglo a la vista para que se muestre la información
    return ventasConDatos;
}


async function borrarVenta_RestarPuntos(id_venta, confirmaRestarPuntos) {

    if (confirmaRestarPuntos) {
        let venta = await ventaModel.getVentaById(id_venta);
        let cliente = await clienteModel.getClienteById(venta.id_cliente);


        let nuevosPuntosCliente = cliente.puntos - venta.puntos_obtenidos + venta.puntos_canjeados;
        console.log(nuevosPuntosCliente);

        await clienteModel.actualizarPuntosClienteById(venta.id_cliente, nuevosPuntosCliente);
    }

    await venta_mascotaModel.deleteVenta_MascotaByIdVenta(id_venta);
    await ventaModel.deleteVentaById(id_venta);
}



async function get20UltimasVentasByIdCliente(id_cliente) {
    let ventas = await ventaModel.getUltimas20VentasByIdCliente(id_cliente);

    if (ventas.length == 0) {
        throw new Error("sinVentas");
    }
    return ventas;
}


async function getVentasActivasByIdCliente(id_cliente) {
    let ventasActivas = await ventaModel.getVentasActivasByIdCliente(id_cliente);


    let ventasActivasConMascotas = [];
    for (let i = 0; i < ventasActivas.length; i++) {
        let idMascotasVenta = await venta_mascotaModel.getVenta_MascotasByIdVenta(ventasActivas[i].id_venta);
        let mascotas = [];
        for (let i = 0; i < idMascotasVenta.length; i++) {
            let mascota = await mascotaModel.getMascotaById(idMascotasVenta[i].id_mascota);
            mascotas.push(mascota);
        }

        // Agregar la información del cliente a la venta correspondiente
        ventasActivasConMascotas.push({
            venta: ventasActivas[i],
            mascotas: mascotas
        });
    }


    return ventasActivasConMascotas;
}



async function insertarVenta(newVenta, idMascotasVenta, puntosActualesCliente, nuevosPuntosCliente) {
    console.log("Mascotas seleccionadas: ", idMascotasVenta);



        switch (newVenta.calidad_bolsa) {
            case "BAJA":
                newVenta.puntos_obtenidos = newVenta.kilos_bolsa * newVenta.cantidad
                break;
            case "INTERMEDIA":
                newVenta.puntos_obtenidos = newVenta.kilos_bolsa * newVenta.cantidad * 2
                break;
            case "PREMIUM":
                newVenta.puntos_obtenidos = newVenta.kilos_bolsa * newVenta.cantidad * 3
                break;
            case "SUPER PREMIUM":
                newVenta.puntos_obtenidos = newVenta.kilos_bolsa * newVenta.cantidad * 4
                break;
            default:
                break;
        }


    newVenta.puntos_canjeados = puntosActualesCliente - nuevosPuntosCliente;

    nuevosPuntosCliente = nuevosPuntosCliente + newVenta.puntos_obtenidos;

    await clienteModel.actualizarPuntosClienteById(newVenta.id_cliente, nuevosPuntosCliente);


    for (let i = 0; i < idMascotasVenta.length; i++) {

        let ventaActivaMascota = await venta_mascotaModel.getVenta_MascotaActivaByIdMascota(idMascotasVenta[i]);

        if (ventaActivaMascota) {
            await ventaModel.actualizarVentaAInactivaById(ventaActivaMascota.id_venta);
        }
    }

    resultInsert = await ventaModel.insertVenta(newVenta);


    console.log("id con el que se guardo: ", resultInsert.insertId);

    for (let i = 0; i < idMascotasVenta.length; i++) {
        await venta_mascotaModel.insertVenta_Mascota(resultInsert.insertId, idMascotasVenta[i]);
    }
}


module.exports = {
    get20VentasByIdClienteByFiltersController,
    get20Ventas,
    borrarVenta_RestarPuntos,
    get20UltimasVentasByIdCliente,
    getVentasActivasByIdCliente,
    insertarVenta
}