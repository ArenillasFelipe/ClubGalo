const mysql = require('promise-mysql');

const connectionConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'mascotas'
};

// Establece la conexión con la base de datos 'mascotas' y verifica su existencia
async function createConnection() {
    const connection = await mysql.createConnection(connectionConfig);
    // await connection.query('CREATE DATABASE IF NOT EXISTS mascotas');
    // await connection.query('USE mascotas');

    // await connection.query(`CREATE TABLE IF NOT EXISTS clientes(
    //     primernombre varchar(64),
    //     nombrepila varchar(64),
    //     apellido varchar(64),
    //     telefono bigint,
    //     calle varchar(64),
    //     calle_numero integer,
    //     puntos integer,
    //     id_cliente integer auto_increment,
    //     validoCliente bool default true,
    //     primary key(id_cliente)
    // ) ENGINE = InnoDB;`);

    // await connection.query(`CREATE TABLE IF NOT EXISTS mascotas(
    //     nacimiento date,
    //     nombremascota varchar(64),
    //     raza varchar(64),
    //     peso float,
    //     afecciones varchar(64),
    //     animal varchar(64),
    //     actividad varchar(64),
    //     id_mascota integer auto_increment,
    //     id_cliente integer,
    //     validoMascota bool default true,
    //     primary key(id_mascota),
    //     CONSTRAINT FK_clientes FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
    // ) ENGINE = InnoDB;`);

    // await connection.query(`CREATE TABLE IF NOT EXISTS bolsas(
    //     id_bolsa integer auto_increment,
    //     marca_bolsa VARCHAR(64),
    //     calidad_bolsa VARCHAR(64),
    //     validoBolsa bool default true,
    //     primary key(id_bolsa, marca_bolsa)
    // ) ENGINE = InnoDB;`);

    // await connection.query(`CREATE TABLE IF NOT EXISTS bolsas_kilos(
    //     id_bolsa_kilo integer auto_increment,
    //     id_bolsa integer,
    //     kilos_bolsa float,
    //     validoBolsaKilo bool default true,
    //     primary key(id_bolsa_kilo),
    //     CONSTRAINT FK_bolsas FOREIGN KEY (id_bolsa) REFERENCES bolsas(id_bolsa)
    // ) ENGINE = InnoDB;`);

    // await connection.query(`CREATE TABLE IF NOT EXISTS venta(
    //     fecha datetime,
    //     precio float,
    //     id_cliente integer,
    //     cantidad integer,
    //     marca_bolsa varchar(64),
    //     kilos_bolsa float,
    //     calidad_bolsa varchar(64),
    //     activo bool,
    //     totalventa float,
    //     puntos_obtenidos integer,
    //     puntos_canjeados integer,
    //     vencimiento datetime,
    //     id_venta integer auto_increment,
    //     primary key(id_venta),
    //     CONSTRAINT FK2_clientes FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
    // ) ENGINE = InnoDB;`);

    // await connection.query(`CREATE TABLE IF NOT EXISTS venta_mascota(
    //     id_ventamascota integer auto_increment,
    //     id_venta integer,
    //     id_mascota integer,
    //     primary key(id_ventamascota),
    //     CONSTRAINT FK_mascotas FOREIGN KEY (id_mascota) REFERENCES mascotas(id_mascota),
    //     CONSTRAINT FK_venta FOREIGN KEY (id_venta) REFERENCES venta(id_venta)
    // ) ENGINE = InnoDB;`);

    // await connection.query(`USE mascotas;
    //                         DELIMITER //
    //                         CREATE TRIGGER IF NOT EXISTS calculartotalventa BEFORE INSERT ON venta
    //                         FOR EACH ROW BEGIN
    //                             SET NEW.totalventa = NEW.cantidad * NEW.precio;
    //                         END
    //                         //`);

    return connection;
}

// Obtiene la conexión
async function getConnection() {
    const connection = await createConnection();
    return connection;
}

module.exports = { getConnection };




























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








