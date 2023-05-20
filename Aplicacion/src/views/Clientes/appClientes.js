const { remote } = require('electron');
const main = remote.require('./main');
const cliente_controller = require('../../controllers/cliente_controller');
const sweetAlerts = require('../../utils/sweetAlerts');
const { calcularEdadMascota } = require('../../utils/calcularFechas');





const doc = document.documentElement;

let flechaArriba = document.getElementById("flechaArriba");
flechaArriba.style.display = 'none';

// Agrega un eventListener al evento scroll
window.addEventListener('scroll', () => {
  const scrollPos = window.pageYOffset || doc.scrollTop;

  if (scrollPos <= 0) {
    flechaArriba.style.display = 'none';
  } else {
    flechaArriba.style.display = 'block';
  }
});







let barra_busqueda = document.getElementById('barra-busqueda');
barra_busqueda.focus();


let salto = 0;






formBuscador = document.getElementById("busqueda");
barra_busqueda = document.getElementById("barra-busqueda");

formBuscador.addEventListener('submit', (e) => {
  e.preventDefault();

  salto = 0;
  get20ClientesConMascotas(barra_busqueda.value);

});


localStorage.clear();

listenerBtnAnterior();
listenerBtnSiguiente();


get20ClientesConMascotas();
async function get20ClientesConMascotas(busqueda) {
  let resultado = await cliente_controller.get20ClientesConMascotasBySearch(busqueda, salto);
  renderClientes(resultado);
}


divClientes = document.getElementById("divClientes");

/////////////////////////////////INNERS/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function renderClientes(clientesConMascotas) {
  divClientes.innerHTML = "";
  let container_paginado = document.getElementById("container-paginado");
  container_paginado.style.opacity = 0;


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



  container_paginado.style.opacity = 1;
}

async function cambiarDatosMascota(idMascota, clienteConMascotas) {

  let mascotas = clienteConMascotas.mascotas;

  let mascotaAMostrar = mascotas.find(mascota => mascota.id_mascota == idMascota);

  idMostrandoDatos = "mostrando-datos" + clienteConMascotas.cliente.id_cliente;
  mostrandoDatos = document.getElementById(idMostrandoDatos);

  let edadMascota = calcularEdadMascota(mascotaAMostrar.nacimiento);

  mostrandoDatos.innerHTML = `<p><span style="font-weight: 800;">Animal:</span> ${mascotaAMostrar.animal}</p>
    <p><span style="font-weight: 800;">Raza:</span> ${mascotaAMostrar.raza}</p>
    <p><span style="font-weight: 800;">Peso:</span> ${mascotaAMostrar.peso}</p>
    <p><span style="font-weight: 800;">Edad:</span> ${edadMascota}</p>
    <p><span style="font-weight: 800;">Actividad:</span> ${mascotaAMostrar.actividad}</p>
    <p><span style="font-weight: 800;">Afecciones:</span> ${mascotaAMostrar.afecciones}</p>
    <p><span style="font-weight: 800;">Nacimiento:</span> ${mascotaAMostrar.nacimiento}</p>`

}


function botonEditar(idCliente) {
  localStorage.setItem("ClienteAEditar", idCliente);
  main.createWindowEditarCliente();
}

async function botonBorrar(idCliente) {
  let confirma_borrado = await sweetAlerts.sweetAlertBorrarCliente();
  if (confirma_borrado) {

    await cliente_controller.borrarClienteById(idCliente);
    await sweetAlerts.sweetAlertClienteBorradoConExito();
    main.recargarPaginaPrincipal();
  }
}


function botonAgregarCliente() {
  localStorage.setItem("EstadoCliente", "NoCreado");
  main.createWindowAgregarCliente();
}




function listenerBtnSiguiente() {
  let btnSiguiente = document.getElementById('btnSiguiente')
  btnSiguiente.addEventListener('click', (e) => {
    e.preventDefault();
    paginaSiguiente();
  })

}

function paginaSiguiente() {
  let h5Pagina = document.getElementById('h5Pagina');
  h5Pagina.textContent = parseInt(h5Pagina.textContent) + 1;
  salto = (parseInt(h5Pagina.textContent) - 1) * 20;
  get20ClientesConMascotas();
}


function listenerBtnAnterior() {
  let btnAnterior = document.getElementById('btnAnterior')
  btnAnterior.addEventListener('click', (e) => {
    e.preventDefault();
    paginaAnterior();
  })

}

function paginaAnterior() {
  let h5Pagina = document.getElementById('h5Pagina');

  if (parseInt(h5Pagina.textContent) > 1) {

  h5Pagina.textContent = parseInt(h5Pagina.textContent) - 1;
  salto = (parseInt(h5Pagina.textContent) - 1) * 20;
  get20ClientesConMascotas();

  }

}




