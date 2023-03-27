const { remote, app } = require('electron');
const { getCLientemain, buscar20ClientesMain, recargarPaginaPrincipal, createWindowAgregarCliente, get20ClientesTodos,eliminarClienteMain, getMascotasidCliente, getMascotaidmain, createWindowEditarCliente } = require('../../main');
const main = remote.require('./main');




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
    get20Clientes();
  }
});






formBuscador = document.getElementById("busqueda");
barra_busqueda = document.getElementById("barra-busqueda");

formBuscador.addEventListener('submit', (e) => {
  e.preventDefault();
  if (barra_busqueda.value != "") {
    salto = 0;
    divClientes.innerHTML = "";
    buscar20ClientesApp(barra_busqueda.value);
  }else{
    get20Clientes();
  }

});

async function buscar20ClientesApp(busqueda){
  let resultado = await buscar20ClientesMain(busqueda, salto);
  salto += 20;
  renderClientes(resultado);
}


async function get20Clientes() {
    let resultado = await get20ClientesTodos(salto);
    salto += 20;
    renderClientes(resultado);
}


divClientes = document.getElementById("divClientes");

/////////////////////////////////INNERS/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function renderClientes(clientes) {
    for (let index = 0; index < clientes.length; index++){
        const element = clientes[index];
        idCliente = element.id_cliente;
        mascotas = await getMascotasidCliente(idCliente);

        divClientes.innerHTML += `<div class="container-cliente">
        <div class="container-datoscliente">
          <div class="datos-persona" id="datos-persona">
            <p class="pdireccion"><span style="font-weight: 800;">Direccion:</span> ${element.calle} ${element.calle_numero}</p>
            <p class="ptelefono"><span style="font-weight: 800;">Telefono:</span> ${element.telefono}</p>
            <p class="pmascotas" id="pmascotas${idCliente}"><span style="font-weight: 800;">Mascotas:</span></p>
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
                <select name="selectmascota" class="select-mascota" id="select-mascota${idCliente}">
                </select>
            </div>
            <div class="mostrando-datos" id="mostrando-datos${idCliente}">
            </div>
          </div>
        </div>
        <div class="container-nombre">
          <p class="pnombre">${element.primernombre} ${element.nombrepila} ${element.apellido}</p>
        </div>
        <div class="container-id">
          <p class="pid">ID: ${element.id_cliente}</p>
        </div>
        <div class="puntos">
          <p class="ppuntos">Puntos: ${element.puntos}</p>
        </div>
        <button class="btn-borrar" type="submit" onClick="botonBorrar(${idCliente})">Borrar</button>
        <button class="btn-editar" type="submit" onClick="botonEditar(${idCliente})">Editar</button>
      </div>`;

        let idDocument = "pmascotas" + idCliente;
        let idSelect = "select-mascota" + idCliente;
        pmascotas = document.getElementById(idDocument);
        let select = document.getElementById(idSelect);
        select.innerHTML = "";
        mascotas.forEach(element => {
            pmascotas.innerHTML += ` ${element.nombremascota} -`;
            select.innerHTML += `<option value="` + element.id_mascota + `">` + element.nombremascota + `</option>`
        });

        cambiarDatosMascota(select.value, idCliente);





    }
    for (let index = 0; index < clientes.length; index++){
        const element = clientes[index];
        let idCliente = element.id_cliente;
        mascotas = await getMascotasidCliente(idCliente);

        let idDocument = "pmascotas" + idCliente;
        let idSelect = "select-mascota" + idCliente;
        pmascotas = document.getElementById(idDocument);
        let select = document.getElementById(idSelect);


        select = document.getElementById(idSelect);
        console.log("value select:", select);
        select.addEventListener('change', (e) => {
            e.preventDefault();
            idMascota = select.value;
            
            cambiarDatosMascota(idMascota, idCliente);
        
        });

    }

}
/*    <div class="container-cliente">
      <div class="container-datoscliente">
        <div class="datos-persona" id="datos-persona">
          <p class="pdireccion"><span style="font-weight: 800;">Direccion:</span> San Martin 850</p>
          <p class="ptelefono"><span style="font-weight: 800;">Telefono:</span> 3573431358</p>
          <p class="pmascotas"><span style="font-weight: 800;">Mascotas:</span> Teo - Pocho - Bruno - Pichicho</p>
        </div>
      </div>
      <img id="imagenpersona" src="../../imagenes/persona.png">
 
 
      <div class="div-mascotas">
        <div class="datos-mascota">
          <div class="imagen-perro">
            <img src="../../imagenes/perro-gato.png" width="120">
          </div>
          <div class="mostrar-datos">
            <form>
              <label for="selectmascota"><span style="font-weight: 800;">Mostrando datos de:</span></label>
              <select name="selectmascota" class="select-mascota" id="select-mascota">
              </select>
            </form>
          </div>
          <div class="mostrando-datos" id="mostrando-datos">
            <p><span style="font-weight: 800;">Animal:</span> Perro</p>
            <p><span style="font-weight: 800;">Raza:</span> Bulldog ingles</p>
            <p><span style="font-weight: 800;">Peso:</span> 30kg</p>
            <p><span style="font-weight: 800;">Edad:</span> 8</p>
            <p><span style="font-weight: 800;">Actividad:</span> Baja</p>
            <p><span style="font-weight: 800;">Afecciones:</span> Dermatitis y obesidad</p>
            <p><span style="font-weight: 800;">Cumpleaños:</span> 24/05/2002</p>
          </div>
        </div>
      </div>
      <div class="container-nombre">
        <p class="pnombre">Maximiliano Sebastian Arenillas</p>
      </div>
      <div class="container-id">
        <p class="pid">ID: 1567</p>
      </div>
      <div class="puntos">
        <p class="ppuntos">Puntos: 2253</p>
      </div>
    </div>
*/


get20Clientes();

async function cambiarDatosMascota(idMascota, idCliente) {

    console.log(idMascota);
    console.log(idCliente);
    mascota = await getMascotaidmain(idMascota);
    idMostrandoDatos = "mostrando-datos" + idCliente;
    mostrandoDatos = document.getElementById(idMostrandoDatos);

    dia = mascota[0].nacimiento;
    mes = mascota[0].nacimiento;
    anio = mascota[0].nacimiento;

    dia = dia.getDate();
    mes = mes.getMonth();
    mes = mes + 1;
    anio = anio.getFullYear();

    mostrandoDatos.innerHTML = `<p><span style="font-weight: 800;">Animal:</span> ${mascota[0].animal}</p>
    <p><span style="font-weight: 800;">Raza:</span> ${mascota[0].raza}</p>
    <p><span style="font-weight: 800;">Peso:</span> ${mascota[0].peso}</p>
    <p><span style="font-weight: 800;">Edad:</span> ${mascota[0].edad}</p>
    <p><span style="font-weight: 800;">Actividad:</span> ${mascota[0].actividad}</p>
    <p><span style="font-weight: 800;">Afecciones:</span> ${mascota[0].afecciones}</p>
    <p><span style="font-weight: 800;">Cumpleaños:</span> ` + dia + `/` + mes + `/` + anio + `</p>`


}


function botonEditar(idCliente) {
localStorage.setItem("ClienteAEditar",  idCliente);
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


function botonAgregarCliente(){
  localStorage.setItem("EstadoCliente",  "NoCreado");
  main.createWindowAgregarCliente();
}


async function sweetAlertBorrar(){
  let resultado;
  await Swal.fire({
    title: '¿Seguro que desea borrar el cliente?',
    text: "Se perderan todos sus datos incluido su historial de venta y mascotas.",
    footer: "No se podran revertir los cambios",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonText: "Cancelar",
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, borrar'
  }).then((result) => {
    if (result.isConfirmed) {
      resultado = true;
    }else{
      resultado = false;
    }
  })

  return resultado;
}


