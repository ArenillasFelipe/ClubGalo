const { actualizarPuntosClienteById } = require('../models/clienteModel');
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

async function insertMascota(newMascota) {
    let nacimiento = newMascota.nacimiento;

    nacimiento = nacimiento.split("/");
    nacimiento = new Date(nacimiento[2], nacimiento[1] - 1, nacimiento[0]);
    newMascota.nacimiento = nacimiento;

    await mascotaModel.insertMascota(newMascota);
}



async function actualizarMascotasCliente(mascotasMod, mascotasOriginal) {

    //busco las mascotas que ya no estan en el arreglo mascotasMod y las borro
    let mascotasBorradas = mascotasOriginal.filter(original => !mascotasMod.some(modificada => modificada.id_mascota == original.id_mascota));
    for (let i = 0; i < mascotasBorradas.length; i++) {
        const element = mascotasBorradas[i];
        mascotaModel.deleteMascotaById(element.id_mascota);
    }


    for (let i = 0; i < mascotasMod.length; i++) {
        const element = mascotasMod[i];

        let nacimiento = element.nacimiento;

        nacimiento = nacimiento.split("/");
        nacimiento = new Date(nacimiento[2], nacimiento[1] - 1, nacimiento[0]);

        element.nacimiento = nacimiento;


        //pregunto si el id es positivo porque a las agregadas les ponia id negativo
        if (element.id_mascota > 0) {
            await mascotaModel.updateMascotaById(element);
        }else{
            await mascotaModel.insertMascota(element);
        }

    }
}



module.exports = { 
    getMascotasByIdCliente,
    insertMascota,
    actualizarMascotasCliente
 }