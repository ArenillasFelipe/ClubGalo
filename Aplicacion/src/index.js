const {app} = require('electron')
require('./database.js')//llama a database que inicia la conexxion con la bd
const { createWindow } = require('./main')//llama a la funcion que crea la ventana
// const path = require('path');

// // Reload in Development for Browser Windows
// if(process.env.NODE_ENV !== 'production') {
//     require('electron-reload')(__dirname, {
//       electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
//     });
//   }//permite que la intefaz se actualice ante cambios en vivo

app.allowRendererProcessReuse = false;
app.whenReady().then(createWindow);

