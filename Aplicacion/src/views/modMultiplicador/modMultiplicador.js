const config_controller = require('../../controllers/config_controller');
const { remote } = require('electron');
const main = remote.require('./main');

let input = document.getElementById("input");
let form = document.getElementById("form");

input.focus();

mainFunction();
async function mainFunction() {
    let multiplicador = await getMultiplicadorPuntos();
    input.value = multiplicador;
    listenerModificarMultiplicador();
}


async function getMultiplicadorPuntos() {
    let multiplicador = await config_controller.getMultiplicadorPuntos();
    return multiplicador;
}

function listenerModificarMultiplicador() {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        modificarMultiplicadorPuntos();
      })
}


async function modificarMultiplicadorPuntos() {
    await config_controller.modificarMultiplicadorPuntos(input.value);
    main.cerrarVentanasEmergentes();
}
