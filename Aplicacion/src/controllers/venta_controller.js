const clienteModel = require('../models/clienteModel');
const ventaModel = require('../models/ventaModel');
const bolsaModel = require('../models/bolsaModel');
const bolsaKiloModel = require('../models/bolsa_kiloModel');
const mascotaModel = require('../models/mascotaModel');
const venta_mascotaModel = require('../models/venta_mascotaModel');




async function get20UltimasVentasByIdCliente(id_cliente) {
    let ventas = [];
    ventas = await ventaModel.getUltimas20VentasByIdCliente(id_cliente);


    let ventasConBolsas = [];
    for (let i = 0; i < ventas.length; i++) {
        let bolsaKilo = await bolsaKiloModel.getBolsa_KiloById(ventas[i].id_bolsa_kilo);
        let bolsa = await bolsaModel.getBolsaById(bolsaKilo.id_bolsa);

        // Agregar la información del cliente a la venta correspondiente
        ventasConBolsas.push({
            venta: ventas[i],
            bolsaKilo: bolsaKilo,
            bolsa: bolsa
        });
    }


    if (ventas.length == 0) {
        throw new Error("sinVentas");
    }
    return ventasConBolsas;
}

async function get20ClientesBySearch(busqueda) {
    let cliente = await clienteModel.get20ClientesBySearch(busqueda);
    if (!cliente) {
        throw new Error("noExisteCliente");
    }
    if (cliente.length > 1) {
        throw new Error("variosClientes");
    }
    return cliente[0]
}


async function getMascotasByIdCliente(id_cliente){
    let mascotas = await mascotaModel.getMascotasByIdCliente(id_cliente);

    for (let i = 0; i < mascotas.length; i++) {
        dia = mascotas[i].nacimiento;
        mes = mascotas[i].nacimiento;
        anio = mascotas[i].nacimiento;

        dia = dia.getDate();
        mes = mes.getMonth();
        mes = mes + 1;
        anio = anio.getFullYear();
        
        mascotas[i].nacimiento = `${dia}/${mes}/${anio}`;
    }

    return mascotas;
}




async function getVentasActivasByIdCliente(id_cliente) {
    let ventasActivas = await ventaModel.getVentasActivasByIdCliente(id_cliente);


    let ventasActivasConDatos = [];
    for (let i = 0; i < ventasActivas.length; i++) {
        let idMascotasVenta = await venta_mascotaModel.getVenta_MascotasByIdVenta(ventasActivas[i].id_venta);
        let mascotas = [];
        for (let i = 0; i < idMascotasVenta.length; i++) {
            let mascota = await mascotaModel.getMascotaById(idMascotasVenta[i].id_mascota);
            mascotas.push(mascota);
        }



        let bolsaKilo = await bolsaKiloModel.getBolsa_KiloById(ventasActivas[i].id_bolsa_kilo);
        let bolsa = await bolsaModel.getBolsaById(bolsaKilo.id_bolsa);

        // Agregar la información del cliente a la venta correspondiente
        ventasActivasConDatos.push({
            venta: ventasActivas[i],
            bolsaKilo: bolsaKilo,
            bolsa: bolsa,
            mascotas: mascotas
        });
    }


    return ventasActivasConDatos;
}



async function getAllBolsasOrdenadas() {
    let bolsas = await bolsaModel.getAllBolsas();
    bolsas.sort((bolsa1, bolsa2) => {
        if (bolsa1.marca_bolsa < bolsa2.marca_bolsa) {
          return -1;
        } else if (bolsa1.marca_bolsa > bolsa2.marca_bolsa) {
          return 1;
        } else {
          return 0;
        }
      });
    return bolsas;
}


async function getKilosBolsaByIdBolsa(id_bolsa) {
    let kilos = await bolsaKiloModel.getKilosBolsaByIdBolsa(id_bolsa);
    kilos.sort((a, b) => a.kilos_bolsa - b.kilos_bolsa);
    return kilos;
}


async function ejecutarVenta(newVenta, idMascotasVenta) {
    console.log("Mascotas seleccionadas: ", idMascotasVenta);
      


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
    get20ClientesBySearch,
    get20UltimasVentasByIdCliente,
    getMascotasByIdCliente,
    getVentasActivasByIdCliente,
    getAllBolsasOrdenadas,
    getKilosBolsaByIdBolsa,
    ejecutarVenta
}