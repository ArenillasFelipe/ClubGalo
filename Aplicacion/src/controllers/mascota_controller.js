const mascotaModel = require('../models/mascotaModel');


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


module.exports = { getMascotasByIdCliente }