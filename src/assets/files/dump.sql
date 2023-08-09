CREATE TABLE IF NOT EXISTS versiones_tracking(
    id VARCHAR(15) PRIMARY KEY,
    fecha DATETIME
);

CREATE TABLE IF NOT EXISTS tracking_tables(
	tabla VARCHAR(100) PRIMARY KEY,
	fecha DATETIME NULL,
	registros int NULL,
	tipo VARCHAR(50) NULL,
	descripcion VARCHAR(100) NULL
);
INSERT OR IGNORE INTO tracking_tables(tabla, fecha, registros, tipo, descripcion) VALUES('venta_movil_combos', null, 0, 'CONEXION', 'Combos de búsqueda en el TAB Catálogo');
INSERT OR IGNORE INTO tracking_tables(tabla, fecha, registros, tipo, descripcion) VALUES('venta_movil_inventario_precios', null, 0, 'CONEXION', 'Inventario y precios de mayoreo');
INSERT OR IGNORE INTO tracking_tables(tabla, fecha, registros, tipo, descripcion) VALUES('venta_movil_equivalentes', null, 0, 'CONEXION', 'Productos equivalentes');
INSERT OR IGNORE INTO tracking_tables(tabla, fecha, registros, tipo, descripcion) VALUES('venta_movil_productos', null, 0, 'CONEXION', 'Productos con precio de mayoreo o clasificación A');
--INSERT OR IGNORE INTO tracking_tables(tabla, fecha, registros, tipo, descripcion) VALUES('venta_movil_imagenes', null, 0, 'CONEXION', 'Imagenes de productos');
INSERT OR IGNORE INTO tracking_tables(tabla, fecha, registros, tipo, descripcion) VALUES('venta_movil_aplicaciones', null, 0, 'CONEXION', 'Aplicaciones de productos');
INSERT OR IGNORE INTO tracking_tables(tabla, fecha, registros, tipo, descripcion) VALUES('venta_movil_clientes', null, 0, 'CONEXION', 'Base de clientes');

INSERT OR IGNORE INTO tracking_tables(tabla, fecha, registros, tipo, descripcion) VALUES('venta_movil_gestiones', null, 0, 'SIN CONEXION', 'Gestiones creadas sin conexión');
INSERT OR IGNORE INTO tracking_tables(tabla, fecha, registros, tipo, descripcion) VALUES('venta_movil_pedidos', null, 0, 'SIN CONEXION', 'Pedidos encabezado creados sin conexión');
INSERT OR IGNORE INTO tracking_tables(tabla, fecha, registros, tipo, descripcion) VALUES('venta_movil_pedidos_detalle', null, 0, 'SIN CONEXION', 'Detalle de pedidos creados sin conexión');
INSERT OR IGNORE INTO tracking_tables(tabla, fecha, registros, tipo, descripcion) VALUES('venta_movil_promociones', null, 0, 'SIN CONEXION', 'Promociones activas');
INSERT OR IGNORE INTO tracking_tables(tabla, fecha, registros, tipo, descripcion) VALUES('venta_movil_promociones_detalle', null, 0, 'SIN CONEXION', 'Detalle de las promociones activas');
INSERT OR IGNORE INTO tracking_tables(tabla, fecha, registros, tipo, descripcion) VALUES('venta_movil_escalas', null, 0, 'SIN CONEXION', 'Escalas de las promociones activas');
INSERT OR IGNORE INTO tracking_tables(tabla, fecha, registros, tipo, descripcion) VALUES('venta_movil_conversiones', null, 0, 'SIN CONEXION', 'Conversiones de producto');
INSERT OR IGNORE INTO tracking_tables(tabla, fecha, registros, tipo, descripcion) VALUES('venta_movil_lista_precios', null, 0, 'SIN CONEXION', 'Listas de precio por promoción y escala');

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
--preciou numeric(10,2) NULL,
--existencia int,

--aplicaciones
CREATE TABLE venta_movil_aplicaciones (
	no varchar(100),
	linea int,
	aplicacion varchar(500),
	noSource varchar(100)
);

--equivalentes
CREATE TABLE venta_movil_equivalentes (
	no varchar(100),
	noSustituto varchar(100)
);

--fotografias
CREATE TABLE venta_movil_imagenes (
	codigo varchar(100),
	imagen text
);

--clientes
CREATE TABLE venta_movil_clientes (
	area_despacho varchar(100),
	celular varchar(100),
	ciudad varchar(100),
	codigo varchar(50),
	codigo_postal varchar(100),
	contacto varchar(100),
	correo varchar(100),
	direccion varchar(200),
	direccion2 varchar(200),
	dui varchar(15),
	giro varchar(100),
	grupo varchar(100),
	grupo_pais varchar(100),
	limite numeric(10,2),
	nit varchar(15),
	nombre_comercial varchar(100),
	nombre_social varchar(100),
	nrc varchar(15),
	pais varchar(15),
	saldo numeric(10,2),
	telefono varchar(50),
	tipo_pago varchar(5),
	vendedor varchar(50)
);

--inventario y precios
CREATE TABLE venta_movil_inventario_precios (
	bodega varchar(10),
	no varchar(100),
	existencia int,
	preciou numeric(10,2),
	medida varchar(100)
);

--======================================================================================
--Tablas sin conexión
--======================================================================================

--gestiones
CREATE TABLE venta_movil_gestiones (
	rde_id numeric(38,0) NULL,
	rde_vendedor_codigo varchar(15) NULL,
	rde_fecha date NULL,
	rde_cliente_codigo varchar(15) NULL,
	rde_tipo varchar(15) NULL,
	rde_visitado int DEFAULT 0 NOT NULL,
	rde_venta int DEFAULT 0 NOT NULL,
	rde_gestion_inicio datetime NULL,
	rde_gestion_fin datetime NULL,
	rde_motivo_no_venta varchar(100) NULL,
	rde_pedido numeric(38,0) NULL
);

--pedidos
CREATE TABLE venta_movil_pedidos (
	ped_id numeric(38,0) NULL,
	ped_fecha_registro datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
	ped_usuario varchar(25) NULL,
	ped_transferido_nav int DEFAULT 0 NOT NULL,
	ped_estado varchar(20) DEFAULT 'EN PROCESO' NULL,
	ped_cliente_correo varchar(100) NULL,
	ped_no varchar(20) NULL,
	ped_cliente_codigo varchar(20) NULL,
	ped_fecha date NULL,
	ped_tipo_pago varchar(10) DEFAULT 'CONTADO' NULL,
	ped_location varchar(10) DEFAULT 'CD2' NULL,
	ped_dimension varchar(20) DEFAULT 'D-CD2' NULL,
	ped_dimension2 varchar(20) DEFAULT 'MAYOREO' NULL,
	ped_vendedor varchar(10) NULL,
	ped_monto decimal(38,20) DEFAULT 0 NULL,
	ped_monto_iva decimal(38,20) DEFAULT 0 NULL,
	ped_cliente_nombre varchar(100) NULL,
	ped_cliente_direccion varchar(200) NULL,
	ped_cliente_direccion2 varchar(200) NULL,
	ped_cliente_dui varchar(15) NULL,
	ped_cliente_nit varchar(15) NULL,
	ped_cliente_comercial varchar(100) NULL,
	ped_cantidad int DEFAULT 0 NULL,
	ped_comentario text NULL,
	ped_telefono varchar(30) NULL,
	ped_ruta varchar(15) NULL,
	ped_dimension_id int NULL,
	ped_celular varchar(30) NULL,
	ped_ubicacion varchar(15) DEFAULT 'CD' NULL,
	ped_ruta_txt varchar(500) DEFAULT 'Seleccionar' NULL,
	ped_sucursal varchar(15) DEFAULT 'Seleccionar' NULL,
	ped_sucursal_txt varchar(50) DEFAULT 'Seleccionar' NULL,
	ped_complemento int DEFAULT 0 NULL,
	ped_comentario_cc text NULL,
	ped_fecha_envio_nav datetime NULL,
	ped_requiere_aut_creditos int NULL,
	ped_online int DEFAULT 0 
);

--pedido detalle
CREATE TABLE venta_movil_pedidos_detalle (
	pde_id numeric(38,0) NULL,
	pde_pedido numeric(38,0) NULL,
	pde_linea int NULL,
	pde_producto varchar(50) NULL,
	pde_descripcion varchar(200) NULL,
	pde_cantidad int NULL,
	pde_precio_unitario numeric(38,2) NULL,
	pde_descuento numeric(38,2) NULL,
	pde_monto numeric(38,2) NULL,
	pde_monto_iva numeric(38,2) NULL,
	pde_unidad_medida varchar(20) NULL,
	pde_estado varchar(25) NULL,
	pde_fecha_creado datetime NULL,
	pde_fecha_eliminado datetime NULL,
	pde_lp_conversion numeric(38,2) DEFAULT 0 NULL,
	pde_lp_aplica_promocion int DEFAULT 0 NULL,
	pde_lp_promocion varchar(100) DEFAULT '' NULL,
	pde_lp_lista varchar(100) DEFAULT '' NULL,
	pde_lp_descuento numeric(38,2) DEFAULT 0 NULL,
	pde_lp_precio_lista numeric(38,2) DEFAULT 0 NULL,
	pde_lp_precio_lista_final numeric(38,2) DEFAULT 0 NULL,
	pde_precio_unitario_final numeric(38,2) DEFAULT 0 NULL
);


--promociones
CREATE TABLE venta_movil_promociones (
	codigo varchar(20),
	nombre varchar(30)
);

--promociones detalle
CREATE TABLE venta_movil_promociones_detalle (
	codigo varchar(20),
	excluido int,
	oferta varchar(20)
);

--escalas
CREATE TABLE venta_movil_escalas (
	minimo decimal(38,20),
	descuento decimal(38,20),
	lista varchar(20),
	grupo varchar(20)
);

--conversiones
CREATE TABLE venta_movil_conversiones (
	producto varchar(20),
	unidad varchar(20),
	conversion decimal(38,20)
);

--listas de precios
CREATE TABLE venta_movil_lista_precios (
	producto varchar(20),
	unidad varchar(20),
	precio decimal(38,20),
	lista varchar(20)
);
