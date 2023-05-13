const estadisticasModel = require('../models/estadisticasModel')



async function get10MejoresClientesPorCantidadBolsas(filtroPrincipal, filtroMes) {
    let clientesConTotal = await estadisticasModel.get10mejoresclientesbolsas(filtroPrincipal, filtroMes);
    return clientesConTotal;
}


async function get10MejoresClientesPorCantidadPuntos(filtroPrincipal, filtroMes) {
    let clientesConTotal = await estadisticasModel.get10mejoresclientespuntos(filtroPrincipal, filtroMes);
    return clientesConTotal;
}


async function getTotalBolsas(filtroPrincipal, filtroMes) {
    let total = await estadisticasModel.gettotalbolsas(filtroPrincipal, filtroMes);
    return total[0];
}

async function getTotalPuntos(filtroPrincipal, filtroMes) {
    let total = await estadisticasModel.gettotalpuntos(filtroPrincipal, filtroMes);
    return total[0];
}

async function getMesMasPuntos() {
    let mes = await estadisticasModel.getmesmaspuntos();
    return mes[0];
}


module.exports = {
    get10MejoresClientesPorCantidadBolsas,
    get10MejoresClientesPorCantidadPuntos,
    getMesMasPuntos,
    getTotalPuntos,
    getTotalBolsas
}