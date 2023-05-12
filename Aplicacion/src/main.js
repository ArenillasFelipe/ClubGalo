const { BrowserWindow, Notification } = require('electron')
const { getConnection } = require('./database')

async function borrar_venta_main(idVenta) {
    const conn = await getConnection();
    await conn.query('delete from venta_mascota where id_venta = ?', idVenta);
    await conn.query('delete from venta where id_venta = ?', idVenta);
}

async function restarPuntosClientePorBorradoDeVenta(idVenta, idCliente) {
    const conn = await getConnection();

    let puntosParaRestar = await conn.query('select puntos_obtenidos from venta where id_venta = ?', idVenta);
    let puntosActuales = await conn.query('select puntos from clientes where id_cliente = ?', idCliente);

    puntosParaRestar = puntosParaRestar[0].puntos_obtenidos;
    puntosActuales = puntosActuales[0].puntos;

    await conn.query('UPDATE clientes SET puntos = (? - ?) WHERE id_cliente = ?;', [puntosActuales, puntosParaRestar, idCliente]);
}




async function buscar20ClientesMain(busqueda, salto) {
    busqueda = busqueda.split(/\s+/);
    let busqueda0 = busqueda[0];
    for (let i = 0; i < busqueda.length; i++) {
        busqueda[i] = busqueda[i] + '%';
    }
    console.log(busqueda.length);
    console.log(busqueda);
    const conn = await getConnection();
    if (busqueda.length == 1) {
        const resultado = await conn.query('select * from clientes where (id_cliente = ? or primernombre like ? or nombrepila like ? or apellido like ? or telefono = ?) LIMIT ?, 20;', [busqueda0, busqueda[0], busqueda[0], busqueda[0], busqueda0, salto]);
        return resultado;
    }
    if (busqueda.length == 2) {
        const resultado = await conn.query('select * from clientes where (primernombre like ? or nombrepila like ? or apellido like ?) and (primernombre like ? or nombrepila like ? or apellido like ?) LIMIT ?, 20;', [busqueda[0], busqueda[0], busqueda[0], busqueda[1], busqueda[1], busqueda[1], salto]);
        return resultado;
    }
    if (busqueda.length == 3) {
        const resultado = await conn.query('select * from clientes where (primernombre like ? or nombrepila like ? or apellido like ?) and (primernombre like ? or nombrepila like ? or apellido like ?) and (primernombre like ? or nombrepila like ? or apellido like ?) LIMIT ?, 20;', [busqueda[0], busqueda[0], busqueda[0], busqueda[1], busqueda[1], busqueda[1], busqueda[2], busqueda[2], busqueda[2], salto]);
        return resultado;
    }
}

async function get10mejoresclientesbolsas(filtro, filtro2) {
    const conn = await getConnection();

    console.log(filtro, filtro2);

    if (filtro == "anio") {
        anio = new Date();
        anio = anio.getFullYear();
        const resultado = await conn.query('select clientes.*, sum(venta.cantidad) as totalbolsas from clientes inner join venta on venta.id_cliente = clientes.id_cliente where YEAR(venta.fecha) = ? group by clientes.id_cliente order by sum(venta.cantidad) DESC LIMIT 10;', anio);
        return resultado;
    } else if (filtro == "total") {
        const resultado = await conn.query('select clientes.*, sum(venta.cantidad) as totalbolsas from clientes inner join venta on venta.id_cliente = clientes.id_cliente group by clientes.id_cliente order by sum(venta.cantidad) DESC LIMIT 10;');
        return resultado;
    } else if (filtro == "elegir" && filtro2 != "") {
        anio = filtro2[0] + filtro2[1] + filtro2[2] + filtro2[3];
        mes = filtro2[5] + filtro2[6];
        console.log("anio:", anio, "Mes:", mes);
        const resultado = await conn.query('select clientes.*, sum(venta.cantidad) as totalbolsas from clientes inner join venta on venta.id_cliente = clientes.id_cliente where YEAR(venta.fecha) = ? and MONTH(venta.fecha) = ? group by clientes.id_cliente order by sum(venta.cantidad) DESC LIMIT 10;', [anio, mes]);
        console.log("resultado:", resultado);
        return resultado;
    } else if (filtro == "anioatras") {
        let fechaActual = new Date();
        let aniomenos = fechaActual.getFullYear() - 1;
        let mes = fechaActual.getMonth() + 1;
        console.log("mes que queremos ver:", mes);
        let dia = fechaActual.getDate();
        const resultado = await conn.query('select clientes.*, sum(venta.cantidad) as totalbolsas from clientes inner join venta on venta.id_cliente = clientes.id_cliente where venta.fecha >= "?-?-?" group by clientes.id_cliente order by sum(venta.cantidad) DESC LIMIT 10;', [aniomenos, mes, dia]);
        console.log("resultado:", resultado);
        return resultado;
    }





}
async function get10mejoresclientespuntos(filtro, filtro2) {
    const conn = await getConnection();

    console.log(filtro, filtro2);

    if (filtro == "anio") {
        anio = new Date();
        anio = anio.getFullYear();
        const resultado = await conn.query('select clientes.*, sum(venta.puntos_obtenidos) as puntos_obtenidos_total from clientes inner join venta on venta.id_cliente = clientes.id_cliente where YEAR(venta.fecha) = ? group by clientes.id_cliente order by puntos_obtenidos DESC LIMIT 10;', anio);
        return resultado;
    } else if (filtro == "total") {
        const resultado = await conn.query('select clientes.*, sum(venta.puntos_obtenidos) as puntos_obtenidos_total from clientes inner join venta on venta.id_cliente = clientes.id_cliente group by clientes.id_cliente order by puntos_obtenidos DESC LIMIT 10;');
        return resultado;
    } else if (filtro == "elegir" && filtro2 != "") {
        anio = filtro2[0] + filtro2[1] + filtro2[2] + filtro2[3];
        mes = filtro2[5] + filtro2[6];
        console.log("anio:", anio, "Mes:", mes);
        const resultado = await conn.query('select clientes.*, sum(venta.puntos_obtenidos) as puntos_obtenidos_total from clientes inner join venta on venta.id_cliente = clientes.id_cliente where YEAR(venta.fecha) = ? and MONTH(venta.fecha) = ? group by clientes.id_cliente order by puntos_obtenidos DESC LIMIT 10;', [anio, mes]);
        console.log("resultado:", resultado);
        return resultado;
    } else if (filtro == "anioatras") {
        let fechaActual = new Date();
        let aniomenos = fechaActual.getFullYear() - 1;
        let mes = fechaActual.getMonth() + 1;
        console.log("mes que queremos ver:", mes);
        let dia = fechaActual.getDate();
        const resultado = await conn.query('select clientes.*, sum(venta.puntos_obtenidos) as puntos_obtenidos_total from clientes inner join venta on venta.id_cliente = clientes.id_cliente where venta.fecha >= "?-?-?" group by clientes.id_cliente order by puntos_obtenidos DESC LIMIT 10;', [aniomenos, mes, dia]);
        console.log("resultado:", resultado);
        return resultado;
    }

}

async function gettotalbolsas(filtro, filtro2) {
    const conn = await getConnection();

    console.log(filtro, filtro2);

    if (filtro == "anio") {
        anio = new Date();
        anio = anio.getFullYear();
        const resultado = await conn.query('select sum(venta.cantidad) as totalbolsas from venta where YEAR(venta.fecha) = ?;', anio);
        return resultado;
    } else if (filtro == "total") {
        const resultado = await conn.query('select sum(venta.cantidad) as totalbolsas from venta;');
        return resultado;
    } else if (filtro == "elegir" && filtro2 != "") {
        anio = filtro2[0] + filtro2[1] + filtro2[2] + filtro2[3];
        mes = filtro2[5] + filtro2[6];
        console.log("anio:", anio, "Mes:", mes);
        const resultado = await conn.query('select sum(venta.cantidad) as totalbolsas from venta where YEAR(venta.fecha) = ? and MONTH(venta.fecha) = ?;', [anio, mes]);
        console.log("resultado:", resultado);
        return resultado;
    } else if (filtro == "anioatras") {
        let fechaActual = new Date();
        let aniomenos = fechaActual.getFullYear() - 1;
        let mes = fechaActual.getMonth() + 1;
        console.log("mes que queremos ver:", mes);
        let dia = fechaActual.getDate();
        const resultado = await conn.query('select sum(venta.cantidad) as totalbolsas from venta where venta.fecha >= "?-?-?";', [aniomenos, mes, dia]);
        console.log("resultado:", resultado);
        return resultado;
    }

}

async function gettotalpuntos(filtro, filtro2) {
    const conn = await getConnection();

    console.log(filtro, filtro2);

    if (filtro == "anio") {
        anio = new Date();
        anio = anio.getFullYear();
        const resultado = await conn.query('select sum(venta.puntos_obtenidos) as puntos_obtenidos_total from venta where YEAR(venta.fecha) = 2023;', anio);
        return resultado;
    } else if (filtro == "total") {
        const resultado = await conn.query('select sum(venta.puntos_obtenidos) as puntos_obtenidos_total from venta;');
        return resultado;
    } else if (filtro == "elegir" && filtro2 != "") {
        anio = filtro2[0] + filtro2[1] + filtro2[2] + filtro2[3];
        mes = filtro2[5] + filtro2[6];
        console.log("anio:", anio, "Mes:", mes);
        const resultado = await conn.query('select sum(venta.puntos_obtenidos) as puntos_obtenidos_total from venta where YEAR(venta.fecha) = ? and MONTH(venta.fecha) = ?;', [anio, mes]);
        console.log("resultado:", resultado);
        return resultado;
    } else if (filtro == "anioatras") {
        let fechaActual = new Date();
        let aniomenos = fechaActual.getFullYear() - 1;
        let mes = fechaActual.getMonth() + 1;
        console.log("mes que queremos ver:", mes);
        let dia = fechaActual.getDate();
        const resultado = await conn.query('select sum(venta.puntos_obtenidos) as puntos_obtenidos_total from venta where venta.fecha >= "?-?-?";', [aniomenos, mes, dia]);
        console.log("resultado:", resultado);
        return resultado;
    }

}

async function getmesmaspuntos() {
    const conn = await getConnection();
    anio = new Date();
    anio = anio.getFullYear();
    const resultado = await conn.query('select month(venta.fecha) as mes from venta where year(venta.fecha) = ? group by mes order by sum(venta.puntos_obtenidos) DESC limit 1;', anio);
    return resultado;
}































function notificacionNoVenta() {
    new remote.Notification({
        title: 'El cliente ingresado no tiene ventas en el filtro selecionado'
    }).show();
}


function notificacionNoCliente() {
    new remote.Notification({
        title: 'No se ha detectado ese cliente'
    }).show();
}


async function get20ClientesTodos(salto) {
    const conn = await getConnection();
    const resultado = await conn.query('select * from clientes LIMIT ?, 20;', salto);
    return resultado;
}

async function getVentasActivasmain(id) {
    const conn = await getConnection();
    const resultado = await conn.query('select * from venta inner join venta_mascota on venta_mascota.id_venta = venta.id_venta inner join mascotas on mascotas.id_mascota = venta_mascota.id_mascota where venta.activo = true and venta.id_cliente = ?;', id);
    return resultado;
}

async function getClientefullnamemain(busqueda, filtro, filtro2, salto) {
    busqueda = busqueda.split(/\s+/);
    let busqueda0 = busqueda[0];
    for (let i = 0; i < busqueda.length; i++) {
        busqueda[i] = busqueda[i] + '%';
    }
    const conn = await getConnection();


    if (busqueda.length == 1) {

        console.log("salto:", salto)
        console.log("busqueda en lentgh 1:", busqueda);
        console.log(filtro, filtro2);

        if (filtro == "anio") {
            anio = new Date();
            anio = anio.getFullYear();
            const resultado = await conn.query('select * from clientes inner join venta on venta.id_cliente = clientes.id_cliente inner join bolsas_kilos on bolsas_kilos.id_bolsa_kilo = venta.id_bolsa_kilo inner join bolsas on bolsas_kilos.id_bolsa = bolsas.id_bolsa where (clientes.id_cliente = ? or clientes.primernombre like ? or clientes.nombrepila like ? or clientes.apellido like ? or clientes.telefono = ?) and year(venta.fecha) = ? order by venta.fecha ASC limit ?, 20;', [busqueda0, busqueda[0], busqueda[0], busqueda[0], busqueda0, anio, salto]);
            return resultado;
        } else if (filtro == "total") {
            const resultado = await conn.query('select * from clientes inner join venta on venta.id_cliente = clientes.id_cliente inner join bolsas_kilos on bolsas_kilos.id_bolsa_kilo = venta.id_bolsa_kilo inner join bolsas on bolsas_kilos.id_bolsa = bolsas.id_bolsa where (clientes.id_cliente = ? or clientes.primernombre like ? or clientes.nombrepila like ? or clientes.apellido like ? or clientes.telefono = ?) order by venta.fecha ASC limit ?, 20;', [busqueda0, busqueda[0], busqueda[0], busqueda[0], busqueda0, salto]);
            return resultado;
        } else if (filtro == "elegir" && filtro2 != "") {
            anio = filtro2[0] + filtro2[1] + filtro2[2] + filtro2[3];
            mes = filtro2[5] + filtro2[6];
            console.log("anio:", anio, "Mes:", mes);
            const resultado = await conn.query('select * from clientes inner join venta on venta.id_cliente = clientes.id_cliente inner join bolsas_kilos on bolsas_kilos.id_bolsa_kilo = venta.id_bolsa_kilo inner join bolsas on bolsas_kilos.id_bolsa = bolsas.id_bolsa where (clientes.id_cliente = ? or clientes.primernombre like ? or clientes.nombrepila like ? or clientes.apellido like ? or clientes.telefono = ?) and year(venta.fecha) = ? and month(venta.fecha) = ? order by venta.fecha ASC limit ?, 20;', [busqueda0, busqueda[0], busqueda[0], busqueda[0], busqueda0, anio, mes, salto]);
            console.log("resultado:", resultado);
            return resultado;
        } else if (filtro == "anioatras") {
            let fechaActual = new Date();
            let aniomenos = fechaActual.getFullYear() - 1;
            let mes = fechaActual.getMonth() + 1;
            let dia = fechaActual.getDate();
            console.log("fecha que quedo:", dia, mes, aniomenos);
            console.log("salto:", salto)
            const resultado = await conn.query('select * from clientes inner join venta on venta.id_cliente = clientes.id_cliente inner join bolsas_kilos on bolsas_kilos.id_bolsa_kilo = venta.id_bolsa_kilo inner join bolsas on bolsas_kilos.id_bolsa = bolsas.id_bolsa where (clientes.id_cliente = ? or clientes.primernombre like ? or clientes.nombrepila like ? or clientes.apellido like ? or clientes.telefono = ?) and venta.fecha >= "?-?-?" order by venta.fecha ASC limit ?, 20;', [busqueda0, busqueda[0], busqueda[0], busqueda[0], busqueda0, aniomenos, mes, dia, salto]);
            console.log("resultado:", resultado);
            return resultado;
        }



        return resultado;








    } else if (busqueda.length == 2) {


        if (filtro == "anio") {
            anio = new Date();
            anio = anio.getFullYear();
            const resultado = await conn.query('select * from clientes inner join venta on venta.id_cliente = clientes.id_cliente inner join bolsas_kilos on bolsas_kilos.id_bolsa_kilo = venta.id_bolsa_kilo inner join bolsas on bolsas_kilos.id_bolsa = bolsas.id_bolsa where (clientes.primernombre like ? or clientes.nombrepila like ? or clientes.apellido like ? ) and (clientes.primernombre like ? or clientes.nombrepila like ? or clientes.apellido like ? ) and year(venta.fecha) = ? order by venta.fecha ASC limit ?, 20;', [busqueda[0], busqueda[0], busqueda[0], busqueda[1], busqueda[1], busqueda[1], anio, salto]);
            return resultado;
        } else if (filtro == "total") {
            const resultado = await conn.query('select * from clientes inner join venta on venta.id_cliente = clientes.id_cliente inner join bolsas_kilos on bolsas_kilos.id_bolsa_kilo = venta.id_bolsa_kilo inner join bolsas on bolsas_kilos.id_bolsa = bolsas.id_bolsa where (clientes.primernombre like ? or clientes.nombrepila like ? or clientes.apellido like ? ) and (clientes.primernombre like ? or clientes.nombrepila like ? or clientes.apellido like ? ) order by venta.fecha ASC limit ?, 20;', [busqueda[0], busqueda[0], busqueda[0], busqueda[1], busqueda[1], busqueda[1], salto]);
            return resultado;
        } else if (filtro == "elegir" && filtro2 != "") {
            anio = filtro2[0] + filtro2[1] + filtro2[2] + filtro2[3];
            mes = filtro2[5] + filtro2[6];
            console.log("anio:", anio, "Mes:", mes);
            const resultado = await conn.query('select * from clientes inner join venta on venta.id_cliente = clientes.id_cliente inner join bolsas_kilos on bolsas_kilos.id_bolsa_kilo = venta.id_bolsa_kilo inner join bolsas on bolsas_kilos.id_bolsa = bolsas.id_bolsa where (clientes.primernombre like ? or clientes.nombrepila like ? or clientes.apellido like ? ) and (clientes.primernombre like ? or clientes.nombrepila like ? or clientes.apellido like ? ) and year(venta.fecha) = ? and month(venta.fecha) = ? order by venta.fecha ASC limit ?, 20;', [busqueda[0], busqueda[0], busqueda[0], busqueda[1], busqueda[1], busqueda[1], anio, mes, salto]);
            console.log("resultado:", resultado);
            return resultado;
        } else if (filtro == "anioatras") {
            let fechaActual = new Date();
            let aniomenos = fechaActual.getFullYear() - 1;
            let mes = fechaActual.getMonth() + 1;
            let dia = fechaActual.getDate();
            console.log("fecha que quedo:", dia, mes, aniomenos);
            const resultado = await conn.query('select * from clientes inner join venta on venta.id_cliente = clientes.id_cliente inner join bolsas_kilos on bolsas_kilos.id_bolsa_kilo = venta.id_bolsa_kilo inner join bolsas on bolsas_kilos.id_bolsa = bolsas.id_bolsa where (clientes.primernombre like ? or clientes.nombrepila like ? or clientes.apellido like ? ) and (clientes.primernombre like ? or clientes.nombrepila like ? or clientes.apellido like ? ) and venta.fecha >= "?-?-?" order by venta.fecha ASC limit ?, 20;', [busqueda[0], busqueda[0], busqueda[0], busqueda[1], busqueda[1], busqueda[1], aniomenos, mes, dia, salto]);
            console.log("resultado:", resultado);
            return resultado;
        }



        return resultado;


    } else if (busqueda.length == 3) {


        if (filtro == "anio") {
            anio = new Date();
            anio = anio.getFullYear();
            const resultado = await conn.query('select * from clientes inner join venta on venta.id_cliente = clientes.id_cliente inner join bolsas_kilos on bolsas_kilos.id_bolsa_kilo = venta.id_bolsa_kilo inner join bolsas on bolsas_kilos.id_bolsa = bolsas.id_bolsa where (clientes.primernombre like ? or clientes.nombrepila like ? or clientes.apellido like ?) and (clientes.primernombre like ? or clientes.nombrepila like ? or clientes.apellido like ?) and (clientes.primernombre like ? or clientes.nombrepila like ? or clientes.apellido like ?) and year(venta.fecha) = ? order by venta.fecha ASC limit ?, 20;', [busqueda[0], busqueda[0], busqueda[0], busqueda[1], busqueda[1], busqueda[1], busqueda[2], busqueda[2], busqueda[2], anio, salto]);
            return resultado;
        } else if (filtro == "total") {
            const resultado = await conn.query('select * from clientes inner join venta on venta.id_cliente = clientes.id_cliente inner join bolsas_kilos on bolsas_kilos.id_bolsa_kilo = venta.id_bolsa_kilo inner join bolsas on bolsas_kilos.id_bolsa = bolsas.id_bolsa where (clientes.primernombre like ? or clientes.nombrepila like ? or clientes.apellido like ?) and (clientes.primernombre like ? or clientes.nombrepila like ? or clientes.apellido like ?) and (clientes.primernombre like ? or clientes.nombrepila like ? or clientes.apellido like ?) order by venta.fecha ASC limit ?, 20;', [busqueda[0], busqueda[0], busqueda[0], busqueda[1], busqueda[1], busqueda[1], busqueda[2], busqueda[2], busqueda[2], salto]);
            return resultado;
        } else if (filtro == "elegir" && filtro2 != "") {
            anio = filtro2[0] + filtro2[1] + filtro2[2] + filtro2[3];
            mes = filtro2[5] + filtro2[6];
            console.log("anio:", anio, "Mes:", mes);
            const resultado = await conn.query('select * from clientes inner join venta on venta.id_cliente = clientes.id_cliente inner join bolsas_kilos on bolsas_kilos.id_bolsa_kilo = venta.id_bolsa_kilo inner join bolsas on bolsas_kilos.id_bolsa = bolsas.id_bolsa where (clientes.primernombre like ? or clientes.nombrepila like ? or clientes.apellido like ?) and (clientes.primernombre like ? or clientes.nombrepila like ? or clientes.apellido like ?) and (clientes.primernombre like ? or clientes.nombrepila like ? or clientes.apellido like ?) and year(venta.fecha) = ? and month(venta.fecha) = ? order by venta.fecha ASC limit ?, 20;', [busqueda[0], busqueda[0], busqueda[0], busqueda[1], busqueda[1], busqueda[1], busqueda[2], busqueda[2], busqueda[2], anio, mes, salto]);
            console.log("resultado:", resultado);
            return resultado;
        } else if (filtro == "anioatras") {
            let fechaActual = new Date();
            let aniomenos = fechaActual.getFullYear() - 1;
            let mes = fechaActual.getMonth() + 1;
            let dia = fechaActual.getDate();
            console.log("fecha que quedo:", dia, mes, aniomenos);
            const resultado = await conn.query('select * from clientes inner join venta on venta.id_cliente = clientes.id_cliente inner join bolsas_kilos on bolsas_kilos.id_bolsa_kilo = venta.id_bolsa_kilo inner join bolsas on bolsas_kilos.id_bolsa = bolsas.id_bolsa where (clientes.primernombre like ? or clientes.nombrepila like ? or clientes.apellido like ?) and (clientes.primernombre like ? or clientes.nombrepila like ? or clientes.apellido like ?) and (clientes.primernombre like ? or clientes.nombrepila like ? or clientes.apellido like ?) and venta.fecha >= "?-?-?" order by venta.fecha ASC limit ?, 20;', [busqueda[0], busqueda[0], busqueda[0], busqueda[1], busqueda[1], busqueda[1], busqueda[2], busqueda[2], busqueda[2], aniomenos, mes, dia, salto]);
            console.log("resultado:", resultado);
            return resultado;
        }



        return resultado;
    }
}

async function getsoloClientefullnamemain(busqueda) {
    busqueda = busqueda.split(/\s+/);
    let busqueda0 = busqueda[0];
    for (let i = 0; i < busqueda.length; i++) {
        busqueda[i] = busqueda[i] + '%';
    }
    console.log("estooo:", busqueda);
    const conn = await getConnection();


    if (busqueda.length == 1) {
        const resultado = await conn.query('select * from clientes where (id_cliente = ? or primernombre like ? or nombrepila like ? or apellido like ? or telefono = ?)', [busqueda0, busqueda[0], busqueda[0], busqueda[0], busqueda0]);
        return resultado;
    } else if (busqueda.length == 2) {
        const resultado = await conn.query('select * from clientes where (primernombre like ? or nombrepila like ? or apellido like ?) and (primernombre like ? or nombrepila like ? or apellido like ?)', [busqueda[0], busqueda[0], busqueda[0], busqueda[1], busqueda[1], busqueda[1]]);
        return resultado;
    } else if (busqueda.length == 3) {
        const resultado = await conn.query('select * from clientes where (primernombre like ? or nombrepila like ? or apellido like ?) and (primernombre like ? or nombrepila like ? or apellido like ?) and (primernombre like ? or nombrepila like ? or apellido like ?);', [busqueda[0], busqueda[0], busqueda[0], busqueda[1], busqueda[1], busqueda[1], busqueda[2], busqueda[2], busqueda[2]]);
        return resultado;
    }
}




async function getClientetelmain(cliente) {
    const conn = await getConnection();
    const resultado = await conn.query('select * from clientes where clientes.primernombre = ? and clientes.apellido = ? and clientes.telefono = ?', [cliente.primernombre, cliente.apellido, cliente.telefono]);
    return resultado;
}

function notificacion() {
    new remote.Notification({
        title: 'ATENCION',
        body: 'Existen varios clientes con ese nombre, por favor ingrese el numero de telefono'
    }).show();
}

function notificacionExito() {
    new remote.Notification({
        title: 'Venta ejecutada con exito',
    }).show();
}


function notificacionMascotas() {
    new remote.Notification({
        title: 'ATENCION',
        body: 'Debe seleccionar al menos una mascota'
    }).show();
}

async function getMascotaidmain(id) {
    const conn = await getConnection();
    const resultado = await conn.query('select * from mascotas where mascotas.id_mascota = ?', id);
    return resultado;
}



async function insertCliente(cliente) {
    try {
        const conn = await getConnection();
        console.log(cliente)
        cliente.telefono = parseFloat(cliente.telefono)
        cliente.calle_numero = parseFloat(cliente.calle_numero)
        cliente.cantbolsas = parseFloat(cliente.cantbolsas)
        cliente.cantmascotas = parseFloat(cliente.cantmascotas)
        const result = await conn.query('insert into clientes set ?', cliente)
        console.log(result)

        new Notification({
            title: 'Notificacion',
            body: 'Nuevo cliente guardado satisfactoriamente'
        }).show();

    } catch (error) {
        console.log(error)
    }
}

async function insertVentamain(venta, mascotas) {
    const conn = await getConnection();

    console.log("Mascotas seleccionadas: ", mascotas);
    for (let i = 0; i < mascotas.length; i++) {
        let idVentaActivaMascota = await conn.query('select venta.id_venta from venta inner join venta_mascota on venta.id_venta = venta_mascota.id_venta where venta_mascota.id_mascota = ? and venta.activo = true', mascotas[i]);
        console.log("idVentaActivaMAscota: ", idVentaActivaMascota);
        if (idVentaActivaMascota.length !== 0) {
            await conn.query('update venta set venta.activo = false where venta.id_venta = ?', idVentaActivaMascota[0].id_venta);
        }
    }

    const resultado = await conn.query('insert into venta set ?', venta);
    const idVenta = await conn.query('select id_venta from venta order by id_venta DESC LIMIT 1');

    console.log(idVenta[0].id_venta)

    console.log(mascotas.length);

    for (let i = 0; i < mascotas.length; i++) {
        const resultado2 = await conn.query('insert into venta_mascota(id_mascota, id_venta) values(?, ?) ', [mascotas[i], idVenta[0].id_venta]);
    }

}





async function getVentaspornombremain(cliente) {
    const conn = await getConnection();
    const resultado = await conn.query('select * from venta inner join bolsas_kilos on bolsas_kilos.id_bolsa_kilo = venta.id_bolsa_kilo inner join bolsas on bolsas_kilos.id_bolsa = bolsas.id_bolsa inner join clientes on venta.id_cliente = clientes.id_cliente where clientes.primernombre = ? and clientes.apellido = ? order by venta.fecha DESC', [cliente.primernombre, cliente.apellido]);
    return resultado;
}

async function getVentaspornombreTelmain(cliente, telefono) {
    const conn = await getConnection();
    const resultado = await conn.query('select * from venta inner join bolsas_kilos on bolsas_kilos.id_bolsa_kilo = venta.id_bolsa_kilo inner join bolsas on bolsas_kilos.id_bolsa = bolsas.id_bolsa inner join clientes on venta.id_cliente = clientes.id_cliente where clientes.primernombre = ? and clientes.apellido = ? and clientes.telefono = ? order by venta.fecha DESC', [cliente.primernombre, cliente.apellido, telefono]);
    return resultado;
}

async function getCLientemain(cliente) {
    const conn = await getConnection();
    const resultado = await conn.query('select * from clientes where clientes.primernombre = ? and clientes.apellido = ?', [cliente.primernombre, cliente.apellido]);
    return resultado;
}

async function getDatosmain(consulta) {
    const conn = await getConnection();
    const resultado = await conn.query('select * from clientes inner join mascotas on mascotas.id_cliente = clientes.id_cliente where clientes.primernombre = ? and clientes.apellido = ?', [consulta.primernombre, consulta.apellido])
    return resultado;
}

async function getDatostelmain(consulta) {
    const conn = await getConnection();
    const resultado = await conn.query('select * from clientes inner join mascotas on mascotas.id_cliente = clientes.id_cliente where clientes.primernombre = ? and clientes.apellido = ? and telefono = ?', [consulta.primernombre, consulta.apellido, consulta.telefono])
    return resultado;
}


//select * from venta inner join clientes on clientes.id_cliente = venta.id_cliente where (clientes.primernombre like ? or clientes.nombrepila like ?) and clientes.apellido like ? order by venta.fecha DESC;
async function get20VentasClientemain(busqueda, salto) {

    console.log("salto:", salto);
    console.log("busqueda:", busqueda);

    const conn = await getConnection();

    if (busqueda == "") {
        const resultado = await conn.query(`select * from venta inner join bolsas_kilos on bolsas_kilos.id_bolsa_kilo = venta.id_bolsa_kilo inner join bolsas on bolsas_kilos.id_bolsa = bolsas.id_bolsa inner join clientes on clientes.id_cliente = venta.id_cliente order by venta.fecha DESC LIMIT ?, 20;`, salto);
        return resultado;
    }


    if (busqueda.includes('/')) {
        busqueda = busqueda.split("/");

        if (busqueda.length == 3) {
            const resultado = await conn.query(`select * from venta inner join clientes on clientes.id_cliente = venta.id_cliente inner join bolsas_kilos on bolsas_kilos.id_bolsa_kilo = venta.id_bolsa_kilo inner join bolsas on bolsas.id_bolsa = bolsas_kilos.id_bolsa where (day(venta.fecha) = ? and month(venta.fecha) = ? and year(venta.fecha) = ?) order by venta.fecha DESC LIMIT ?, 20;`, [busqueda[0], busqueda[1], busqueda[2], salto]);
            return resultado;
        }
        if (busqueda.length == 2) {
            const resultado = await conn.query(`select * from venta inner join clientes on clientes.id_cliente = venta.id_cliente inner join bolsas_kilos on bolsas_kilos.id_bolsa_kilo = venta.id_bolsa_kilo inner join bolsas on bolsas.id_bolsa = bolsas_kilos.id_bolsa where (month(venta.fecha) = ? and year(venta.fecha) = ?) order by venta.fecha DESC LIMIT ?, 20;`, [busqueda[0], busqueda[1], salto]);
            return resultado;
        }


    } else {
        let busquedaMod = "%" + busqueda + "%";
        console.log("entroo", busquedaMod);
        const resultado = await conn.query(`select * from venta inner join clientes on clientes.id_cliente = venta.id_cliente inner join bolsas_kilos on bolsas_kilos.id_bolsa_kilo = venta.id_bolsa_kilo inner join bolsas on bolsas.id_bolsa = bolsas_kilos.id_bolsa where venta.precio like ? or venta.totalventa like ? or bolsas.marca_bolsa like ? or bolsas_kilos.kilos_bolsa like ? order by venta.fecha DESC LIMIT ?, 20;`, [busquedaMod, busquedaMod, busquedaMod, busquedaMod, salto]);
        return resultado;
    }



}

async function getMascotasidCliente(idCliente) {
    const conn = await getConnection();
    const resultado = await conn.query('select * from mascotas where id_cliente = ?', idCliente);
    return resultado;
}


async function eliminarMascotaMain(idMascota) {
    const conn = await getConnection();
    await conn.query('delete from mascotas where id_mascota = ?;', idMascota);

}

async function actualizarMascotaMain(newMascota) {

    newMascota.nombremascota = palabraEmpezandoMayuscula(newMascota.nombremascota);
    newMascota.raza = palabraEmpezandoMayuscula(newMascota.raza);
    newMascota.animal = palabraEmpezandoMayuscula(newMascota.animal);

    const conn = await getConnection();
    await conn.query('update mascotas set mascotas.animal = ?, mascotas.raza = ?, mascotas.peso = ?, mascotas.edad = ?, mascotas.actividad = ?, mascotas.afecciones = ?, mascotas.nacimiento = ?, mascotas.nombremascota = ? where mascotas.id_mascota = ?;', [newMascota.animal, newMascota.raza, newMascota.peso, newMascota.edad, newMascota.actividad, newMascota.afecciones, newMascota.nacimiento, newMascota.nombremascota, newMascota.idMascota]);
}

async function agregarMascotaMain(newMascota, idCliente) {

    newMascota.nombremascota = palabraEmpezandoMayuscula(newMascota.nombremascota);
    newMascota.raza = palabraEmpezandoMayuscula(newMascota.raza);
    newMascota.animal = palabraEmpezandoMayuscula(newMascota.animal);


    const conn = await getConnection();
    await conn.query('insert into mascotas (nacimiento, nombremascota, raza, edad, peso, afecciones, animal, actividad, id_cliente) values(?, ?, ?,?, ?, ?, ?, ?, ?);', [newMascota.nacimiento, newMascota.nombremascota, newMascota.raza, newMascota.edad, newMascota.peso, newMascota.afecciones, newMascota.animal, newMascota.actividad, idCliente]);
}

async function actualizarClienteMain(newCliente) {
    newCliente.primernombre = palabraEmpezandoMayuscula(newCliente.primernombre);
    newCliente.nombrepila = palabraEmpezandoMayuscula(newCliente.nombrepila);
    newCliente.apellido = palabraEmpezandoMayuscula(newCliente.apellido);
    newCliente.calle = palabraEmpezandoMayuscula(newCliente.calle);

    const conn = await getConnection();
    await conn.query('update clientes set clientes.primernombre = ?, clientes.nombrepila = ?, clientes.apellido = ?, clientes.telefono = ?, clientes.calle = ?, clientes.calle_numero = ? where clientes.id_cliente = ?;', [newCliente.primernombre, newCliente.nombrepila, newCliente.apellido, newCliente.telefono, newCliente.calle, newCliente.numero, newCliente.idCliente]);
}

async function guardarClienteMain(newCliente) {
    newCliente.primernombre = palabraEmpezandoMayuscula(newCliente.primernombre);
    newCliente.nombrepila = palabraEmpezandoMayuscula(newCliente.nombrepila);
    newCliente.apellido = palabraEmpezandoMayuscula(newCliente.apellido);
    newCliente.calle = palabraEmpezandoMayuscula(newCliente.calle);

    const conn = await getConnection();
    await conn.query('insert into clientes(primernombre, nombrepila, apellido, telefono, calle, calle_numero) values(?, ?, ?, ?, ?, ?)', [newCliente.primernombre, newCliente.nombrepila, newCliente.apellido, newCliente.telefono, newCliente.calle, newCliente.numero]);
}

async function eliminarClienteMain(idCliente) {
    const conn = await getConnection();
    let mascotas = await conn.query('select id_mascota from mascotas where id_cliente = ?;', idCliente);
    for (let index = 0; index < mascotas.length; index++) {
        const element = mascotas[index];
        await conn.query('delete from venta_mascota where id_mascota = ?;', element.id_mascota);
    }
    await conn.query('delete from mascotas where id_cliente = ?;', idCliente);
    await conn.query('delete from venta where id_cliente = ?;', idCliente);
    await conn.query('delete from clientes where id_cliente = ?;', idCliente);
}


async function getUltimoClienteRegistrado() {
    const conn = await getConnection();
    const resultado = await conn.query('select * from clientes order by id_cliente DESC LIMIT 1;');
    return resultado;
}


async function restarPuntosClienteById(idCliente, puntosParaRestar, puntosActuales) {
    const conn = await getConnection();
    await conn.query('update clientes set puntos = (? - ?) where id_cliente = ?', [puntosActuales, puntosParaRestar, idCliente]);
    return (parseInt(puntosActuales) - parseInt(puntosParaRestar));
}

async function sumarPuntosClienteById(idCliente, puntosParaSumar, puntosActuales) {
    const conn = await getConnection();
    await conn.query('update clientes set puntos = (? + ?) where id_cliente = ?', [puntosActuales, puntosParaSumar, idCliente]);
    return (parseInt(puntosActuales) + parseInt(puntosParaSumar));
}


async function getBolsasMain() {
    const conn = await getConnection();
    let resultado = await conn.query('select marca_bolsa from bolsas');
    resultado = transformarArrayDeRowDataPacketAStrings(resultado);
    return resultado;
}

async function getVentasActivasMascotaClienteById(idCliente) {
    const conn = await getConnection();
    let ventasActivas = await conn.query('select * from venta join bolsas_kilos on bolsas_kilos.id_bolsa_kilo = venta.id_bolsa_kilo inner join bolsas on bolsas.id_bolsa = bolsas_kilos.id_bolsa where venta.id_cliente = ? and venta.activo = true', idCliente);

    for (let i = 0; i < ventasActivas.length; i++) {
        const ventaActiva = ventasActivas[i];
        let mascotasVentaActiva = await conn.query('select * from venta_mascota inner join mascotas on mascotas.id_mascota = venta_mascota.id_mascota where venta_mascota.id_venta = ?', ventaActiva.id_venta);
        ventaActiva.mascotas = mascotasVentaActiva;
    }

    return ventasActivas;
}


async function getKgBolsaMain(nombreBolsa) {
    console.log(nombreBolsa);
    const conn = await getConnection();
    let resultado = await conn.query('select bolsas_kilos.id_bolsa_kilo, bolsas_kilos.kilos_bolsa from bolsas_kilos inner join bolsas on bolsas.id_bolsa = bolsas_kilos.id_bolsa where bolsas.marca_bolsa = ? order by bolsas_kilos.kilos_bolsa ASC', nombreBolsa);
    return resultado;
}

async function getBolsaByIdMain(idBolsa) {
    const conn = await getConnection();
    let resultado = await conn.query('select kilos_bolsa from bolsas_kilos inner join bolsas on bolsas.id_bolsa = bolsas_kilos.id_bolsa where bolsas.id_bolsa = ? order by bolsas_kilos.kilos_bolsa ASC', idBolsa);

    resultado = transformKilosBolsaToFloats(resultado);

    return resultado;
}

async function getSoloBolsaByIdMain(idBolsa) {
    const conn = await getConnection();
    let resultado = await conn.query('select * from bolsas where bolsas.id_bolsa = ?', idBolsa);
    return resultado;
}

async function agregarBolsaKilosMain(newBolsaKilos) {
    const conn = await getConnection();
    await conn.query('insert into bolsas_kilos(kilos_bolsa, id_bolsa) values(?, ?)', [newBolsaKilos.kilos_bolsa, newBolsaKilos.id_bolsa]);
}


async function borrarBolsaKilosByIdMain(id_bolsa_kilo) {
    const conn = await getConnection();
    await conn.query('delete from bolsas_kilos where id_bolsa_kilo = ?', id_bolsa_kilo);
}


async function get18BolsasSegunBusquedaMain(newBusqueda, salto) {
    const conn = await getConnection();

    console.log("salto: ", salto);
    if (newBusqueda === "" || newBusqueda == undefined) {
        let resultado = await conn.query('select * from bolsas LIMIT ?, 18;', salto);
        return resultado;
    }


    let newBusqueda1 = newBusqueda + "%";
    let newBusqueda2 = "%" + newBusqueda + "%"
    console.log("newBusqueda: ", newBusqueda);
    let resultado = await conn.query('select * from bolsas where bolsas.marca_bolsa like ? or bolsas.calidad_bolsa like ? LIMIT ?, 18;', [newBusqueda2, newBusqueda1, salto]);
    return resultado;






}


async function getKilosBolsaPorId(id_bolsa) {
    const conn = await getConnection();
    let resultado = await conn.query('select * from bolsas_kilos where id_bolsa = ?', id_bolsa);
    return resultado;
}



async function actualizarDatosBolsaMain(newBolsa, bolsaKilos) {
    const conn = await getConnection();

    let bolsasConMismoNombre = await conn.query('select marca_bolsa from bolsas where marca_bolsa = ?', newBolsa.marca_bolsa);

    if (bolsasConMismoNombre.length == 0) {

        newBolsa.marca_bolsa = (newBolsa.marca_bolsa).toUpperCase();

        await conn.query('UPDATE bolsas SET calidad_bolsa = ?, marca_bolsa = ? WHERE id_bolsa = ?;', [newBolsa.calidad_bolsa, newBolsa.marca_bolsa, newBolsa.id_bolsa]);

        await conn.query('delete from bolsas_kilos where bolsas_kilos.id_bolsa = ?', newBolsa.id_bolsa);

        for (let i = 0; i < bolsaKilos.length; i++) {
            const element = bolsaKilos[i];
            console.log("main:", element);

            await conn.query('insert into bolsas_kilos(kilos_bolsa, id_bolsa) values(?, ?)', [element, newBolsa.id_bolsa]);

        }
        return
    } else {
        return "bolsaRepetida";
    }
}




async function borrarBolsaByIdMain(id_bolsa) {
    const conn = await getConnection();

    await conn.query('delete from bolsas_kilos where bolsas_kilos.id_bolsa = ?', id_bolsa);
    await conn.query('delete from bolsas where bolsas.id_bolsa = ?', id_bolsa);

}


async function crearNuevaBolsaMain(newBolsa, newBolsaKilos) {
    const conn = await getConnection();
    newBolsa.marca_bolsa = (newBolsa.marca_bolsa).toUpperCase();

    let bolsasConMismoNombre = await conn.query('select marca_bolsa from bolsas where marca_bolsa = ?', newBolsa.marca_bolsa);

    if (bolsasConMismoNombre.length == 0) {
        await conn.query('insert into bolsas(marca_bolsa, calidad_bolsa) values(?, ?); ', [newBolsa.marca_bolsa, newBolsa.calidad_bolsa]);

        newBolsa = await conn.query('select * from bolsas where marca_bolsa = ?', newBolsa.marca_bolsa);

        for (let i = 0; i < newBolsaKilos.length; i++) {
            const element = newBolsaKilos[i];
            console.log("main:", element);

            await conn.query('insert into bolsas_kilos(kilos_bolsa, id_bolsa) values(?, ?)', [element, newBolsa[0].id_bolsa]);

        }
    } else {
        return "bolsaRepetida";
    }


}



async function get20VentasPorBolsaSegunFiltros(filtro, filtro2) {
    const conn = await getConnection();

    console.log(filtro, filtro2);

    if (filtro == "anio") {
        anio = new Date();
        anio = anio.getFullYear();
        const resultado = await conn.query('select bolsas.marca_bolsa, count(venta.id_venta) as cantventas from venta inner join bolsas_kilos on bolsas_kilos.id_bolsa_kilo = venta.id_bolsa_kilo inner join bolsas on bolsas.id_bolsa = bolsas_kilos.id_bolsa  where year(venta.fecha) = ? group by bolsas.marca_bolsa order by cantventas DESC', anio);
        return resultado;
    } else if (filtro == "total") {
        const resultado = await conn.query('select bolsas.marca_bolsa, count(venta.id_venta) as cantventas from venta inner join bolsas_kilos on bolsas_kilos.id_bolsa_kilo = venta.id_bolsa_kilo inner join bolsas on bolsas.id_bolsa = bolsas_kilos.id_bolsa group by bolsas.marca_bolsa order by cantventas DESC');
        return resultado;
    } else if (filtro == "elegir" && filtro2 != "") {
        anio = filtro2[0] + filtro2[1] + filtro2[2] + filtro2[3];
        mes = filtro2[5] + filtro2[6];
        console.log("anio:", anio, "Mes:", mes);
        const resultado = await conn.query('select bolsas.marca_bolsa, count(venta.id_venta) as cantventas from venta inner join bolsas_kilos on bolsas_kilos.id_bolsa_kilo = venta.id_bolsa_kilo inner join bolsas on bolsas.id_bolsa = bolsas_kilos.id_bolsa where YEAR(venta.fecha) = ? and MONTH(venta.fecha) = ? group by bolsas.marca_bolsa order by cantventas DESC', [anio, mes]);
        console.log("resultado:", resultado);
        return resultado;
    } else if (filtro == "anioatras") {
        let fechaActual = new Date();
        let aniomenos = fechaActual.getFullYear() - 1;
        let mes = fechaActual.getMonth() + 1;
        console.log("mes que queremos ver:", mes);
        let dia = fechaActual.getDate();
        const resultado = await conn.query('select bolsas.marca_bolsa, count(venta.id_venta) as cantventas from venta inner join bolsas_kilos on bolsas_kilos.id_bolsa_kilo = venta.id_bolsa_kilo inner join bolsas on bolsas.id_bolsa = bolsas_kilos.id_bolsa where venta.fecha >= "?-?-?" group by bolsas.marca_bolsa order by cantventas DESC', [aniomenos, mes, dia]);
        console.log("resultado:", resultado);
        return resultado;
    }
}




function transformKilosBolsaToFloats(rowData) {
    console.log("aaa", rowData);
    // Creamos un nuevo array donde guardaremos los datos convertidos a float
    const floatsArray = [];

    // Recorremos cada objeto del array de row data
    for (let i = 0; i < rowData.length; i++) {
        // Obtenemos el valor del único atributo del objeto y lo convertimos a float
        const floatValue = parseFloat(rowData[i].kilos_bolsa);

        // Agregamos el valor al array de floats
        floatsArray.push(floatValue);
    }

    // Devolvemos el array de floats
    console.log("aaaaa", floatsArray);
    return floatsArray;
}





function transformarArrayDeRowDataPacketAStrings(arr) {
    let arrStrings = [];
    for (let i = 0; i < arr.length; i++) {
        arrStrings.push(arr[i].marca_bolsa);
    }
    return arrStrings;
}


let window;
let windowEditarCliente;
let windowAgregarCliente;
let windowEditarBolsa;
let windowAgregarBolsa;
let windowVentasBolsas;



function recargarPaginaPrincipal() {
    window.reload();
}

function createWindow() {
    window = new BrowserWindow({
        width: 1100,
        height: 820,
        autoHideMenuBar: false,
        icon: __dirname + './imagenes/favicon.png',
        webPreferences: {
            nodeIntegration: true
        }
    })
    window.loadFile('src/views/historial/historial.html'); //indica el archivo que se cargara en la ventana
}

function createWindowEditarCliente() {


    cerrarVentanasEmergentes();
    windows = BrowserWindow.getAllWindows();
    console.log(`Hay ${windows.length} ventanas abiertas.`);
    console.log(windows[0].BrowserWindow);
    mainDocument = windows[0].webContents;

    console.log(mainDocument);

    // Establecer la propiedad opacity del body de la ventana principal
    mainDocument.executeJavaScript(`document.body.style.opacity = ${0.1};`);
    mainDocument.executeJavaScript(`document.body.style.pointerEvents = 'none';`);

    windowEditarCliente = new BrowserWindow({
        width: 900,
        height: 570,
        alwaysOnTop: true,
        frame: true,
        resizable: false,
        icon: __dirname + './imagenes/favicon.png',
        webPreferences: {
            nodeIntegration: true
        }
    })
    windowEditarCliente.loadFile('src/views/editarCliente/editarCliente.html'); //indica el archivo que se cargara en la ventana
}


function createWindowAgregarCliente() {

    cerrarVentanasEmergentes();
    windows = BrowserWindow.getAllWindows();
    console.log(`Hay ${windows.length} ventanas abiertas.`);
    console.log(windows[0].BrowserWindow);
    mainDocument = windows[0].webContents;

    console.log(mainDocument);

    // Establecer la propiedad opacity del body de la ventana principal
    mainDocument.executeJavaScript(`document.body.style.opacity = ${0.1};`);
    mainDocument.executeJavaScript(`document.body.style.pointerEvents = 'none';`);


    windowAgregarCliente = new BrowserWindow({
        width: 900,
        height: 570,
        alwaysOnTop: true,
        frame: false,
        resizable: false,
        icon: __dirname + './imagenes/favicon.png',
        webPreferences: {
            nodeIntegration: true
        }
    })
    windowAgregarCliente.loadFile('src/ui/agregarCliente/agregarCliente.html'); //indica el archivo que se cargara en la ventana
}
let windows;
let mainDocument;
function createWindowEditarBolsa() {

    cerrarVentanasEmergentes();
    windows = BrowserWindow.getAllWindows();
    console.log(`Hay ${windows.length} ventanas abiertas.`);
    console.log(windows[0].BrowserWindow);
    mainDocument = windows[0].webContents;

    console.log(mainDocument);

    // Establecer la propiedad opacity del body de la ventana principal
    mainDocument.executeJavaScript(`document.body.style.opacity = ${0.1};`);
    mainDocument.executeJavaScript(`document.body.style.pointerEvents = 'none';`);

    windowEditarBolsa = new BrowserWindow({
        width: 550,
        height: 450,
        alwaysOnTop: true,
        frame: true,
        resizable: false,
        icon: __dirname + './imagenes/favicon.png',
        webPreferences: {
            nodeIntegration: true
        }
    })
    windowEditarBolsa.loadFile('src/views/editarBolsa/editarBolsa.html'); //indica el archivo que se cargara en la ventana
}


function createWindowAgregarBolsa() {

    cerrarVentanasEmergentes();
    windows = BrowserWindow.getAllWindows();
    console.log(`Hay ${windows.length} ventanas abiertas.`);
    console.log(windows[0].BrowserWindow);
    mainDocument = windows[0].webContents;

    console.log(mainDocument);

    // Establecer la propiedad opacity del body de la ventana principal
    mainDocument.executeJavaScript(`document.body.style.opacity = ${0.1};`);
    mainDocument.executeJavaScript(`document.body.style.pointerEvents = 'none';`);

    windowAgregarBolsa = new BrowserWindow({
        width: 550,
        height: 450,
        alwaysOnTop: true,
        frame: true,
        resizable: false,
        icon: __dirname + './imagenes/favicon.png',
        webPreferences: {
            nodeIntegration: true
        }
    })
    windowAgregarBolsa.loadFile('src/views/agregarBolsa/agregarBolsa.html'); //indica el archivo que se cargara en la ventana
}

function createWindowVentasBolsas() {

    cerrarVentanasEmergentes();
    windows = BrowserWindow.getAllWindows();
    console.log(`Hay ${windows.length} ventanas abiertas.`);
    console.log(windows[0].BrowserWindow);
    mainDocument = windows[0].webContents;

    console.log(mainDocument);

    // Establecer la propiedad opacity del body de la ventana principal
    mainDocument.executeJavaScript(`document.body.style.opacity = ${0.1};`);
    mainDocument.executeJavaScript(`document.body.style.pointerEvents = 'none';`);

    windowVentasBolsas = new BrowserWindow({
        width: 900,
        height: 650,
        alwaysOnTop: true,
        frame: true,
        resizable: false,
        icon: __dirname + './imagenes/favicon.png',
        webPreferences: {
            nodeIntegration: true
        }
    })
    windowVentasBolsas.loadFile('src/ui/ventasBolsas/ventasBolsas.html'); //indica el archivo que se cargara en la ventana
}


function cerrarVentanasEmergentes() {

    try {
        mainDocument.executeJavaScript(`document.body.style.opacity = ${1.00};`);
        mainDocument.executeJavaScript(`document.body.style.pointerEvents = 'auto';`);
    } catch (error) {
        //no hace nada
    }


    if (windowAgregarCliente != undefined) {
        try {
            windowAgregarCliente.close();
        } catch (e) {
            //no hace nada
        }
    }
    if (windowEditarCliente != undefined) {
        try {
            windowEditarCliente.close();
        } catch (e) {
            //no hace nada
        }
    }
    if (windowEditarBolsa != undefined) {
        try {
            windowEditarBolsa.close();
        } catch (e) {
            //no hace nada
        }
    }
    if (windowAgregarBolsa != undefined) {
        try {
            windowAgregarBolsa.close();
        } catch (e) {
            //no hace nada
        }
    }
    if (windowVentasBolsas != undefined) {
        try {
            windowVentasBolsas.close();
        } catch (e) {
            //no hace nada
        }
    }
}



function palabraEmpezandoMayuscula(oracion) {
    function capitalizar(palabra) {
        return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase();
    }

    let palabras = oracion.split(" ");
    let palabrasCapitalizadas = [];

    for (let i = 0; i < palabras.length; i++) {
        let palabra = palabras[i];
        let palabraCapitalizada = capitalizar(palabra);
        palabrasCapitalizadas.push(palabraCapitalizada);
    }

    let nuevaOracion = palabrasCapitalizadas.join(" ");

    return nuevaOracion;
}


function restarDias(fecha, dias) {
    // Convertir la fecha a milisegundos y restar los días especificados en milisegundos
    const resultado = fecha.getTime() - (dias * 24 * 60 * 60 * 1000);

    // Crear un nuevo objeto Date con el resultado y devolverlo
    return new Date(resultado);
}

//exporta la funcion para poder ser usada en otro lado
module.exports = {
    createWindow,
    insertCliente,
    getCLientemain,
    get20VentasClientemain,
    getDatosmain,
    getVentaspornombremain,
    getDatostelmain,
    notificacion,
    getMascotaidmain,
    insertVentamain,
    getClientetelmain,
    notificacionMascotas,
    notificacionExito,
    getVentasActivasmain,
    get20ClientesTodos,
    getClientefullnamemain,
    getsoloClientefullnamemain,
    notificacionNoCliente,
    notificacionNoVenta,
    get10mejoresclientesbolsas,
    get10mejoresclientespuntos,
    gettotalbolsas,
    gettotalpuntos,
    getmesmaspuntos,
    getMascotasidCliente,
    createWindowEditarCliente,
    eliminarMascotaMain,
    actualizarMascotaMain,
    agregarMascotaMain,
    actualizarClienteMain,
    eliminarClienteMain,
    getVentaspornombreTelmain,
    createWindowAgregarCliente,
    guardarClienteMain,
    getUltimoClienteRegistrado,
    cerrarVentanasEmergentes,
    recargarPaginaPrincipal,
    buscar20ClientesMain,
    borrar_venta_main,
    getBolsasMain,
    getKgBolsaMain,
    get18BolsasSegunBusquedaMain,
    getKilosBolsaPorId,
    createWindowEditarBolsa,
    getBolsaByIdMain,
    actualizarDatosBolsaMain,
    agregarBolsaKilosMain,
    borrarBolsaKilosByIdMain,
    getSoloBolsaByIdMain,
    borrarBolsaByIdMain,
    createWindowAgregarBolsa,
    crearNuevaBolsaMain,
    restarPuntosClientePorBorradoDeVenta,
    restarPuntosClienteById,
    sumarPuntosClienteById,
    getVentasActivasMascotaClienteById,
    get20VentasPorBolsaSegunFiltros,
    createWindowVentasBolsas,
}