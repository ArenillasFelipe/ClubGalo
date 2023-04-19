const mysql =  require('promise-mysql')


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'mascotas'
})


//hace la conexion con la bd
function getConnection() {
    return connection;
}

module.exports = {getConnection}



























// ├── Main.js
// ├── database.js
// ├── package.json
// ├── src/
//     ├── ui/
//         ├── Venta/
//         │    ├── Venta.js
//         │    ├── Venta.html
//         │    ├── Venta.css
//         └── Clientes/
//              ├── Clientes.js
//              ├── Clientes.html
//              ├── Clientes.css

// En mi caso mi proyecto esta dividido de esta forma. "Venta" contiene los 3 archivos necesarios para mostrar la pagina al igual que "Clientes". "Database.js" contiene el codigo para realizar la conexion con la base de datos y "Main.js" contiene la logica para la creacion de la ventana de electron y todas las funciones que consultan a la base de datos que luego seran llamadas por "Clientes.js" y "Venta.js".








