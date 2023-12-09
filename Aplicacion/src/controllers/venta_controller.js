const clienteModel = require('../models/clienteModel');
const ventaModel = require('../models/ventaModel');
const mascotaModel = require('../models/mascotaModel');
const venta_mascotaModel = require('../models/venta_mascotaModel');
const configModel = require('../models/configModel');
const { calcularDuracionBolsa, sumarDiasAFechaActual, calcularDiasEntreFechas } = require('../utils/calcularFechas');


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



async function insertarVenta(newVenta, bolsasVenta, mascotasVenta, puntosActualesCliente, nuevosPuntosCliente) {
    console.log("Mascotas seleccionadas: ", mascotasVenta);
        

        // newVenta.precio = (newVenta.precio).replace(/,/g, '.');
        // newVenta.precio = parseFloat(newVenta.precio);


        switch (bolsasVenta.calidadActual) {
            case "BAJA":
                newVenta.puntos_obtenidos = bolsasVenta.kilosActuales * bolsasVenta.cantidadActual
                break;
            case "INTERMEDIA":
                newVenta.puntos_obtenidos = bolsasVenta.kilosActuales * bolsasVenta.cantidadActual * 2
                break;
            case "PREMIUM":
                newVenta.puntos_obtenidos = bolsasVenta.kilosActuales * bolsasVenta.cantidadActual * 3
                break;
            case "SUPER PREMIUM":
                newVenta.puntos_obtenidos = bolsasVenta.kilosActuales * bolsasVenta.cantidadActual * 4
                break;
            default:
                break;
        }

    let multiplicadorPuntos = await configModel.getMultiplicadorPuntos();  
    newVenta.puntos_obtenidos = newVenta.puntos_obtenidos * multiplicadorPuntos.valor_config;

    newVenta.puntos_canjeados = puntosActualesCliente - nuevosPuntosCliente;

    nuevosPuntosCliente = nuevosPuntosCliente + newVenta.puntos_obtenidos;

    await clienteModel.actualizarPuntosClienteById(newVenta.id_cliente, nuevosPuntosCliente);

    //pongo en inactiva las ventas en las que ya estaba la mascota
    console.log("mascotas seleccionadas:", mascotasVenta);
    for (let i = 0; i < mascotasVenta.length; i++) {

        let ventaActivaMascota = await venta_mascotaModel.getVenta_MascotaActivaByIdMascota(mascotasVenta[i].id_mascota);

        if (ventaActivaMascota) {
            await ventaModel.actualizarVentaAInactivaById(ventaActivaMascota.id_venta);
        }
    }

    let duracionBolsa = calcularDuracionBolsa(mascotasVenta, bolsasVenta);
    let vencimientoVenta = sumarDiasAFechaActual(duracionBolsa);
    newVenta.vencimiento = vencimientoVenta;
    console.log("duracion bolsa: ", duracionBolsa);
    resultInsert = await ventaModel.insertVenta(newVenta, bolsasVenta);


    console.log("id con el que se guardo: ", resultInsert.insertId);

    for (let i = 0; i < mascotasVenta.length; i++) {
        await venta_mascotaModel.insertVenta_Mascota(resultInsert.insertId, mascotasVenta[i].id_mascota);
    }
}


async function get20VentasPorVencerConMascotas(salto) {
    let ventas = [];
    ventas = await ventaModel.get20VentasPorVencer(salto);
    console.log("ventas:" ,ventas);

    let ventasConMascotas = [];
    for (let i = 0; i < ventas.length; i++) {

        let cliente = await clienteModel.getClienteById(ventas[i].id_cliente);

        console.log(cliente);

        ventas[i].vencimiento = Math.round(calcularDiasEntreFechas(new Date(), ventas[i].vencimiento));

        let idMascotasVenta = await venta_mascotaModel.getVenta_MascotasByIdVenta(ventas[i].id_venta);
        let mascotas = [];
        for (let i = 0; i < idMascotasVenta.length; i++) {
            let mascota = await mascotaModel.getMascotaById(idMascotasVenta[i].id_mascota);
            mascotas.push(mascota);
        }

        console.log(mascotas);

        // Agregar la información del cliente a la venta correspondiente
        ventasConMascotas.push({
            venta: ventas[i],
            mascotas: mascotas,
            cliente: cliente
        });
    }

    
    return ventasConMascotas;
}



async function actualizarVentasVencidas() {
    await ventaModel.actualizarVentasVencidas();
}


module.exports = {
    get20VentasByIdClienteByFiltersController,
    get20Ventas,
    borrarVenta_RestarPuntos,
    get20UltimasVentasByIdCliente,
    getVentasActivasByIdCliente,
    insertarVenta,
    get20VentasPorVencerConMascotas,
    actualizarVentasVencidas
}