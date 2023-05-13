// const { remote } = require('electron');
// const main = remote.require('./main');
const estadisticas_controller = require('../../controllers/estadisticas_controller');

//////////////////////////////////////////////////////////////////mejores 10 por cantidad de bolsas
select1 = document.getElementById("selecttiempobolsaspuntos");
divForm1 = document.getElementById("divForm1");



select1.addEventListener('change', (e) => {
    e.preventDefault();

    if (select1.value != "elegir") {
        divForm1.innerHTML = "";
        get10mejoresclientesbolsasapp(select1.value);
        get10mejoresclientespuntosapp(select1.value);
    }else{
        divForm1.innerHTML = `            <form id="form1">
        <input type="month" class="inputmonth" id="inputmonth1">
        <button type="submit"><img src="../../imagenes/lupanegra.png" width="10px"></button>
    </form>`

    form1 = document.getElementById("form1");
    form1.addEventListener('submit', (e) => {
        e.preventDefault();
        select1 = document.getElementById("selecttiempobolsaspuntos");
        input1 = document.getElementById("inputmonth1");
    
        get10mejoresclientesbolsasapp(select1.value, input1.value);
        get10mejoresclientespuntosapp(select1.value, input1.value);
    });


    }

});
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////total bolsas vendidas
select3 = document.getElementById("selecttiempototalbolsaspuntos");
divForm2 = document.getElementById("divForm2");


select3.addEventListener('change', (e) => {
    e.preventDefault();

    if (select3.value != "elegir") {
        divForm2.innerHTML = "";
        gettotalbolsasapp(select3.value);
        gettotalpuntosapp(select3.value);
    }else{
        divForm2.innerHTML = `<form id="form3">
        <input type="month" class="inputmonth" id="inputmonth3">
        <button type="submit"><img src="../../imagenes/lupanegra.png" width="10px"></button>
        </form>` 

        form3 = document.getElementById("form3");
        form3.addEventListener('submit', (e) => {
            e.preventDefault();
            select3 = document.getElementById("selecttiempototalbolsaspuntos");
            input3 = document.getElementById("inputmonth3");
        
            gettotalbolsasapp(select3.value, input3.value);
            gettotalpuntosapp(select3.value, input3.value);
        });

    }

});
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

get10mejoresclientesbolsasapp(select1.value);
get10mejoresclientespuntosapp(select1.value);
gettotalbolsasapp(select3.value);
gettotalpuntosapp(select3.value);
getmesmaspuntosapp();
listenerBotonVentasBolsas();

async function get10mejoresclientesbolsasapp(filtro, filtro2) {

    let clientesConTotal = await estadisticas_controller.get10MejoresClientesPorCantidadBolsas(filtro, filtro2);

    inner10mejoresporbolsas(clientesConTotal);

}

async function get10mejoresclientespuntosapp(filtro, filtro2) {

    let clientesConTotal = await estadisticas_controller.get10MejoresClientesPorCantidadPuntos(filtro, filtro2);

    inner10mejoresporpuntos(clientesConTotal);

}

async function gettotalbolsasapp(filtro, filtro2) {

    let total = await estadisticas_controller.getTotalBolsas(filtro, filtro2);

    innertotalbolsas(total);

}

async function gettotalpuntosapp(filtro, filtro2) {

    let total = await estadisticas_controller.getTotalPuntos(filtro, filtro2);

    innertotalpuntos(total);

}

async function getmesmaspuntosapp() {

    let mes = await estadisticas_controller.getMesMasPuntos();

    innermesmaspuntos(mes);

}


function inner10mejoresporbolsas(clientesConTotal) {
    ol = document.getElementById("ol10mejoresporbolsas");

    ol.innerHTML = ""


    clientesConTotal.forEach(element => {
        ol.innerHTML += `<li>${element.primernombre} ${element.nombrepila} ${element.apellido} (${element.totalbolsas})</li>`
    });



}

function inner10mejoresporpuntos(clientesConTotal) {
    ol = document.getElementById("ol10mejoresporpuntos");

    ol.innerHTML = ""


    clientesConTotal.forEach(element => {
        ol.innerHTML += `<li>${element.primernombre} ${element.nombrepila} ${element.apellido} (${element.puntos_obtenidos_total})</li>`
    });



}


function innertotalbolsas(total) {
    let h2 = document.getElementById("h2totalbolsas");
    console.log(total);
    h2.innerHTML = ""
    h2.innerHTML += total.totalbolsas;
}

function innertotalpuntos(total) {
    let h2 = document.getElementById("h2totalpuntos");
    console.log(total);
    h2.innerHTML = ""
    h2.innerHTML += total.puntos_obtenidos_total;
}

function innermesmaspuntos(mes) {
    let h2 = document.getElementById("h2mes");
    h2.innerHTML = "";
    console.log("mes:", mes)
    switch (mes) {
        case 1:
            h2.innerHTML += "Enero";
            break;
        case 2:
            h2.innerHTML += "Febrero";
            break;
        case 3:
            h2.innerHTML += "Marzo";
            break;
        case 4:
            h2.innerHTML += "Abril";
            break;
        case 5:
            h2.innerHTML += "Mayo";
            break;
        case 6:
            h2.innerHTML += "Junio";
            break;
        case 7:
            h2.innerHTML += "Julio";
            break;
        case 8:
            h2.innerHTML += "Agosto";
            break;
        case 9:
            h2.innerHTML += "Septiembre";
            break;
        case 10:
            h2.innerHTML += "Octubre";
            break;
        case 11:
            h2.innerHTML += "Noviembre";
            break;
        case 12:
            h2.innerHTML += "Diciembre";
            break;

        default:
            break;
    }

}


function listenerBotonVentasBolsas() {
    botonVentasBolsas = document.getElementById("btn-ventasBolsas");

    botonVentasBolsas.addEventListener('click', (e) => {
        e.preventDefault();
        btnVentasBolsas();
    });
}




async function btnVentasBolsas() {
    main.createWindowVentasBolsas();
}