-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS sistema_ventas;
USE sistema_ventas;

-- Tabla de proveedores
CREATE TABLE IF NOT EXISTS proveedores (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    ruc VARCHAR(13) NOT NULL,
    direccion VARCHAR(255),
    telefono VARCHAR(255),
    email VARCHAR(255),
    fecha_creacion datetime(6) NOT NULL,
    fecha_actualizacion datetime(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_proveedor_ruc (ruc)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS clientes (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    identificacion VARCHAR(13) NOT NULL,
    direccion VARCHAR(255),
    telefono VARCHAR(255),
    email VARCHAR(255),
    fecha_creacion datetime(6) NOT NULL,
    fecha_actualizacion datetime(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_cliente_identificacion (identificacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de tiendas
CREATE TABLE IF NOT EXISTS tiendas (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    telefono VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    administrador VARCHAR(255) NOT NULL,
    fecha_creacion datetime(6) NOT NULL,
    fecha_actualizacion datetime(6),
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(38,2) NOT NULL,
    codigo VARCHAR(255) NOT NULL,
    marca VARCHAR(255),
    categoria VARCHAR(255),
    stock INT NOT NULL,
    stock_disponible INT,
    activo BIT(1) NOT NULL,
    proveedor_id BIGINT,
    fecha_creacion datetime(6) NOT NULL,
    fecha_actualizacion datetime(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_producto_codigo (codigo),
    CONSTRAINT fk_producto_proveedor FOREIGN KEY (proveedor_id) REFERENCES proveedores(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de productos por tienda
CREATE TABLE IF NOT EXISTS productos_tienda (
    id BIGINT NOT NULL AUTO_INCREMENT,
    stock_local INT NOT NULL,
    tienda_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    fecha_creacion datetime(6) NOT NULL,
    fecha_actualizacion datetime(6),
    PRIMARY KEY (id),
    KEY idx_productos_tienda_tienda (tienda_id),
    KEY idx_productos_tienda_producto (producto_id),
    CONSTRAINT fk_productos_tienda_tienda FOREIGN KEY (tienda_id) REFERENCES tiendas(id),
    CONSTRAINT fk_productos_tienda_producto FOREIGN KEY (producto_id) REFERENCES productos(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de ventas
CREATE TABLE IF NOT EXISTS ventas (
    id BIGINT NOT NULL AUTO_INCREMENT,
    precio_total DECIMAL(38,2) NOT NULL,
    detalles_json JSON,
    fecha_venta datetime(6) NOT NULL,
    tienda_id BIGINT NOT NULL,
    cliente_id BIGINT NOT NULL,
    fecha_creacion datetime(6) NOT NULL,
    fecha_actualizacion datetime(6),
    PRIMARY KEY (id),
    KEY idx_ventas_cliente (cliente_id),
    KEY idx_ventas_tienda (tienda_id),
    CONSTRAINT fk_ventas_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    CONSTRAINT fk_ventas_tienda FOREIGN KEY (tienda_id) REFERENCES tiendas(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;