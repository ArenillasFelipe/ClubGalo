const { createWindow } = require('./main')//llama a la funcion que crea la ventana
const {app} = require('electron')
require('./database')//llama a database que inicia la conexxion con la bd
require('electron-reload')(__dirname)//permite que la intefaz se actualice ante cambios en vivo
app.allowRendererProcessReuse = false;

app.whenReady().then(createWindow);

