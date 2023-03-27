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