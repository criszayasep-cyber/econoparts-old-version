CREATE TABLE IF NOT EXISTS versiones_tracking(
    id VARCHAR(15) PRIMARY KEY,
    fecha DATETIME
);

--======================================================================================
--Tablas catalogo
--======================================================================================

--combos
CREATE TABLE IF NOT EXISTS venta_movil_combos(
    tipo VARCHAR(15),
    id VARCHAR(15),
    nombre VARCHAR(50),
    foraneo VARCHAR(15)
);

--productos
CREATE TABLE venta_movil_productos (
	pro_number varchar(100)  NOT NULL PRIMARY KEY,
	pro_number_2 varchar(100)  NULL,
	pro_descripcion varchar(250)  NULL,
	pro_grupo_inventario varchar(50)  NULL,
	pro_categoria_id varchar(10)  NULL,
	pro_categoria varchar(100)  NULL,
	pro_sub_categoria_id varchar(10)  NULL,
	pro_sub_categoria varchar(100)  NULL,
	pro_familia_id varchar(10)  NULL,
	pro_familia varchar(100)  NULL,
	pro_anio_rango varchar(15)  NULL,
	pro_anio_inicio int NULL,
	pro_anio_fin int NULL,
	pro_chasis varchar(50)  NULL,
	pro_cilindrada varchar(50)  NULL,
	pro_cilindros varchar(50)  NULL,
	pro_combustible varchar(50)  NULL,
	pro_direccion varchar(50)  NULL,
	pro_marca nvarchar(50)  NULL,
	pro_modelo varchar(100)  NULL,
	pro_motor varchar(50)  NULL,
	pro_parqueo varchar(50)  NULL,
	pro_origin varchar(50)  NULL,
	pro_sistema varchar(50)  NULL,
	pro_tipo varchar(50)  NULL,
	pro_tipo_producto varchar(50)  NULL,
	pro_traccion varchar(50)  NULL,
	pro_transmision varchar(50)  NULL,
	pro_turbo varchar(50)  NULL,
	pro_valvulas varchar(50)  NULL,
	pro_version varchar(50)  NULL,
	pro_vin varchar(50)  NULL,
	pro_fabricante_id varchar(50)  NULL,
	pro_fabricante varchar(50)  NULL
);

--aplicaciones

--equivalentes

--clientes


--======================================================================================
--Tablas sin conexión
--======================================================================================

--gestiones

--inventario

--precios

--promociones