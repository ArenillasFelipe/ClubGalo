const { BrowserWindow, app, Menu } = require('electron');
const { actualizarVentasVencidas } = require('./models/ventaModel');
const url = require('url');
const path = require('path');

let window;
let windowEditarCliente;
let windowAgregarCliente;
let windowEditarBolsa;
let windowAgregarBolsa;
let windowVentasBolsas;
let windowModificarMultiplicador;



function recargarPaginaPrincipal() {
    window.reload();
}

function createWindow() {

    actualizarVentasVencidas();

    window = new BrowserWindow({
        width: 1100,
        height: 820,
        autoHideMenuBar: false,
        resizable: false,
        icon: __dirname + './imagenes/favicon.png',
        webPreferences: {
            nodeIntegration: true
        }
    })

    const mainMenu = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(mainMenu);


    window.loadURL(url.format({
        pathname: path.join(__dirname, "views/Seguimiento/seguimiento.html"),
        protocol: 'file',
        slashes: true
    }))

    window.on('closed', () => {
        app.quit();
    });

}


const templateMenu = [
    {
        label: 'Config',
        submenu: [
            {
                label: 'Multiplicador de puntos',
                click() {
                    createWindowMultiplicadorPuntos();
                }
            }
        ]
    },
    {
        label: 'Desarrollador',
        submenu: [
          { label: 'Abrir Herramientas de Desarrollador', role: 'toggleDevTools' }
        ]
      }
]

const onlyDevMenu = [
    {
        label: 'Desarrollador',
        submenu: [
          { label: 'Abrir Herramientas de Desarrollador', role: 'toggleDevTools' }
        ]
      }
]

function createWindowMultiplicadorPuntos() {

    cerrarVentanasEmergentes();
    windows = BrowserWindow.getAllWindows();
    console.log(`Hay ${windows.length} ventanas abiertas.`);
    console.log(windows[0].BrowserWindow);
    mainDocument = windows[0].webContents;

    console.log(mainDocument);

    // Establecer la propiedad opacity del body de la ventana principal
    mainDocument.executeJavaScript(`document.body.style.opacity = ${0.1};`);
    mainDocument.executeJavaScript(`document.body.style.pointerEvents = 'none';`);

    windowModificarMultiplicador = new BrowserWindow({
        width: 400,
        height: 200,
        alwaysOnTop: true,
        frame: true,
        resizable: false,
        icon: __dirname + './imagenes/favicon.png',
        webPreferences: {
            nodeIntegration: true
        }
    })

    windowModificarMultiplicador.on('closed', () => {
        cerrarVentanasEmergentes();
    });

    windowModificarMultiplicador.loadFile('src/views/modMultiplicador/modMultiplicador.html'); //indica el archivo que se cargara en la ventana
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
        frame: false,
        resizable: false,
        icon: __dirname + './imagenes/favicon.png',
        webPreferences: {
            nodeIntegration: true
        }
    })

    windowEditarCliente.on('closed', () => {
        cerrarVentanasEmergentes();
    });

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


    windowAgregarCliente.on('closed', () => {
        cerrarVentanasEmergentes();
    });


    windowAgregarCliente.loadFile('src/views/agregarCliente/agregarCliente.html'); //indica el archivo que se cargara en la ventana
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
        frame: false,
        resizable: true,
        icon: __dirname + './imagenes/favicon.png',
        webPreferences: {
            nodeIntegration: true
        }
    })


    windowEditarBolsa.on('closed', () => {
        cerrarVentanasEmergentes();
    });

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
        frame: false,
        resizable: false,
        icon: __dirname + './imagenes/favicon.png',
        webPreferences: {
            nodeIntegration: true
        }
    })


    windowAgregarBolsa.on('closed', () => {
        cerrarVentanasEmergentes();
    });

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
        frame: false,
        resizable: false,
        icon: __dirname + './imagenes/favicon.png',
        webPreferences: {
            nodeIntegration: true
        }
    })


    windowVentasBolsas.on('closed', () => {
        cerrarVentanasEmergentes();
    });

    windowVentasBolsas.loadFile('src/views/ventasBolsas/ventasBolsas.html'); //indica el archivo que se cargara en la ventana
}


function cerrarVentanasEmergentes() {

    try {
        mainDocument.executeJavaScript(`document.body.style.opacity = ${1.00};`);
        mainDocument.executeJavaScript(`document.body.style.pointerEvents = 'auto';`);
    } catch (error) {
        //no hace nada
    }


    if (windowModificarMultiplicador != undefined) {
        try {
            windowModificarMultiplicador.close();
        } catch (e) {
            //no hace nada
        }
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

//exporta la funcion para poder ser usada en otro lado
module.exports = {
    createWindow,
    createWindowEditarCliente,
    createWindowAgregarCliente,
    cerrarVentanasEmergentes,
    recargarPaginaPrincipal,
    createWindowEditarBolsa,
    createWindowAgregarBolsa,
    createWindowVentasBolsas,
}