const { remote, app } = require('electron');
const { get10mejoresclientesbolsas, get10mejoresclientesimporte, gettotalbolsas, gettotalganacias, getmesmasganancias } = require('../../main');
const main = remote.require('./main')

let algo = "";
//////////////////////////////////////////////////////////////////mejores 10 por cantidad de bolsas
select1 = document.getElementById("selecttiempobolsasimporte");
divForm1 = document.getElementById("divForm1");



select1.addEventListener('change', (e) => {
    e.preventDefault();

    if (select1.value != "elegir") {
        divForm1.innerHTML = "";
        get10mejoresclientesbolsasapp(select1.value);
        get10mejoresclientesimporteapp(select1.value);
    }else{
        divForm1.innerHTML = `            <form id="form1">
        <input type="month" class="inputmonth" id="inputmonth1">
        <button type="submit"><img src="../../imagenes/lupanegra.png" width="10px"></button>
    </form>`

    form1 = document.getElementById("form1");
    form1.addEventListener('submit', (e) => {
        e.preventDefault();
        select1 = document.getElementById("selecttiempobolsasimporte");
        input1 = document.getElementById("inputmonth1");
    
        get10mejoresclientesbolsasapp(select1.value, input1.value);
        get10mejoresclientesimporteapp(select1.value, input1.value);
    });


    }

});
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////total bolsas vendidas
select3 = document.getElementById("selecttiempototalbolsasganancias");
divForm2 = document.getElementById("divForm2");


select3.addEventListener('change', (e) => {
    e.preventDefault();

    if (select3.value != "elegir") {
        divForm2.innerHTML = "";
        gettotalbolsasapp(select3.value);
        gettotalgananciasapp(select3.value);
    }else{
        divForm2.innerHTML = `<form id="form3">
        <input type="month" class="inputmonth" id="inputmonth3">
        <button type="submit"><img src="../../imagenes/lupanegra.png" width="10px"></button>
        </form>` 

        form3 = document.getElementById("form3");
        form3.addEventListener('submit', (e) => {
            e.preventDefault();
            select3 = document.getElementById("selecttiempototalbolsasganancias");
            input3 = document.getElementById("inputmonth3");
        
            gettotalbolsasapp(select3.value, input3.value);
            gettotalgananciasapp(select3.value, input3.value);
        });

    }

});
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

get10mejoresclientesbolsasapp(select1.value, algo);
get10mejoresclientesimporteapp(select1.value, algo);
gettotalbolsasapp(select3.value, algo);
gettotalgananciasapp(select3.value, algo)
getmesmasgananciasapp();

async function get10mejoresclientesbolsasapp(filtro, filtro2) {

    let clientes = await get10mejoresclientesbolsas(filtro, filtro2);

    inner10mejoresporbolsas(clientes);

}

async function get10mejoresclientesimporteapp(filtro, filtro2) {

    let clientes = await get10mejoresclientesimporte(filtro, filtro2);

    inner10mejoresporimporte(clientes);

}

async function gettotalbolsasapp(filtro, filtro2) {

    let total = await gettotalbolsas(filtro, filtro2);

    innertotalbolsas(total);

}

async function gettotalgananciasapp(filtro, filtro2) {

    let total = await gettotalganacias(filtro, filtro2);

    innertotalganancias(total);

}

async function getmesmasgananciasapp() {

    let mes = await getmesmasganancias();

    innermesmasganancias(mes);

}


function inner10mejoresporbolsas(clientes) {
    ol = document.getElementById("ol10mejoresporbolsas");

    ol.innerHTML = ""


    clientes.forEach(element => {
        ol.innerHTML += `<li>${element.primernombre} ${element.nombrepila} ${element.apellido} (${element.totalbolsas})</li>`
    });



}

function inner10mejoresporimporte(clientes) {
    ol = document.getElementById("ol10mejoresporimporte");

    ol.innerHTML = ""


    clientes.forEach(element => {
        ol.innerHTML += `<li>${element.primernombre} ${element.nombrepila} ${element.apellido} ($${element.totalventa})</li>`
    });



}


function innertotalbolsas(total) {
    h2 = document.getElementById("h2totalbolsas");
    console.log(total);
    h2.innerHTML = ""
    h2.innerHTML += total[0].totalbolsas;
}

function innertotalganancias(total) {
    h2 = document.getElementById("h2totalganancias");
    console.log(total);
    h2.innerHTML = ""
    h2.innerHTML += "$" + total[0].totalganancias;
}

function innermesmasganancias(mes) {
    h2 = document.getElementById("h2mes");
    mes = mes[0].mes;
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