const { getConnection } = require('../database');

async function get10mejoresclientesbolsas(filtro, filtro2) {
    const conn = await getConnection();

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
        const resultado = await conn.query('select clientes.*, sum(venta.puntos_obtenidos) as puntos_obtenidos_total from clientes inner join venta on venta.id_cliente = clientes.id_cliente where YEAR(venta.fecha) = ? group by clientes.id_cliente order by puntos_obtenidos_total DESC LIMIT 10;', anio);
        return resultado;
    } else if (filtro == "total") {
        const resultado = await conn.query('select clientes.*, sum(venta.puntos_obtenidos) as puntos_obtenidos_total from clientes inner join venta on venta.id_cliente = clientes.id_cliente group by clientes.id_cliente order by puntos_obtenidos_total DESC LIMIT 10;');
        return resultado;
    } else if (filtro == "elegir" && filtro2 != "") {
        anio = filtro2[0] + filtro2[1] + filtro2[2] + filtro2[3];
        mes = filtro2[5] + filtro2[6];
        console.log("anio:", anio, "Mes:", mes);
        const resultado = await conn.query('select clientes.*, sum(venta.puntos_obtenidos) as puntos_obtenidos_total from clientes inner join venta on venta.id_cliente = clientes.id_cliente where YEAR(venta.fecha) = ? and MONTH(venta.fecha) = ? group by clientes.id_cliente order by puntos_obtenidos_total DESC LIMIT 10;', [anio, mes]);
        console.log("resultado:", resultado);
        return resultado;
    } else if (filtro == "anioatras") {
        let fechaActual = new Date();
        let aniomenos = fechaActual.getFullYear() - 1;
        let mes = fechaActual.getMonth() + 1;
        console.log("mes que queremos ver:", mes);
        let dia = fechaActual.getDate();
        const resultado = await conn.query('select clientes.*, sum(venta.puntos_obtenidos) as puntos_obtenidos_total from clientes inner join venta on venta.id_cliente = clientes.id_cliente where venta.fecha >= "?-?-?" group by clientes.id_cliente order by puntos_obtenidos_total DESC LIMIT 10;', [aniomenos, mes, dia]);
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


async function getVentasPorBolsaSegunFiltros(filtro, filtro2) {
    const conn = await getConnection();

    console.log(filtro, filtro2);

    if (filtro == "anio") {
        anio = new Date();
        anio = anio.getFullYear();
        const resultado = await conn.query('select marca_bolsa, sum(cantidad) as cantventas from venta where year(fecha) = ? group by marca_bolsa order by cantventas DESC', anio);
        return resultado;
    } else if (filtro == "total") {
        const resultado = await conn.query('select marca_bolsa, sum(cantidad) as cantventas from venta group by marca_bolsa order by cantventas DESC');
        return resultado;
    } else if (filtro == "elegir" && filtro2 != "") {
        anio = filtro2[0] + filtro2[1] + filtro2[2] + filtro2[3];
        mes = filtro2[5] + filtro2[6];
        console.log("anio:", anio, "Mes:", mes);
        const resultado = await conn.query('select marca_bolsa, sum(cantidad) as cantventas from venta where YEAR(venta.fecha) = ? and MONTH(venta.fecha) = ? group by marca_bolsa order by cantventas DESC', [anio, mes]);
        console.log("resultado:", resultado);
        return resultado;
    } else if (filtro == "anioatras") {
        let fechaActual = new Date();
        let aniomenos = fechaActual.getFullYear() - 1;
        let mes = fechaActual.getMonth() + 1;
        console.log("mes que queremos ver:", mes);
        let dia = fechaActual.getDate();
        const resultado = await conn.query('select marca_bolsa, sum(cantidad) as cantventas from venta where venta.fecha >= "?-?-?" group by marca_bolsa order by cantventas DESC', [aniomenos, mes, dia]);
        console.log("resultado:", resultado);
        return resultado;
    }
}



module.exports = {
    get10mejoresclientesbolsas,
    get10mejoresclientespuntos,
    getmesmaspuntos,
    gettotalbolsas,
    gettotalpuntos,
    getVentasPorBolsaSegunFiltros
}