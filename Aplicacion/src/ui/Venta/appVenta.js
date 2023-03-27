const { remote, app } = require('electron');
const { getCLientemain, notificacionExito, getKgBolsaMain, getBolsasMain, getVentaspornombreTelmain, notificacionMascotas, getClientetelmain, insertVentamain, getVentasClientemain, getDatosmain, getVentaspornombremain, getDatostelmain, notificacion, getMascotaidmain } = require('../../main');
const main = remote.require('./main');

let consultaCliente = {
    primernombre: "",
    apellido: ""
}

let consultaClientetel = {
    primernombre: "",
    apellido: "",
    telefono: ""
}

let datosCliente
let datosClientetel
let select

const getDatosapp = async () => {
    let historialVentas;
    datosCliente = await main.getDatosmain(consultaCliente);
    cliente = await main.getCLientemain(consultaCliente);
    divMensaje = document.getElementById("mensaje");



    if (datosCliente == "") {
        divMensaje.innerHTML = "";
        divMensaje.innerHTML += `<p>Cliente no registrado</p>`
    } else {
        datosClientetel = await main.getDatostelmain(consultaClientetel);
        if (telefonoform != "") {
            if (datosClientetel == "") {
                divMensaje.innerHTML = "";
                divMensaje.innerHTML += `<p>Cliente no registrado</p>`
            } else {

                historialVentas = await main.getVentaspornombreTelmain(consultaCliente, telefono.value);
                await innerClientetel();

                select = document.getElementById("select-mascota");
                select.addEventListener('change', () => {
                    mostrarDatos()
                });


                formVenta = document.getElementById("form-venta")


                formVenta.addEventListener('submit', (e) => {
                    e.preventDefault();

                    venta();

                })




                if (historialVentas != "") {
                    var divHistorial = document.getElementById("historial");

                    historialVentas.forEach(element => {
                        divHistorial.innerHTML += `<div><p> ${element.marca_bolsa} ${element.kilos_bolsa}kg (${element.calidad_bolsa})</p></div>`
                    });

                }





            }
        } else {

            var contador = 0;
            cliente.forEach(elemento => {
                contador = contador + 1
            });

            if (contador > 1) {
                agregarInputtel();
            } else {
                ////////////////////////////ORIGINAL/////////////////////////////////////////////////////////////////////////////////////////////
                historialVentas = await main.getVentaspornombremain(consultaCliente);
                await innerCliente();

                select = document.getElementById("select-mascota");
                mostrarDatos()

                select.addEventListener('change', () => {
                    mostrarDatos()
                });

                formVenta = document.getElementById("form-venta")
                formVenta.addEventListener('submit', (e) => {
                    e.preventDefault();

                    venta();

                })

                if (historialVentas != "") {
                    var divHistorial = document.getElementById("historial");

                    historialVentas.forEach(element => {
                        divHistorial.innerHTML += `<div><p>${element.marca_bolsa} ${element.kilos_bolsa}kg (${element.calidad_bolsa})</p></div>`
                    });

                }



            }





        }





    }

}


const formCliente = document.getElementById("form-ingreso");

let telefonoform = "";

formCliente.addEventListener('submit', (e) => {
    e.preventDefault();



    telefonoform = "";


    try {
        telefonoform = telefono.value;

        consultaClientetel = {
            primernombre: primer_nombre.value,
            apellido: apellido.value,
            telefono: telefono.value
        }


        getDatosapp();

    } catch (error) {


        consultaCliente = {
            primernombre: primer_nombre.value,
            apellido: apellido.value
        }


        getDatosapp();
    }






})

formCliente.addEventListener('reset', (e) => {
    e.preventDefault();


    mascota = document.getElementById("mascota");
    agregado = document.getElementById("agregado");
    primer_nombre = document.getElementById("primer_nombre");
    apellido = document.getElementById("apellido");


    mascota.innerHTML = "";
    agregado.innerHTML = "";
    primer_nombre.value = "";
    apellido.value = "";

    try {
        x = telefono.value
        location.reload();
    } catch { }

})

var dia = new Date();
var mes = new Date();
var anio = new Date();



async function mostrarDatos() {
    console.log("entro a mostrar datos");


    select = document.getElementById("select-mascota");

    id = select.value;

    console.log("valor select dentro de ");
    console.log(id);

    mascota = await main.getMascotaidmain(id);

    console.log("mascota:");
    console.log(mascota);



    dia = mascota[0].nacimiento;
    mes = mascota[0].nacimiento;
    anio = mascota[0].nacimiento;

    dia = dia.getDate();
    mes = mes.getMonth();
    mes = mes + 1;
    anio = anio.getFullYear();

    mostrandoDatos = document.getElementById("mostrando-datos");

    mostrandoDatos.innerHTML = ""
    mostrandoDatos.innerHTML +=
        `<p><b>Animal:</b> ` + mascota[0].animal + `</p>
    <p><b>Raza:</b> ` + mascota[0].raza + `</p>
    <p><b>Peso:</b> ` + mascota[0].peso + `</p>
    <p><b>Edad:</b> ` + mascota[0].edad + `</p>
    <p><b>Actividad:</b> ` + mascota[0].actividad + `</p>
    <p><b>Afecciones:</b> ` + mascota[0].afecciones + `</p>
    <p><b>Cumpleaños:</b> ` + dia + `/` + mes + `/` + anio + `</p>`



}





async function venta() {

    let newVenta = {
        fecha: new Date(),
        precio: "",
        id_cliente: "",
        cantidad: "",
        tipo: "",
        marca: "",
        kilos: "",
        kilos_gramos: ""
    }

    let mascotas = [];


    datosClienteventa = await main.getDatosmain(consultaCliente);

    soloCliente = await main.getCLientemain(consultaCliente);

    console.log("antes de if soloCliente:", soloCliente);
    console.log("antes de if datosClienteventa:", datosClienteventa);
    let contador = 0;
    soloCliente.forEach(element => {
        contador += 1
    });

    if (contador > 1) {
        soloCliente = await main.getClientetelmain(consultaClientetel);
        datosClienteventa = await main.getDatostelmain(consultaClientetel);
    }

    console.log("despues de if soloCLiente:", soloCliente);
    console.log("despues de if datosClienteventa:", datosClienteventa);



    id_bolsa_kilo = document.getElementById("selectkilos");
    precio = document.getElementById("inputprecio")
    cantbolsas = document.getElementById("inputcantbolsas")


    newVenta = {
        fecha: new Date(),
        precio: precio.value,
        id_cliente: soloCliente[0].id_cliente,
        cantidad: cantbolsas.value,
        id_bolsa_kilo: id_bolsa_kilo.value,
        activo: true
    }

    datosClienteventa.forEach(element => {

        console.log(element.nombremascota);

        checks = document.getElementById(element.nombremascota);
        console.log("checks:", checks);

        if (checks.checked) {
            mascotas.push(element.id_mascota);
        }

    });

    if (mascotas.length == 0) {

        sweetAlertSeleccionMascota();

    } else {

        try {
            await insertVentamain(newVenta, mascotas);
            await sweetAlertExito();
            location.reload();
        } catch (error) {
            console.log(error);
            await sweetAlertErrorDesconocido();
        }



    }


}




////////////////////////////////INNERS//////////////////////////////////////////////////////////
async function innerCliente() {

    datosCliente = await main.getDatosmain(consultaCliente);
    historialVentas = await main.getVentaspornombremain(consultaCliente);
    cliente = await main.getCLientemain(consultaCliente);
    divMensaje = document.getElementById("mensaje");




    divMensaje.innerHTML = "";

    agregado = document.getElementById("agregado")
    ingreso = document.getElementById("mascota")


    ingreso.innerHTML = "";
    ingreso.innerHTML +=
        `<div class="datos-mascota">
<div class="imagen-perro">
<img src="../../imagenes/perro-gato.png" width="120">
</div>
<div class="seleccion-mascota" id="seleccion-mascota">
</div>
<div class="mostrar-datos">
<form>
<label for="selectmascota">Mostrando datos de:</label>
<select name="selectmascota" class="select-mascota" id="select-mascota">
</select>
</form>
</div>
<div class="mostrando-datos" id="mostrando-datos">
</div>
</div>





<div class="huellas">
<img src="../../imagenes/huellas.png" width="40">
</div>`


    agregado.innerHTML = "";
    agregado.innerHTML +=
        `    <div class="container-cliente" id="container-cliente">

<div class="datos-cliente">
<h2 class="h2cliente">Datos del Cliente</h2>
<p><b>Nombre:</b> ` + datosCliente[0].primernombre + ` ` + datosCliente[0].nombrepila + ` ` + datosCliente[0].apellido + `</p>
<p><b>Telefono:</b> ` + datosCliente[0].telefono + `</p>
<p><b>Direccion:</b> ` + datosCliente[0].calle + ` ` + datosCliente[0].calle_numero + `</p>
<p><b>Puntos:</b> ` + datosCliente[0].puntos + `</p>
<br>
<h3>Historial de compras</h3>
<div class="historial" id="historial">
</div>






</div>




</div>

<div class="container-venta" id="container-venta">
<div class="datos-venta">
<h2 class="h2venta">Venta</h2>
<br>
<br>
<br>
<br>
<br>
<form class="form-venta" id="form-venta" autocomplete="off">
<p class="pbolsa"> <b>Seleccionar Bolsa:</b> </p>
      <div class="container-input-marca">
        <input type="text" required id="input-marca" placeholder="Escriba el nombre de la bolsa..." />
      <ul class="list"></ul>
      </div>
<div class="container-selectkilos">
<label for="selectkilos"><b>Kg:</b></label>
<select name="selectkilos" class="selectkilos" id="selectkilos">
    </select>
</div>

<p class="pprecio">Precio de venta: $<input type="number" step="0.01" class="inputprecio" id="inputprecio" required></p>
<p class="pcantbolsas">Cantidad de bolsas: <input type="number" class="inputcantbolsas" id="inputcantbolsas" value="1" required></p>
<button class="btn-borrar" id="btn-borrar-venta" type="reset">Borrar</button>
<button class="btn-ejecutar" type="submit">Ejecutar</button>

</form>
</div>





</div>`


btn_borrar_venta = document.getElementById("btn-borrar-venta");
btn_borrar_venta.addEventListener('click', (e) => {

        //clear all the item
        selectKG = document.getElementById("selectkilos");
        selectKG.innerHTML = "";
        let items = document.querySelectorAll(".list-items");
        items.forEach((item) => {
          item.remove();
        });

})


    rellenarDatos();

}






async function innerClientetel() {

    datosCliente = await main.getDatosmain(consultaCliente);
    historialVentas = await main.getVentaspornombremain(consultaCliente);
    cliente = await main.getCLientemain(consultaCliente);
    divMensaje = document.getElementById("mensaje");



    divMensaje.innerHTML = "";

    agregado = document.getElementById("agregado")
    ingreso = document.getElementById("mascota")




    ingreso.innerHTML = "";
    ingreso.innerHTML +=
        `<div class="datos-mascota">
<div class="imagen-perro">
    <img src="../../imagenes/perro-gato.png" width="120">
</div>
<div class="seleccion-mascota" id="seleccion-mascota">
</div>
<div class="mostrar-datos">
    <form>
        <label for="selectmascota">Mostrando datos de:</label>
        <select name="selectmascota" class="select-mascota" id="select-mascota">
        </select>
    </form>
</div>
<div class="mostrando-datos" id="mostrando-datos">
</div>
</div>





<div class="huellas">
<img src="../../imagenes/huellas.png" width="40">
</div>`





    agregado.innerHTML = "";
    agregado.innerHTML +=
        `    <div class="container-cliente" id="container-cliente">

<div class="datos-cliente">
<h2 class="h2cliente">Datos del Cliente</h2>
<p><b>Nombre:</b> ` + datosClientetel[0].primernombre + ` ` + datosClientetel[0].nombrepila + ` ` + datosClientetel[0].apellido + `</p>
<p><b>Telefono:</b> ` + datosClientetel[0].telefono + `</p>
<p><b>Direccion:</b> ` + datosClientetel[0].calle + ` ` + datosClientetel[0].calle_numero + `</p>
<p><b>Puntos:</b> ` + datosClientetel[0].puntos + `</p>
<br>
<h3>Historial de compras</h3>
<div class="historial" id="historial">
</div>






</div>




</div>

<div class="container-venta" id="container-venta">
<div class="datos-venta">
<h2 class="h2venta">Venta</h2>
<br>
<br>
<br>
<br>
<br>
<form class="form-venta" id="form-venta" autocomplete="off">
<p class="pbolsa"> <b>Seleccionar Bolsa:</b> </p>
      <div class="container-input-marca">
        <input type="text" required id="input-marca" placeholder="Escriba el nombre de la bolsa..." />
      <ul class="list"></ul>
      </div>
<div class="container-selectkilos">
<label for="selectkilos"><b>Kg:</b></label>
<select name="selectkilos" class="selectkilos" id="selectkilos">
    </select>
</div>

<p class="pprecio">Precio de venta: $<input type="number" step="0.01" class="inputprecio" id="inputprecio" required></p>
<p class="pcantbolsas">Cantidad de bolsas: <input type="number" class="inputcantbolsas" id="inputcantbolsas" value="1" required></p>
<button class="btn-borrar" id="btn-borrar-venta" type="reset">Borrar</button>
<button class="btn-ejecutar" type="submit">Ejecutar</button>

</form>
</div>





</div>`


btn_borrar_venta = document.getElementById("btn-borrar-venta");
btn_borrar_venta.addEventListener('click', (e) => {

        //clear all the item
        selectKG = document.getElementById("selectkilos");
        selectKG.innerHTML = "";
        let items = document.querySelectorAll(".list-items");
        items.forEach((item) => {
          item.remove();
        });

})

    rellenarDatostel();

}





function rellenarDatostel() {

    select = document.getElementById("select-mascota");
    seleccionMascota = document.getElementById("seleccion-mascota")
    datosClientetel.forEach(element => {
        select.innerHTML += `<option value="` + element.id_mascota + `">` + element.nombremascota + `</option>`
        seleccionMascota.innerHTML += `<input type="checkbox" value="1" class="checkbox" id="` + element.nombremascota + `">` + element.nombremascota + `<br>`

    });

    console.log("valor select:");
    console.log(select.value);

    select = document.getElementById("select-mascota");
    mostrarDatos();
    Bolsas();

}

function rellenarDatos() {

    select = document.getElementById("select-mascota");
    seleccionMascota = document.getElementById("seleccion-mascota")
    datosCliente.forEach(element => {
        select.innerHTML += `<option value="` + element.id_mascota + `">` + element.nombremascota + `</option>`
        seleccionMascota.innerHTML += `<input type="checkbox" value="1" class="checkbox" id="` + element.nombremascota + `">` + element.nombremascota + `<br>`

    });


    select = document.getElementById("select-mascota");
    mostrarDatos();
    Bolsas();

}



async function agregarInputtel() {

    let mascota = document.getElementById("mascota");
    let agregado = document.getElementById("agregado");
    let primer_nombre = document.getElementById("primer_nombre");
    let apellido = document.getElementById("apellido");

    let primer_nombreValue = primer_nombre.value;
    let apellidoValue = apellido.value;


    let datos = [];

    datos = await main.getCLientemain(consultaCliente);

    let formIngreso = document.getElementById("form-ingreso");
    formIngreso.innerHTML += `<p class="p-telefono" id="p-telefono"><b>Telefono:</b> <select name="selecttelefono" class="telefono" required" id="telefono"></select></p>`

    sweetAlertAviso();


    datos.forEach(element => {
        telefono = document.getElementById("telefono");
        telefono.innerHTML += `<option value="${element.telefono}">${element.telefono}</option>`
    });

    primer_nombre = document.getElementById("primer_nombre");
    apellido = document.getElementById("apellido");
    primer_nombre.value = primer_nombreValue;
    apellido.value = apellidoValue;

}



async function sweetAlertExito() {
    await Swal.fire({
        title: "¡Todo listo!",
        text: "La venta se ha ejecutado con exito",
        icon: "success",
        backdrop: true,
        showConfirmButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        stopKeydownPropagation: false,
    })
}

async function sweetAlertErrorDesconocido() {
    await Swal.fire({
        title: "Ha ocurrido un error desconocido",
        text: "Verifique haber escrito correctamente el nombre de la bolsa y haber completado todos los campos",
        icon: "error",
        backdrop: true,
        showConfirmButton: true,
        allowOutsideClick: true,
        allowEscapeKey: true,
        allowEnterKey: true,
        stopKeydownPropagation: false,
        position: "center",
    })
}

async function sweetAlertSeleccionMascota() {
    await Swal.fire({
        title: "Debe seleccionar al menos una mascota",
        icon: "error",
        backdrop: true,
        showConfirmButton: true,
        allowOutsideClick: true,
        allowEscapeKey: true,
        allowEnterKey: true,
        stopKeydownPropagation: false,
        position: "center",
    })
}



async function sweetAlertAviso() {
    await Swal.fire({
        title: "Existen varios clientes con ese nombre",
        text: "Debe ingresar el numero de telefono",
        icon: "info",
        backdrop: true,
        showConfirmButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        stopKeydownPropagation: false,
        position: "top",
    })
}


async function Bolsas() {
    let names = await getBolsasMain();
    // let names = ['Felipe', 'Paula'];
    console.log(names);
      //Sort names in ascending order
      let sortedNames = names.sort();
      //reference
      let input = document.getElementById("input-marca");
      //Execute function on keyup
      input.addEventListener("keyup", (e) => {
        //loop through above array
        //Initially remove all elements ( so if user erases a letter or adds new letter then clean previous outputs)
        removeElements();
        for (let i of sortedNames) {
          //convert input to lowercase and compare with each string
          if (
            i.toLowerCase().startsWith(input.value.toLowerCase()) &&
            input.value != ""
          ) {
            //create li element
            let listItem = document.createElement("li");
            //One common class name
            listItem.classList.add("list-items");
            listItem.style.cursor = "pointer";
            listItem.addEventListener("click", () => displayNames(i));
            //Display matched part in bold
            let word = "<b>" + i.substr(0, input.value.length) + "</b>";
            word += i.substr(input.value.length);
            //display the value in array
            listItem.innerHTML = word;
            document.querySelector(".list").appendChild(listItem);
          }
        }
      });
      function displayNames(value) {
        input.value = value;
        actualizarKgBolsa(value);
        removeElements();
      }
      function removeElements() {
        //clear all the item
        selectKG = document.getElementById("selectkilos");
        selectKG.innerHTML = "";
        let items = document.querySelectorAll(".list-items");
        items.forEach((item) => {
          item.remove();
        });
      }
}


async function actualizarKgBolsa(bolsa){
    let kgBolsa = await getKgBolsaMain(bolsa);
    console.log(kgBolsa);
    selectKG = document.getElementById("selectkilos");

    selectKG.innerHTML = ""

    kgBolsa.forEach(element => {
        selectKG.innerHTML += `<option value="` + element.id_bolsa_kilo + `">` + element.kilos_bolsa + `</option>`
    });

}