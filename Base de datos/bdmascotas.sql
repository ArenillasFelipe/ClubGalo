drop database if exists mascotas;
create database mascotas;
use mascotas;

drop table if exists clientes;
create table clientes(
primernombre varchar(64),
nombrepila varchar(64),
apellido varchar(64),
telefono bigint,
calle varchar(64),
calle_numero integer,
cantbolsas integer,
cantmascotas integer,
id_cliente integer auto_increment,
primary key(id_cliente)
)engine = innoDB;

insert into clientes (primernombre,nombrepila,apellido,telefono, calle, calle_numero, cantbolsas, cantmascotas) values('Felipe', 'Felipe','Arenillas',3573431358, 'San Martin' , 850, 0, 3);
insert into clientes (primernombre,nombrepila,apellido,telefono, calle, calle_numero, cantbolsas, cantmascotas) values('Ana', 'Paula','Arenillas',3573563487, 'Catamarca' , 675, 2, 6);
insert into clientes (primernombre,nombrepila,apellido,telefono, calle, calle_numero, cantbolsas, cantmascotas) values('Maria', 'Fabiola','Giardelli',3573400155, 'San Martin' , 850, 1, 4);
insert into clientes (primernombre,nombrepila,apellido,telefono, calle, calle_numero, cantbolsas, cantmascotas) values('Ana', 'Sofia','Arenillas',3573540023, 'San Martin' , 850, 4, 5);
insert into clientes (primernombre,nombrepila,apellido,telefono, calle, calle_numero, cantbolsas, cantmascotas) values('Fernando', 'Fernando','Gallo',3573125587, 'Corrientes' , 1280, 2, 9);




select *
from clientes;

drop table if exists mascotas;
create table mascotas(
nacimiento date,
nombre varchar(64),
raza varchar(64),
edad integer,
peso float,
afecciones varchar(64),
animal varchar(64),
actividad varchar(64),
id_mascota integer auto_increment,
id_cliente integer,
primary key(id_mascota),
CONSTRAINT FK_clientes FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
)engine = innoDB;

insert into mascotas (nacimiento, nombre, raza, edad, peso, afecciones, animal, actividad, id_cliente) values('2023-01-01', 'Pocho','Bulldog ingles',8, 30, 'dermatitis, problemas de respiracion y es gay', 'Perro', 'baja', 1);
insert into mascotas (nacimiento, nombre, raza, edad, peso, afecciones, animal, actividad, id_cliente) values('2023-01-01', 'Teo','Caniche',12, 10, 'Cancer', 'Perro', 'media', 1);
insert into mascotas (nacimiento, nombre, edad, peso, afecciones, animal, actividad, id_cliente) values('2023-01-01', 'Sofia',23, 200, 'sobrepeso', 'Humano creo', 'nula', 1);


select *
from mascotas;

drop table if exists venta;
create table venta(
fecha date,
precio float,
id_cliente integer,
marca varchar(64),
kilos float,
cantidad integer,
id_venta integer auto_increment,
primary key(id_venta),
CONSTRAINT FK2_clientes FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
)engine = innoDB;

insert into venta (fecha, precio, id_cliente, marca, kilos, cantidad) values('2023-11-01', 3574, 1, 'Royal Canin', 30, 1);
insert into venta (fecha, precio, id_cliente, marca, kilos, cantidad) values('2023-04-22', 5685, 1, 'Jaspe', 30, 1);
insert into venta (fecha, precio, id_cliente, marca, kilos, cantidad) values('2023-07-07', 3459, 2, 'Pedigree', 30, 1);
insert into venta (fecha, precio, id_cliente, marca, kilos, cantidad) values('2023-09-28', 3459, 3, 'Royal Canin', 30, 1);
insert into venta (fecha, precio, id_cliente, marca, kilos, cantidad) values('2023-02-21', 3459, 4, 'Jaspe', 30, 1);
insert into venta (fecha, precio, id_cliente, marca, kilos, cantidad) values('2023-11-07', 3459, 5, 'Pedigree', 30, 1);



select * from venta inner join clientes on clientes.id_cliente = venta.id_cliente where clientes.apellido like "%are%" order by venta.fecha DESC;

'select * from venta inner join clientes on clientes.id_cliente = venta.id_cliente where venta.fecha like "%?%" or venta.precio like "%?%" or venta.marca like "%?%" or venta.kilos like "%?%" or venta.cantidad like "%?%" or clientes.primernombre like "%?%" or clientes.nombrepila like "%?%" or clientes.apellido like "%?%" or clientes.telefono like "%?%" or clientes.calle like "%?%" or clientes.calle_numero like "%?%" order by venta.fecha DESC;', busqueda

`select * from venta inner join clientes on clientes.id_cliente = venta.id_cliente where venta.precio like ? order by venta.fecha DESC;`

select * from venta inner join clientes on clientes.id_cliente = venta.id_cliente where venta.fecha like ? or venta.precio like ? or venta.marca like ? or venta.kilos like ? or venta.cantidad like ? or clientes.primernombre like ? or clientes.nombrepila like ? or clientes.apellido like ? or clientes.telefono like ? or clientes.calle like ? or clientes.calle_numero like ? order by venta.fecha DESC;

	select * 
    from venta 
    inner join clientes on clientes.id_cliente = venta.id_cliente 
    where venta.fecha like busqueda 
    or venta.precio like busqueda 
    or venta.marca like busqueda 
    or venta.kilos like busqueda 
    or venta.cantidad like busqueda 
    or clientes.primernombre like busqueda 
    or clientes.nombrepila like busqueda 
    or clientes.apellido like busqueda 
    or clientes.telefono like busqueda 
    or clientes.calle like busqueda 
    or clientes.calle_numero like busqueda 
    order by venta.fecha DESC;



drop procedure if exists consultaBusqueda;
DELIMITER //
CREATE PROCEDURE consultaBusqueda(busqueda VARCHAR(128))
BEGIN

SELECT busqueda;

select * 
    from venta 
    inner join clientes on clientes.id_cliente = venta.id_cliente 
    where venta.fecha like concat("%", busqueda, "%") 
    or venta.precio like concat("%", busqueda, "%") 
    or venta.marca like concat("%", busqueda, "%") 
    or venta.kilos like concat("%", busqueda, "%") 
    or venta.cantidad like concat("%", busqueda, "%") 
    or clientes.primernombre like concat("%", busqueda, "%") 
    or clientes.nombrepila like concat("%", busqueda, "%") 
    or clientes.apellido like concat("%", busqueda, "%") 
    or clientes.telefono like concat("%", busqueda, "%") 
    or clientes.calle like concat("%", busqueda, "%") 
    or clientes.calle_numero like concat("%", busqueda, "%") 
    order by venta.fecha DESC;
END;
//
DELIMITER ;

call consultaBusqueda("2023");



drop table if exists venta_mascota;
create table venta_mascota(
id_ventamascota integer auto_increment,
id_venta integer,
id_mascota integer,
primary key(id_ventamascota),
CONSTRAINT FK_mascotas FOREIGN KEY (id_mascota) REFERENCES mascotas(id_mascota),
CONSTRAINT FK_venta FOREIGN KEY (id_venta) REFERENCES venta(id_venta)
)engine = innoDB;










