const { remote, app } = require('electron');
const { agregarBolsaMain } = require('../../main');
const main = remote.require('./main');
mainFunctionAgregarBolsaApp();

let newBolsa;

async function mainFunctionAgregarBolsaApp() {

    listenerCruz();


}