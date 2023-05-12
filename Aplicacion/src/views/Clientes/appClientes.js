const { remote } = require('electron');
const main = remote.require('./main');
const cliente_controller = require('../../controllers/cliente_controller');
const sweetAlerts = require('../../utils/sweetAlerts');



let barra_busqueda = document.getElementById('barra-busqueda');
barra_busqueda.focus();


let salto = 0;
// Selecciona el objeto document.documentElement para acceder a las propiedades de la página
const doc = document.documentElement;

let flechaArriba = document.getElementById("flechaArriba");
flechaArriba.style.display = 'none';

// Agrega un eventListener al evento scroll
window.addEventListener('scroll', () => {
  var scrollPos = window.scrollY || window.scrollTop || document.getElementsByTagName("html")[0].scrollTop;
  var windowHeight = document.documentElement.clientHeight;

  //Mostrar el elemento si la posición actual de scroll es menor o igual a 0
  if (scrollPos <= 0) {
    flechaArriba.style.display = 'none';
  } else {
    flechaArriba.style.display = 'block';
  }

  // Si el usuario ha llegado al final de la página
  if (doc.scrollTop + window.innerHeight === doc.scrollHeight) {
    get20ClientesConMascotas(barra_busqueda.value);
  }
});






formBuscador = document.getElementById("busqueda");
barra_busqueda = document.getElementById("barra-busqueda");

formBuscador.addEventListener('submit', (e) => {
  e.preventDefault();

  salto = 0;
  divClientes.innerHTML = "";
  get20ClientesConMascotas(barra_busqueda.value);

});

get20ClientesConMascotas();
async function get20ClientesConMascotas(busqueda) {
  let resultado = await cliente_controller.get20ClientesConMascotasBySearch(busqueda, salto);
  salto += 20;
  renderClientes(resultado);
}


divClientes = document.getElementById("divClientes");

/////////////////////////////////INNERS/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function renderClientes(clientesConMascotas) {
  for (let index = 0; index < clientesConMascotas.length; index++) {
    const element = clientesConMascotas[index];
    console.log(element);

    divClientes.innerHTML += `<div class="container-cliente">
        <div class="container-datoscliente">
          <div class="datos-persona" id="datos-persona">
            <p class="pdireccion"><span style="font-weight: 800;">Direccion:</span> ${element.cliente.calle} ${element.cliente.calle_numero}</p>
            <p class="ptelefono"><span style="font-weight: 800;">Telefono:</span> ${element.cliente.telefono}</p>
            <p class="pmascotas" id="pmascotas${element.cliente.id_cliente}"><span style="font-weight: 800;">Mascotas:</span></p>
          </div>
        </div>
        <img id="imagenpersona" src="../../imagenes/persona.png">
  
  
        <div class="div-mascotas">
          <div class="datos-mascota">
            <div class="imagen-perro">
              <img src="../../imagenes/perro-gato.png" width="120">
            </div>
            <div class="mostrar-datos">
                <label for="selectmascota"><span style="font-weight: 800;">Mostrando datos de:</span></label>
                <select name="selectmascota" class="select-mascota" id="select-mascota${element.cliente.id_cliente}">
                </select>
            </div>
            <div class="mostrando-datos" id="mostrando-datos${element.cliente.id_cliente}">
            </div>
          </div>
        </div>
        <div class="container-nombre">
          <p class="pnombre">${element.cliente.primernombre} ${element.cliente.nombrepila} ${element.cliente.apellido}</p>
        </div>
        <div class="container-id">
          <p class="pid">Nº: ${element.cliente.id_cliente}</p>
        </div>
        <div class="puntos">
          <p class="ppuntos">Puntos: ${element.cliente.puntos}</p>
        </div>
        <button class="btn-borrar" type="submit" onClick="botonBorrar(${element.cliente.id_cliente})">Borrar</button>
        <button class="btn-editar" type="submit" onClick="botonEditar(${element.cliente.id_cliente})">Editar</button>
      </div>`;

    let idDocument = "pmascotas" + element.cliente.id_cliente;
    let idSelect = "select-mascota" + element.cliente.id_cliente;
    pmascotas = document.getElementById(idDocument);
    let select = document.getElementById(idSelect);
    select.innerHTML = "";

    let mascotas = element.mascotas;

    mascotas.forEach(element => {
      pmascotas.innerHTML += ` ${element.nombremascota} -`;
      select.innerHTML += `<option value="` + element.id_mascota + `">` + element.nombremascota + `</option>`
    });

    cambiarDatosMascota(select.value, element);


  }
  for (let index = 0; index < clientesConMascotas.length; index++) {
    const element = clientesConMascotas[index];

    let idDocument = "pmascotas" + element.cliente.id_cliente;
    let idSelect = "select-mascota" + element.cliente.id_cliente;
    pmascotas = document.getElementById(idDocument);
    let select = document.getElementById(idSelect);


    select = document.getElementById(idSelect);
    console.log("value select:", select);
    select.addEventListener('change', (e) => {
      e.preventDefault();
      idMascota = select.value;

      cambiarDatosMascota(idMascota, element);

    });

  }

}

async function cambiarDatosMascota(idMascota, clienteConMascotas) {

  let mascotas = clienteConMascotas.mascotas;

  let mascotaAMostrar = mascotas.find(mascota => mascota.id_mascota == idMascota);

  idMostrandoDatos = "mostrando-datos" + clienteConMascotas.cliente.id_cliente;
  mostrandoDatos = document.getElementById(idMostrandoDatos);

  mostrandoDatos.innerHTML = `<p><span style="font-weight: 800;">Animal:</span> ${mascotaAMostrar.animal}</p>
    <p><span style="font-weight: 800;">Raza:</span> ${mascotaAMostrar.raza}</p>
    <p><span style="font-weight: 800;">Peso:</span> ${mascotaAMostrar.peso}</p>
    <p><span style="font-weight: 800;">Edad:</span> ${mascotaAMostrar.edad}</p>
    <p><span style="font-weight: 800;">Actividad:</span> ${mascotaAMostrar.actividad}</p>
    <p><span style="font-weight: 800;">Afecciones:</span> ${mascotaAMostrar.afecciones}</p>
    <p><span style="font-weight: 800;">Cumpleaños:</span>${mascotaAMostrar.nacimiento}</p>`

}


function botonEditar(idCliente) {
  localStorage.setItem("ClienteAEditar", idCliente);
  main.createWindowEditarCliente();
}

async function botonBorrar(idCliente) {
  let respuesta = await sweetAlertBorrar();
  if (respuesta) {
    await main.eliminarClienteMain(idCliente);
    await Swal.fire(
      '¡Borrado!',
      'El cliente ha sido eliminado con exito.',
      'success',
    )
    main.recargarPaginaPrincipal();
  }
}


function botonAgregarCliente() {
  localStorage.setItem("EstadoCliente", "NoCreado");
  main.createWindowAgregarCliente();
}





