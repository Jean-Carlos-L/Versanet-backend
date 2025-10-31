SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `versanetbd`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id` char(50) NOT NULL,
  `nombres` varchar(255) DEFAULT NULL,
  `cedula` varchar(20) DEFAULT NULL,
  `correo_electronico` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes_planes`
--

CREATE TABLE `clientes_planes` (
  `id` char(50) NOT NULL,
  `idCliente` char(50) DEFAULT NULL,
  `idPlan` char(50) DEFAULT NULL,
  `fecha_inicio` varchar(50) DEFAULT NULL,
  `fecha_fin` varchar(50) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `idRouter` char(50) DEFAULT NULL,
  `idMac` char(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `facturas`
--

CREATE TABLE `facturas` (
  `id` CHAR(50) NOT NULL,
  `idCliente` CHAR(50) NOT NULL,
  `idCliente_Plan` CHAR(50) NOT NULL, 
  `fecha_facturacion` varchar(50) DEFAULT NULL,
  `monto_total` DECIMAL(10, 2) NOT NULL,
  `estado` TINYINT(1) DEFAULT NULL, 
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario`
--

CREATE TABLE `inventario` (
  `id` char(50) NOT NULL,
  `referencia` varchar(255) DEFAULT NULL,
  `mac` varchar(50) DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  `idTipo` char(50) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inventario`
--

INSERT INTO `inventario` (`id`, `referencia`, `mac`, `ip`, `estado`, `idTipo`, `fecha_creacion`, `fecha_actualizacion`) VALUES
('0c3ce12b-b0b4-11ef-be26-10a51d6e3060', '39311', '53523155', '134152233343522312', 0, '1', '2024-12-02 13:48:01', '2024-12-02 13:48:01'),
('7b32031d-b0c4-11ef-a610-10a51d6e3060', 'ABC3555', '532452435', 'no aplica', 0, '2', '2024-12-02 15:45:39', '2024-12-02 16:12:22');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `id` CHAR(50) NOT NULL,
  `idCliente` CHAR(50) NOT NULL, 
  `idFactura` CHAR(50) NOT NULL,
  `metodo_pago` VARCHAR(50) DEFAULT NULL, 
  `fecha_pago` DATETIME DEFAULT NULL,
  `monto_pagado` DECIMAL(10, 2) NOT NULL, 
  `estado` TINYINT(1) DEFAULT NULL, -- 0: pendiente, 1: confirmado
  `fecha_creacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- --------------------------------------------------------

-- 
-- Estructura de tabla para la tabla `permisos`
--

CREATE TABLE `permisos` (
  `id` char(50) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `url` varchar(100) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `permisos`
--

INSERT INTO `permisos` (`id`, `descripcion`, `url`, `estado`, `fecha_creacion`, `fecha_actualizacion`) VALUES
('76b0ed7f-a517-11ef-8ec2-0242ac110002', 'Clientes	', '9f2a7d1e4b6c3a8', 1, '2024-11-18 00:09:26', '2024-11-18 00:14:02'),
('76b0f015-a517-11ef-8ec2-0242ac110002', 'Contratos', '3b8e1a6c9f2d4a7', 1, '2024-11-18 00:09:26', '2024-11-18 00:14:02'),
('76b0f07e-a517-11ef-8ec2-0242ac110002', 'Planes', 'a2d4f1c9e6b8a3f', 1, '2024-11-18 00:09:26', '2024-11-18 00:14:02'),
('76b0f0a2-a517-11ef-8ec2-0242ac110002', 'Facturacion', '7c3e9a2b4f6d8a1', 1, '2024-11-18 00:09:26', '2024-11-18 00:14:02'),
('76b0f0c4-a517-11ef-8ec2-0242ac110002', 'Inventario', '1e6b4a2d9f8c3a7', 1, '2024-11-18 00:09:26', '2024-11-18 00:14:02'),
('76b0f0e5-a517-11ef-8ec2-0242ac110002', 'Historial', 'b4f6c9e2d3a7a1f', 1, '2024-11-18 00:09:26', '2024-11-18 00:14:02'),
('76b0f101-a517-11ef-8ec2-0242ac110002', 'Configuracion', '6c9f2a8d1b3e4a7', 1, '2024-11-18 00:09:26', '2024-11-18 00:14:02'),
('ae7f8a01-a518-11ef-8ec2-0242ac110002', 'Panel de control', 'd1a7c3e4b9f6a2d', 1, '2024-11-18 00:18:09', '2024-11-18 00:18:09');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `planes`
--

CREATE TABLE `planes` (
  `id` char(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `caracteristicas` text DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` char(50) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `descripcion`, `estado`, `fecha_creacion`, `fecha_actualizacion`) VALUES
('1', 'adm', 1, '2024-11-28 03:55:38', '2024-11-28 03:55:38');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles_permisos`
--

CREATE TABLE `roles_permisos` (
  `id` char(50) NOT NULL,
  `idRol` char(50) DEFAULT NULL,
  `idPermiso` char(50) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles_permisos`
--

INSERT INTO `roles_permisos` (`id`, `idRol`, `idPermiso`, `fecha_creacion`, `fecha_actualizacion`) VALUES
('1', '1', '76b0f101-a517-11ef-8ec2-0242ac110002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('2', '1', '76b0ed7f-a517-11ef-8ec2-0242ac110002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('3', '1', '76b0f015-a517-11ef-8ec2-0242ac110002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('4', '1', '76b0f07e-a517-11ef-8ec2-0242ac110002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('5', '1', '76b0f0a2-a517-11ef-8ec2-0242ac110002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('6', '1', '76b0f0c4-a517-11ef-8ec2-0242ac110002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('7', '1', '76b0f0e5-a517-11ef-8ec2-0242ac110002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('8', '1', 'ae7f8a01-a518-11ef-8ec2-0242ac110002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_inventario`
--

CREATE TABLE `tipo_inventario` (
  `id` char(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipo_inventario`
--

INSERT INTO `tipo_inventario` (`id`, `descripcion`, `fecha_creacion`) VALUES
('1', 'router', '2024-11-27 23:21:52'),
('2', 'antenasmac', '2024-11-27 23:21:52');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` char(50) NOT NULL,
  `nombres` varchar(255) DEFAULT NULL,
  `correo_electronico` varchar(255) DEFAULT NULL,
  `contrasena` varchar(255) DEFAULT NULL,
  `idRol` char(50) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombres`, `correo_electronico`, `contrasena`, `idRol`, `estado`, `fecha_creacion`, `fecha_actualizacion`) VALUES
('f902b969-adce-11ef-b403-10a51d6e3060', 'juan', 'juan@gmail.com', '$2b$10$ysowtrIbAX0TJdKaDOgLw.Sd856HaBs4J1mw5HdcJTex917PnG0nG', '1', 1, '2024-11-28 21:23:12', '2024-12-01 15:38:18');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `clientes_planes`
--
ALTER TABLE `clientes_planes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idCliente` (`idCliente`),
  ADD KEY `idPlan` (`idPlan`),
  ADD KEY `clientes_planes_ibfk_3` (`idRouter`),
  ADD KEY `clientes_planes_ibfk_4` (`idMac`);

--
-- Indices de la tabla `facturas`
--
ALTER TABLE `facturas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idCliente` (`idCliente`),
  ADD KEY `idCliente_Plan` (`idCliente_Plan`);

--
-- Indices de la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idTipo` (`idTipo`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idCliente` (`idCliente`),
  ADD KEY `idFactura` (`idFactura`);

--
-- Indices de la tabla `permisos`
--
ALTER TABLE `permisos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `planes`
--
ALTER TABLE `planes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `roles_permisos`
--
ALTER TABLE `roles_permisos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idRol` (`idRol`),
  ADD KEY `idPermiso` (`idPermiso`);

--
-- Indices de la tabla `tipo_inventario`
--
ALTER TABLE `tipo_inventario`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idRol` (`idRol`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `clientes_planes`
--
ALTER TABLE `clientes_planes`
  ADD CONSTRAINT `clientes_planes_ibfk_1` FOREIGN KEY (`idCliente`) REFERENCES `clientes` (`id`),
  ADD CONSTRAINT `clientes_planes_ibfk_2` FOREIGN KEY (`idPlan`) REFERENCES `planes` (`id`),
  ADD CONSTRAINT `clientes_planes_ibfk_3` FOREIGN KEY (`idRouter`) REFERENCES `inventario` (`id`),
  ADD CONSTRAINT `clientes_planes_ibfk_4` FOREIGN KEY (`idMac`) REFERENCES `inventario` (`id`);

--
-- Filtros para la tabla `facturas`
--
ALTER TABLE `facturas`
  ADD CONSTRAINT `facturas_ibfk_1` FOREIGN KEY (`idCliente`) REFERENCES `clientes` (`id`),
  ADD CONSTRAINT `facturas_ibfk_2` FOREIGN KEY (`idCliente_Plan`) REFERENCES `clientes_planes` (`id`);

-- Filtros para la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD CONSTRAINT `inventario_ibfk_1` FOREIGN KEY (`idTipo`) REFERENCES `tipo_inventario` (`id`);

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `pagos_ibfk_2` FOREIGN KEY (`idCliente`) REFERENCES `clientes` (`id`),
  ADD CONSTRAINT `pagos_ibfk_3` FOREIGN KEY (`idFactura`) REFERENCES `facturas` (`id`);

--
-- Filtros para la tabla `roles_permisos`
--
ALTER TABLE `roles_permisos`
  ADD CONSTRAINT `roles_permisos_ibfk_1` FOREIGN KEY (`idRol`) REFERENCES `roles` (`id`),
  ADD CONSTRAINT `roles_permisos_ibfk_2` FOREIGN KEY (`idPermiso`) REFERENCES `permisos` (`id`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`idRol`) REFERENCES `roles` (`id`);

-- 
-- Tablas de historial
--

-- History table for clientes
CREATE TABLE `historial_clientes` (
  `historial_id` CHAR(50) NOT NULL,
  `id` CHAR(50) NOT NULL,
  `nombres` VARCHAR(255) DEFAULT NULL,
  `cedula` VARCHAR(20) DEFAULT NULL,
  `correo_electronico` VARCHAR(255) DEFAULT NULL,
  `telefono` VARCHAR(20) DEFAULT NULL,
  `direccion` VARCHAR(255) DEFAULT NULL,
  `estado` TINYINT(1) DEFAULT NULL,
  `fecha_creacion` TIMESTAMP NULL DEFAULT NULL,
  `fecha_actualizacion` TIMESTAMP NULL DEFAULT NULL,
  `accion` VARCHAR(10) NOT NULL,
  `fecha_cambio` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`historial_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- History table for clientes_planes
CREATE TABLE `historial_clientes_planes` (
  `historial_id` CHAR(50) NOT NULL,
  `id` CHAR(50) NOT NULL,
  `idCliente` CHAR(50) DEFAULT NULL,
  `idPlan` CHAR(50) DEFAULT NULL,
  `fecha_inicio` VARCHAR(50) DEFAULT NULL,
  `fecha_fin` VARCHAR(50) DEFAULT NULL,
  `estado` TINYINT(1) DEFAULT NULL,
  `fecha_creacion` TIMESTAMP NULL DEFAULT NULL,
  `fecha_actualizacion` TIMESTAMP NULL DEFAULT NULL,
  `idRouter` CHAR(50) DEFAULT NULL,
  `idMac` CHAR(50) DEFAULT NULL,
  `accion` VARCHAR(10) NOT NULL,
  `fecha_cambio` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`historial_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- History table for facturas
CREATE TABLE `historial_facturas` (
  `historial_id` CHAR(50) NOT NULL,
  `id` CHAR(50) NOT NULL,
  `idCliente` CHAR(50) NOT NULL,
  `idCliente_Plan` CHAR(50) NOT NULL,
  `fecha_facturacion` VARCHAR(50) DEFAULT NULL,
  `monto_total` DECIMAL(10,2) NOT NULL,
  `estado` TINYINT(1) DEFAULT NULL,
  `fecha_creacion` TIMESTAMP NULL DEFAULT NULL,
  `fecha_actualizacion` TIMESTAMP NULL DEFAULT NULL,
  `accion` VARCHAR(10) NOT NULL,
  `fecha_cambio` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`historial_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- History table for inventario
CREATE TABLE `historial_inventario` (
  `historial_id` CHAR(50) NOT NULL,
  `id` CHAR(50) NOT NULL,
  `referencia` VARCHAR(255) DEFAULT NULL,
  `mac` VARCHAR(50) DEFAULT NULL,
  `ip` VARCHAR(50) DEFAULT NULL,
  `estado` TINYINT(1) DEFAULT NULL,
  `idTipo` CHAR(50) DEFAULT NULL,
  `fecha_creacion` TIMESTAMP NULL DEFAULT NULL,
  `fecha_actualizacion` TIMESTAMP NULL DEFAULT NULL,
  `accion` VARCHAR(10) NOT NULL,
  `fecha_cambio` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`historial_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- History table for pagos
CREATE TABLE `historial_pagos` (
  `historial_id` CHAR(50) NOT NULL,
  `id` CHAR(50) NOT NULL,
  `idCliente` CHAR(50) NOT NULL,
  `idFactura` CHAR(50) NOT NULL,
  `metodo_pago` VARCHAR(50) DEFAULT NULL,
  `fecha_pago` DATETIME DEFAULT NULL,
  `monto_pagado` DECIMAL(10,2) NOT NULL,
  `estado` TINYINT(1) DEFAULT NULL,
  `fecha_creacion` TIMESTAMP NULL DEFAULT NULL,
  `fecha_actualizacion` TIMESTAMP NULL DEFAULT NULL,
  `accion` VARCHAR(10) NOT NULL,
  `fecha_cambio` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`historial_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- History table for permisos
CREATE TABLE `historial_permisos` (
  `historial_id` CHAR(50) NOT NULL,
  `id` CHAR(50) NOT NULL,
  `descripcion` TEXT DEFAULT NULL,
  `url` VARCHAR(100) DEFAULT NULL,
  `estado` TINYINT(1) DEFAULT NULL,
  `fecha_creacion` TIMESTAMP NULL DEFAULT NULL,
  `fecha_actualizacion` TIMESTAMP NULL DEFAULT NULL,
  `accion` VARCHAR(10) NOT NULL,
  `fecha_cambio` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`historial_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- History table for planes
CREATE TABLE `historial_planes` (
  `historial_id` CHAR(50) NOT NULL,
  `id` CHAR(50) NOT NULL,
  `descripcion` VARCHAR(255) DEFAULT NULL,
  `caracteristicas` TEXT DEFAULT NULL,
  `precio` DECIMAL(10,2) DEFAULT NULL,
  `estado` TINYINT(1) DEFAULT NULL,
  `fecha_creacion` TIMESTAMP NULL DEFAULT NULL,
  `fecha_actualizacion` TIMESTAMP NULL DEFAULT NULL,
  `accion` VARCHAR(10) NOT NULL,
  `fecha_cambio` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`historial_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- History table for roles
CREATE TABLE `historial_roles` (
  `historial_id` CHAR(50) NOT NULL,
  `id` CHAR(50) NOT NULL,
  `descripcion` TEXT DEFAULT NULL,
  `estado` TINYINT(1) DEFAULT NULL,
  `fecha_creacion` TIMESTAMP NULL DEFAULT NULL,
  `fecha_actualizacion` TIMESTAMP NULL DEFAULT NULL,
  `accion` VARCHAR(10) NOT NULL,
  `fecha_cambio` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`historial_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- History table for roles_permisos
CREATE TABLE `historial_roles_permisos` (
  `historial_id` CHAR(50) NOT NULL,
  `id` CHAR(50) NOT NULL,
  `idRol` CHAR(50) DEFAULT NULL,
  `idPermiso` CHAR(50) DEFAULT NULL,
  `fecha_creacion` TIMESTAMP NULL DEFAULT NULL,
  `fecha_actualizacion` TIMESTAMP NULL DEFAULT NULL,
  `accion` VARCHAR(10) NOT NULL,
  `fecha_cambio` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`historial_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- History table for tipo_inventario
CREATE TABLE `historial_tipo_inventario` (
  `historial_id` CHAR(50) NOT NULL,
  `id` CHAR(50) NOT NULL,
  `descripcion` VARCHAR(255) DEFAULT NULL,
  `fecha_creacion` TIMESTAMP NULL DEFAULT NULL,
  `accion` VARCHAR(10) NOT NULL,
  `fecha_cambio` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`historial_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- History table for usuarios
CREATE TABLE `historial_usuarios` (
  `historial_id` CHAR(50) NOT NULL,
  `id` CHAR(50) NOT NULL,
  `nombres` VARCHAR(255) DEFAULT NULL,
  `correo_electronico` VARCHAR(255) DEFAULT NULL,
  `contrasena` VARCHAR(255) DEFAULT NULL,
  `idRol` CHAR(50) DEFAULT NULL,
  `estado` TINYINT(1) DEFAULT NULL,
  `fecha_creacion` TIMESTAMP NULL DEFAULT NULL,
  `fecha_actualizacion` TIMESTAMP NULL DEFAULT NULL,
  `accion` VARCHAR(10) NOT NULL,
  `fecha_cambio` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`historial_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- General history table for all entities
CREATE TABLE `historial_general` (
  `historial_id` CHAR(50) NOT NULL,
  `entidad` VARCHAR(50) NOT NULL,
  `accion` VARCHAR(10) NOT NULL,
  `id_entidad` CHAR(50) NOT NULL,
  `mensaje` TEXT NOT NULL,
  `fecha_cambio` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`historial_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Triggers for history tables
--

DELIMITER //

-- Triggers for clientes
CREATE TRIGGER historial_clientes_insert
AFTER INSERT ON clientes
FOR EACH ROW
BEGIN
    INSERT INTO historial_clientes (
        historial_id, id, nombres, cedula, correo_electronico, telefono, direccion, estado, fecha_creacion, fecha_actualizacion, accion, fecha_cambio
    )
    VALUES (
        UUID(), NEW.id, NEW.nombres, NEW.cedula, NEW.correo_electronico, NEW.telefono, NEW.direccion, NEW.estado, NEW.fecha_creacion, NEW.fecha_actualizacion, 'INSERT', CURRENT_TIMESTAMP
    );

    INSERT INTO historial_general (
        historial_id, entidad, accion, id_entidad, mensaje, fecha_cambio
    )
    VALUES (
        UUID(), 'clientes', 'INSERT', NEW.id, CONCAT('Se insertó un nuevo cliente: ', COALESCE(NEW.nombres, 'N/A')), CURRENT_TIMESTAMP
    );
END//

CREATE TRIGGER historial_clientes_update
AFTER UPDATE ON clientes
FOR EACH ROW
BEGIN
    INSERT INTO historial_clientes (
        historial_id, id, nombres, cedula, correo_electronico, telefono, direccion, estado, fecha_creacion, fecha_actualizacion, accion, fecha_cambio
    )
    VALUES (
        UUID(), OLD.id, OLD.nombres, OLD.cedula, OLD.correo_electronico, OLD.telefono, OLD.direccion, OLD.estado, OLD.fecha_creacion, OLD.fecha_actualizacion, 'UPDATE', CURRENT_TIMESTAMP
    );

    INSERT INTO historial_general (
        historial_id, entidad, accion, id_entidad, mensaje, fecha_cambio
    )
    VALUES (
        UUID(), 'clientes', 'UPDATE', OLD.id, CONCAT('Se actualizó el cliente: ', COALESCE(OLD.nombres, 'N/A')), CURRENT_TIMESTAMP
    );
END//

CREATE TRIGGER historial_clientes_delete
AFTER DELETE ON clientes
FOR EACH ROW
BEGIN
    INSERT INTO historial_clientes (
        historial_id, id, nombres, cedula, correo_electronico, telefono, direccion, estado, fecha_creacion, fecha_actualizacion, accion, fecha_cambio
    )
    VALUES (
        UUID(), OLD.id, OLD.nombres, OLD.cedula, OLD.correo_electronico, OLD.telefono, OLD.direccion, OLD.estado, OLD.fecha_creacion, OLD.fecha_actualizacion, 'DELETE', CURRENT_TIMESTAMP
    );

    INSERT INTO historial_general (
        historial_id, entidad, accion, id_entidad, mensaje, fecha_cambio
    )
    VALUES (
        UUID(), 'clientes', 'DELETE', OLD.id, CONCAT('Se eliminó el cliente: ', COALESCE(OLD.nombres, 'N/A')), CURRENT_TIMESTAMP
    );
END//

-- Triggers for clientes_planes
CREATE TRIGGER historial_clientes_planes_insert
AFTER INSERT ON clientes_planes
FOR EACH ROW
BEGIN
    INSERT INTO historial_clientes_planes (
        historial_id, id, idCliente, idPlan, fecha_inicio, fecha_fin, estado, fecha_creacion, fecha_actualizacion, idRouter, idMac, accion, fecha_cambio
    )
    VALUES (
        UUID(), NEW.id, NEW.idCliente, NEW.idPlan, NEW.fecha_inicio, NEW.fecha_fin, NEW.estado, NEW.fecha_creacion, NEW.fecha_actualizacion, NEW.idRouter, NEW.idMac, 'INSERT', CURRENT_TIMESTAMP
    );

    INSERT INTO historial_general (
        historial_id, entidad, accion, id_entidad, mensaje, fecha_cambio
    )
    VALUES (
        UUID(), 'clientes_planes', 'INSERT', NEW.id, CONCAT('Se insertó un nuevo cliente-plan con idCliente: ', COALESCE(NEW.idCliente, 'N/A')), CURRENT_TIMESTAMP
    );
END//

CREATE TRIGGER historial_clientes_planes_update
AFTER UPDATE ON clientes_planes
FOR EACH ROW
BEGIN
    INSERT INTO historial_clientes_planes (
        historial_id, id, idCliente, idPlan, fecha_inicio, fecha_fin, estado, fecha_creacion, fecha_actualizacion, idRouter, idMac, accion, fecha_cambio
    )
    VALUES (
        UUID(), OLD.id, OLD.idCliente, OLD.idPlan, OLD.fecha_inicio, OLD.fecha_fin, OLD.estado, OLD.fecha_creacion, OLD.fecha_actualizacion, OLD.idRouter, OLD.idMac, 'UPDATE', CURRENT_TIMESTAMP
    );

    INSERT INTO historial_general (
        historial_id, entidad, accion, id_entidad, mensaje, fecha_cambio
    )
    VALUES (
        UUID(), 'clientes_planes', 'UPDATE', OLD.id, CONCAT('Se actualizó el cliente-plan con idCliente: ', COALESCE(OLD.idCliente, 'N/A')), CURRENT_TIMESTAMP
    );
END//

CREATE TRIGGER historial_clientes_planes_delete
AFTER DELETE ON clientes_planes
FOR EACH ROW
BEGIN
    INSERT INTO historial_clientes_planes (
        historial_id, id, idCliente, idPlan, fecha_inicio, fecha_fin, estado, fecha_creacion, fecha_actualizacion, idRouter, idMac, accion, fecha_cambio
    )
    VALUES (
        UUID(), OLD.id, OLD.idCliente, OLD.idPlan, OLD.fecha_inicio, OLD.fecha_fin, OLD.estado, OLD.fecha_creacion, OLD.fecha_actualizacion, OLD.idRouter, OLD.idMac, 'DELETE', CURRENT_TIMESTAMP
    );

    INSERT INTO historial_general (
        historial_id, entidad, accion, id_entidad, mensaje, fecha_cambio
    )
    VALUES (
        UUID(), 'clientes_planes', 'DELETE', OLD.id, CONCAT('Se eliminó el cliente-plan con idCliente: ', COALESCE(OLD.idCliente, 'N/A')), CURRENT_TIMESTAMP
    );
END//

-- Triggers for facturas
CREATE TRIGGER historial_facturas_insert
AFTER INSERT ON facturas
FOR EACH ROW
BEGIN
    INSERT INTO historial_facturas (
        historial_id, id, idCliente, idCliente_Plan, fecha_facturacion, monto_total, estado, fecha_creacion, fecha_actualizacion, accion, fecha_cambio
    )
    VALUES (
        UUID(), NEW.id, NEW.idCliente, NEW.idCliente_Plan, NEW.fecha_facturacion, NEW.monto_total, NEW.estado, NEW.fecha_creacion, NEW.fecha_actualizacion, 'INSERT', CURRENT_TIMESTAMP
    );

    INSERT INTO historial_general (
        historial_id, entidad, accion, id_entidad, mensaje, fecha_cambio
    )
    VALUES (
        UUID(), 'facturas', 'INSERT', NEW.id, CONCAT('Se insertó una nueva factura con idCliente: ', COALESCE(NEW.idCliente, 'N/A')), CURRENT_TIMESTAMP
    );
END//

CREATE TRIGGER historial_facturas_update
AFTER UPDATE ON facturas
FOR EACH ROW
BEGIN
    INSERT INTO historial_facturas (
        historial_id, id, idCliente, idCliente_Plan, fecha_facturacion, monto_total, estado, fecha_creacion, fecha_actualizacion, accion, fecha_cambio
    )
    VALUES (
        UUID(), OLD.id, OLD.idCliente, OLD.idCliente_Plan, OLD.fecha_facturacion, OLD.monto_total, OLD.estado, OLD.fecha_creacion, OLD.fecha_actualizacion, 'UPDATE', CURRENT_TIMESTAMP
    );

    INSERT INTO historial_general (
        historial_id, entidad, accion, id_entidad, mensaje, fecha_cambio
    )
    VALUES (
        UUID(), 'facturas', 'UPDATE', OLD.id, CONCAT('Se actualizó la factura con idCliente: ', COALESCE(OLD.idCliente, 'N/A')), CURRENT_TIMESTAMP
    );
END//

CREATE TRIGGER historial_facturas_delete
AFTER DELETE ON facturas
FOR EACH ROW
BEGIN
    INSERT INTO historial_facturas (
        historial_id, id, idCliente, idCliente_Plan, fecha_facturacion, monto_total, estado, fecha_creacion, fecha_actualizacion, accion, fecha_cambio
    )
    VALUES (
        UUID(), OLD.id, OLD.idCliente, OLD.idCliente_Plan, OLD.fecha_facturacion, OLD.monto_total, OLD.estado, OLD.fecha_creacion, OLD.fecha_actualizacion, 'DELETE', CURRENT_TIMESTAMP
    );

    INSERT INTO historial_general (
        historial_id, entidad, accion, id_entidad, mensaje, fecha_cambio
    )
    VALUES (
        UUID(), 'facturas', 'DELETE', OLD.id, CONCAT('Se eliminó la factura con idCliente: ', COALESCE(OLD.idCliente, 'N/A')), CURRENT_TIMESTAMP
    );
END//

-- Triggers for inventario
CREATE TRIGGER historial_inventario_insert
AFTER INSERT ON inventario
FOR EACH ROW
BEGIN
    INSERT INTO historial_inventario (
        historial_id, id, referencia, mac, ip, estado, idTipo, fecha_creacion, fecha_actualizacion, accion, fecha_cambio
    )
    VALUES (
        UUID(), NEW.id, NEW.referencia, NEW.mac, NEW.ip, NEW.estado, NEW.idTipo, NEW.fecha_creacion, NEW.fecha_actualizacion, 'INSERT', CURRENT_TIMESTAMP
    );

    INSERT INTO historial_general (
        historial_id, entidad, accion, id_entidad, mensaje, fecha_cambio
    )
    VALUES (
        UUID(), 'inventario', 'INSERT', NEW.id, CONCAT('Se insertó un nuevo item en inventario: ', COALESCE(NEW.referencia, 'N/A')), CURRENT_TIMESTAMP
    );
END//

CREATE TRIGGER historial_inventario_update
AFTER UPDATE ON inventario
FOR EACH ROW
BEGIN
    INSERT INTO historial_inventario (
        historial_id, id, referencia, mac, ip, estado, idTipo, fecha_creacion, fecha_actualizacion, accion, fecha_cambio
    )
    VALUES (
        UUID(), OLD.id, OLD.referencia, OLD.mac, OLD.ip, OLD.estado, OLD.idTipo, OLD.fecha_creacion, OLD.fecha_actualizacion, 'UPDATE', CURRENT_TIMESTAMP
    );

    INSERT INTO historial_general (
        historial_id, entidad, accion, id_entidad, mensaje, fecha_cambio
    )
    VALUES (
        UUID(), 'inventario', 'UPDATE', OLD.id, CONCAT('Se actualizó el item en inventario: ', COALESCE(OLD.referencia, 'N/A')), CURRENT_TIMESTAMP
    );
END//

CREATE TRIGGER historial_inventario_delete
AFTER DELETE ON inventario
FOR EACH ROW
BEGIN
    INSERT INTO historial_inventario (
        historial_id, id, referencia, mac, ip, estado, idTipo, fecha_creacion, fecha_actualizacion, accion, fecha_cambio
    )
    VALUES (
        UUID(), OLD.id, OLD.referencia, OLD.mac, OLD.ip, OLD.estado, OLD.idTipo, OLD.fecha_creacion, OLD.fecha_actualizacion, 'DELETE', CURRENT_TIMESTAMP
    );

    INSERT INTO historial_general (
        historial_id, entidad, accion, id_entidad, mensaje, fecha_cambio
    )
    VALUES (
        UUID(), 'inventario', 'DELETE', OLD.id, CONCAT('Se eliminó el item en inventario: ', COALESCE(OLD.referencia, 'N/A')), CURRENT_TIMESTAMP
    );
END//

-- Triggers for pagos
CREATE TRIGGER historial_pagos_insert
AFTER INSERT ON pagos
FOR EACH ROW
BEGIN
    INSERT INTO historial_pagos (
        historial_id, id, idCliente, idFactura, metodo_pago, fecha_pago, monto_pagado, estado, fecha_creacion, fecha_actualizacion, accion, fecha_cambio
    )
    VALUES (
        UUID(), NEW.id, NEW.idCliente, NEW.idFactura, NEW.metodo_pago, NEW.fecha_pago, NEW.monto_pagado, NEW.estado, NEW.fecha_creacion, NEW.fecha_actualizacion, 'INSERT', CURRENT_TIMESTAMP
    );

    INSERT INTO historial_general (
        historial_id, entidad, accion, id_entidad, mensaje, fecha_cambio
    )
    VALUES (
        UUID(), 'pagos', 'INSERT', NEW.id, CONCAT('Se insertó un nuevo pago con idCliente: ', COALESCE(NEW.idCliente, 'N/A')), CURRENT_TIMESTAMP
    );
END//

CREATE TRIGGER historial_pagos_update
AFTER UPDATE ON pagos
FOR EACH ROW
BEGIN
    INSERT INTO historial_pagos (
        historial_id, id, idCliente, idFactura, metodo_pago, fecha_pago, monto_pagado, estado, fecha_creacion, fecha_actualizacion, accion, fecha_cambio
    )
    VALUES (
        UUID(), OLD.id, OLD.idCliente, OLD.idFactura, OLD.metodo_pago, OLD.fecha_pago, OLD.monto_pagado, OLD.estado, OLD.fecha_creacion, OLD.fecha_actualizacion, 'UPDATE', CURRENT_TIMESTAMP
    );

    INSERT INTO historial_general (
        historial_id, entidad, accion, id_entidad, mensaje, fecha_cambio
    )
    VALUES (
        UUID(), 'pagos', 'UPDATE', OLD.id, CONCAT('Se actualizó el pago con idCliente: ', COALESCE(OLD.idCliente, 'N/A')), CURRENT_TIMESTAMP
    );
END//

CREATE TRIGGER historial_pagos_delete
AFTER DELETE ON pagos
FOR EACH ROW
BEGIN
    INSERT INTO historial_pagos (
        historial_id, id, idCliente, idFactura, metodo_pago, fecha_pago, monto_pagado, estado, fecha_creacion, fecha_actualizacion, accion, fecha_cambio
    )
    VALUES (
        UUID(), OLD.id, OLD.idCliente, OLD.idFactura, OLD.metodo_pago, OLD.fecha_pago, OLD.monto_pagado, OLD.estado, OLD.fecha_creacion, OLD.fecha_actualizacion, 'DELETE', CURRENT_TIMESTAMP
    );

    INSERT INTO historial_general (
        historial_id, entidad, accion, id_entidad, mensaje, fecha_cambio
    )
    VALUES (
        UUID(), 'pagos', 'DELETE', OLD.id, CONCAT('Se eliminó el pago con idCliente: ', COALESCE(OLD.idCliente, 'N/A')), CURRENT_TIMESTAMP
    );
END//

-- Triggers for permisos
CREATE TRIGGER historial_permisos_insert
AFTER INSERT ON permisos
FOR EACH ROW
BEGIN
    INSERT INTO historial_permisos (
        historial_id, id, descripcion, url, estado, fecha_creacion, fecha_actualizacion, accion, fecha_cambio
    )
    VALUES (
        UUID(), NEW.id, NEW.descripcion, NEW.url, NEW.estado, NEW.fecha_creacion, NEW.fecha_actualizacion, 'INSERT', CURRENT_TIMESTAMP
    );

    INSERT INTO historial_general (
        historial_id, entidad, accion, id_entidad, mensaje, fecha_cambio
    )
    VALUES (
        UUID(), 'permisos', 'INSERT', NEW.id, CONCAT('Se insertó un nuevo permiso: ', COALESCE(NEW.descripcion, 'N/A')), CURRENT_TIMESTAMP
    );
END//

CREATE TRIGGER historial_permisos_update
AFTER UPDATE ON permisos
FOR EACH ROW
BEGIN
    INSERT INTO historial_permisos (
        historial_id, id, descripcion, url, estado, fecha_creacion, fecha_actualizacion, accion, fecha_cambio
    )
    VALUES (
        UUID(), OLD.id, OLD.descripcion, OLD.url, OLD.estado, OLD.fecha_creacion, OLD.fecha_actualizacion, 'UPDATE', CURRENT_TIMESTAMP
    );

    INSERT INTO historial_general (
        historial_id, entidad, accion, id_entidad, mensaje, fecha_cambio
    )
    VALUES (
        UUID(), 'permisos', 'UPDATE', OLD.id, CONCAT('Se actualizó el permiso: ', COALESCE(OLD.descripcion, 'N/A')), CURRENT_TIMESTAMP
    );
END//

CREATE TRIGGER historial_permisos_delete
AFTER DELETE ON permisos
FOR EACH ROW
BEGIN
    INSERT INTO historial_permisos (
        historial_id, id, descripcion, url, estado, fecha_creacion, fecha_actualizacion, accion, fecha_cambio
    )
    VALUES (
        UUID(), OLD.id, OLD.descripcion, OLD.url, OLD.estado, OLD.fecha_creacion, OLD.fecha_actualizacion, 'DELETE', CURRENT_TIMESTAMP
    );

    INSERT INTO historial_general (
        historial_id, entidad, accion, id_entidad, mensaje, fecha_cambio
    )
    VALUES (
        UUID(), 'permisos', 'DELETE', OLD.id, CONCAT('Se eliminó el permiso: ', COALESCE(OLD.descripcion, 'N/A')), CURRENT_TIMESTAMP
    );
END//

-- Triggers for planes
CREATE TRIGGER historial_planes_insert
AFTER INSERT ON planes
FOR EACH ROW
BEGIN
    INSERT INTO historial_planes (
        historial_id, id, descripcion, caracteristicas, precio, estado, fecha_creacion, fecha_actualizacion, accion, fecha_cambio
    )
    VALUES (
        UUID(), NEW.id, NEW.descripcion, NEW.caracteristicas, NEW.precio, NEW.estado, NEW.fecha_creacion, NEW.fecha_actualizacion, 'INSERT', CURRENT_TIMESTAMP
    );

    INSERT INTO historial_general (
        historial_id, entidad, accion, id_entidad, mensaje, fecha_cambio
    )
    VALUES (
        UUID(), 'planes', 'INSERT', NEW.id, CONCAT('Se insertó un nuevo plan: ', COALESCE(NEW.descripcion, 'N/A')), CURRENT_TIMESTAMP
    );
END//

CREATE TRIGGER historial_planes_update
AFTER UPDATE ON planes
FOR EACH ROW
BEGIN
    INSERT INTO historial_planes (
        historial_id, id, descripcion, caracteristicas, precio, estado, fecha_creacion, fecha_actualizacion, accion, fecha_cambio
    )
    VALUES (
        UUID(), OLD.id, OLD.descripcion, OLD.caracteristicas, OLD.precio, OLD.estado, OLD.fecha_creacion, OLD.fecha_actualizacion, 'UPDATE', CURRENT_TIMESTAMP
    );

    INSERT INTO historial_general (
        historial_id, entidad, accion, id_entidad, mensaje, fecha_cambio
    )
    VALUES (
        UUID(), 'planes', 'UPDATE', OLD.id, CONCAT('Se actualizó el plan: ', COALESCE(OLD.descripcion, 'N/A')), CURRENT_TIMESTAMP
    );
END//

CREATE TRIGGER historial_planes_delete
AFTER DELETE ON planes
FOR EACH ROW
BEGIN
    INSERT INTO historial_planes (
        historial_id, id, descripcion, caracteristicas, precio, estado, fecha_creacion, fecha_actualizacion, accion, fecha_cambio
    )
    VALUES (
        UUID(), OLD.id, OLD.descripcion, OLD.caracteristicas, OLD.precio, OLD.estado, OLD.fecha_creacion, OLD.fecha_actualizacion, 'DELETE', CURRENT_TIMESTAMP
    );

    INSERT INTO historial_general (
        historial_id, entidad, accion, id_entidad, mensaje, fecha_cambio
    )
    VALUES (
        UUID(), 'planes', 'DELETE', OLD.id, CONCAT('Se eliminó el plan: ', COALESCE(OLD.descripcion, 'N/A')), CURRENT_TIMESTAMP
    );
END//

-- Triggers for roles
CREATE TRIGGER historial_roles_insert
AFTER INSERT ON roles
FOR EACH ROW
BEGIN
    INSERT INTO historial_roles (
        historial_id, id, descripcion, estado, fecha_creacion, fecha_actualizacion, accion, fecha_cambio
    )
    VALUES (
        UUID(), NEW.id, NEW.descripcion, NEW.estado, NEW.fecha_creacion, NEW.fecha_actualizacion, 'INSERT', CURRENT_TIMESTAMP
    );

    INSERT INTO historial_general (
        historial_id, entidad, accion, id_entidad, mensaje, fecha_cambio
    )
    VALUES (
        UUID(), 'roles', 'INSERT', NEW.id, CONCAT('Se insertó un nuevo rol: ', COALESCE(NEW.descripcion, 'N/A')), CURRENT_TIMESTAMP
    );
END//

CREATE TRIGGER historial_roles_update
AFTER UPDATE ON roles
FOR EACH ROW
BEGIN
    INSERT INTO historial_roles (
        historial_id, id, descripcion, estado, fecha_creacion, fecha_actualizacion, accion, fecha_cambio
    )
    VALUES (
        UUID(), OLD.id, OLD.descripcion, OLD.estado, OLD.fecha_creacion, OLD.fecha_actualizacion, 'UPDATE', CURRENT_TIMESTAMP
    );

    INSERT INTO historial_general (
        historial_id, entidad, accion, id_entidad, mensaje, fecha_cambio
    )
    VALUES (
        UUID(), 'roles', 'UPDATE', OLD.id, CONCAT('Se actualizó el rol: ', COALESCE(OLD.descripcion, 'N/A')), CURRENT_TIMESTAMP
    );
END//

CREATE TRIGGER historial_roles_delete
AFTER DELETE ON roles
FOR EACH ROW
BEGIN
    INSERT INTO historial_roles (
        historial_id, id, descripcion, estado, fecha_creacion, fecha_actualizacion, accion, fecha_cambio
    )
    VALUES (
        UUID(), OLD.id, OLD.descripcion, OLD.estado, OLD.fecha_creacion, OLD.fecha_actualizacion, 'DELETE', CURRENT_TIMESTAMP
    );

    INSERT INTO historial_general (
        historial_id, entidad, accion, id_entidad, mensaje, fecha_cambio
    )
    VALUES (
        UUID(), 'roles', 'DELETE', OLD.id, CONCAT('Se eliminó el rol: ', COALESCE(OLD.descripcion, 'N/A')), CURRENT_TIMESTAMP
    );
END//

-- Triggers for roles_permisos
CREATE TRIGGER historial_roles_permisos_insert
AFTER INSERT ON roles_permisos
FOR EACH ROW
BEGIN
    INSERT INTO historial_roles_permisos (
        historial_id, id, idRol, idPermiso, fecha_creacion, fecha_actualizacion, accion, fecha_cambio
    )
    VALUES (
        UUID(), NEW.id, NEW.idRol, NEW.idPermiso, NEW.fecha_creacion, NEW.fecha_actualizacion, 'INSERT', CURRENT_TIMESTAMP
    );

    INSERT INTO historial_general (
        historial_id, entidad, accion, id_entidad, mensaje, fecha_cambio
    )
    VALUES (
        UUID(), 'roles_permisos', 'INSERT', NEW.id, CONCAT('Se insertó un nuevo rol-permiso con idRol: ', COALESCE(NEW.idRol, 'N/A')), CURRENT_TIMESTAMP
    );
END//

CREATE TRIGGER historial_roles_permisos_update
AFTER UPDATE ON roles_permisos
FOR EACH ROW
BEGIN
    INSERT INTO historial_roles_permisos (
        historial_id, id, idRol, idPermiso, fecha_creacion, fecha_actualizacion, accion, fecha_cambio
    )
    VALUES (
        UUID(), OLD.id, OLD.idRol, OLD.idPermiso, OLD.fecha_creacion, OLD.fecha_actualizacion, 'UPDATE', CURRENT_TIMESTAMP
    );

    INSERT INTO historial_general (
        historial_id, entidad, accion, id_entidad, mensaje, fecha_cambio
    )
    VALUES (
        UUID(), 'roles_permisos', 'UPDATE', OLD.id, CONCAT('Se actualizó el rol-permiso con idRol: ', COALESCE(OLD.idRol, 'N/A')), CURRENT_TIMESTAMP
    );
END//

CREATE TRIGGER historial_roles_permisos_delete
AFTER DELETE ON roles_permisos
FOR EACH ROW
BEGIN
    INSERT INTO historial_roles_permisos (
        historial_id, id, idRol, idPermiso, fecha_creacion, fecha_actualizacion, accion, fecha_cambio
    )
    VALUES (
        UUID(), OLD.id, OLD.idRol, OLD.idPermiso, OLD.fecha_creacion, OLD.fecha_actualizacion, 'DELETE', CURRENT_TIMESTAMP
    );

    INSERT INTO historial_general (
        historial_id, entidad, accion, id_entidad, mensaje, fecha_cambio
    )
    VALUES (
        UUID(), 'roles_permisos', 'DELETE', OLD.id, CONCAT('Se eliminó el rol-permiso con idRol: ', COALESCE(OLD.idRol, 'N/A')), CURRENT_TIMESTAMP
    );
END//

-- Triggers for tipo_inventario
CREATE TRIGGER historial_tipo_inventario_insert
AFTER INSERT ON tipo_inventario
FOR EACH ROW
BEGIN
    INSERT INTO historial_tipo_inventario (
        historial_id, id, descripcion, fecha_creacion, accion, fecha_cambio
    )
    VALUES (
        UUID(), NEW.id, NEW.descripcion, NEW.fecha_creacion, 'INSERT', CURRENT_TIMESTAMP
    );

    INSERT INTO historial_general (
        historial_id, entidad, accion, id_entidad, mensaje, fecha_cambio
    )
    VALUES (
        UUID(), 'tipo_inventario', 'INSERT', NEW.id, CONCAT('Se insertó un nuevo tipo de inventario: ', COALESCE(NEW.descripcion, 'N/A')), CURRENT_TIMESTAMP
    );
END//

CREATE TRIGGER historial_tipo_inventario_update
AFTER UPDATE ON tipo_inventario
FOR EACH ROW
BEGIN
    INSERT INTO historial_tipo_inventario (
        historial_id, id, descripcion, fecha_creacion, accion, fecha_cambio
    )
    VALUES (
        UUID(), OLD.id, OLD.descripcion, OLD.fecha_creacion, 'UPDATE', CURRENT_TIMESTAMP
    );

    INSERT INTO historial_general (
        historial_id, entidad, accion, id_entidad, mensaje, fecha_cambio
    )
    VALUES (
        UUID(), 'tipo_inventario', 'UPDATE', OLD.id, CONCAT('Se actualizó el tipo de inventario: ', COALESCE(OLD.descripcion, 'N/A')), CURRENT_TIMESTAMP
    );
END//

CREATE TRIGGER historial_tipo_inventario_delete
AFTER DELETE ON tipo_inventario
FOR EACH ROW
BEGIN
    INSERT INTO historial_tipo_inventario (
        historial_id, id, descripcion, fecha_creacion, accion, fecha_cambio
    )
    VALUES (
        UUID(), OLD.id, OLD.descripcion, OLD.fecha_creacion, 'DELETE', CURRENT_TIMESTAMP
    );

    INSERT INTO historial_general (
        historial_id, entidad, accion, id_entidad, mensaje, fecha_cambio
    )
    VALUES (
        UUID(), 'tipo_inventario', 'DELETE', OLD.id, CONCAT('Se eliminó el tipo de inventario: ', COALESCE(OLD.descripcion, 'N/A')), CURRENT_TIMESTAMP
    );
END//

-- Triggers for usuarios
CREATE TRIGGER historial_usuarios_insert
AFTER INSERT ON usuarios
FOR EACH ROW
BEGIN
    INSERT INTO historial_usuarios (
        historial_id, id, nombres, correo_electronico, contrasena, idRol, estado, fecha_creacion, fecha_actualizacion, accion, fecha_cambio
    )
    VALUES (
        UUID(), NEW.id, NEW.nombres, NEW.correo_electronico, NEW.contrasena, NEW.idRol, NEW.estado, NEW.fecha_creacion, NEW.fecha_actualizacion, 'INSERT', CURRENT_TIMESTAMP
    );

    INSERT INTO historial_general (
        historial_id, entidad, accion, id_entidad, mensaje, fecha_cambio
    )
    VALUES (
        UUID(), 'usuarios', 'INSERT', NEW.id, CONCAT('Se insertó un nuevo usuario: ', COALESCE(NEW.nombres, 'N/A')), CURRENT_TIMESTAMP
    );
END//

CREATE TRIGGER historial_usuarios_update
AFTER UPDATE ON usuarios
FOR EACH ROW
BEGIN
    INSERT INTO historial_usuarios (
        historial_id, id, nombres, correo_electronico, contrasena, idRol, estado, fecha_creacion, fecha_actualizacion, accion, fecha_cambio
    )
    VALUES (
        UUID(), OLD.id, OLD.nombres, OLD.correo_electronico, OLD.contrasena, OLD.idRol, OLD.estado, OLD.fecha_creacion, OLD.fecha_actualizacion, 'UPDATE', CURRENT_TIMESTAMP
    );

    INSERT INTO historial_general (
        historial_id, entidad, accion, id_entidad, mensaje, fecha_cambio
    )
    VALUES (
        UUID(), 'usuarios', 'UPDATE', OLD.id, CONCAT('Se actualizó el usuario: ', COALESCE(OLD.nombres, 'N/A')), CURRENT_TIMESTAMP
    );
END//

CREATE TRIGGER historial_usuarios_delete
AFTER DELETE ON usuarios
FOR EACH ROW
BEGIN
    INSERT INTO historial_usuarios (
        historial_id, id, nombres, correo_electronico, contrasena, idRol, estado, fecha_creacion, fecha_actualizacion, accion, fecha_cambio
    )
    VALUES (
        UUID(), OLD.id, OLD.nombres, OLD.correo_electronico, OLD.contrasena, OLD.idRol, OLD.estado, OLD.fecha_creacion, OLD.fecha_actualizacion, 'DELETE', CURRENT_TIMESTAMP
    );

    INSERT INTO historial_general (
        historial_id, entidad, accion, id_entidad, mensaje, fecha_cambio
    )
    VALUES (
        UUID(), 'usuarios', 'DELETE', OLD.id, CONCAT('Se eliminó el usuario: ', COALESCE(OLD.nombres, 'N/A')), CURRENT_TIMESTAMP
    );
END//

DELIMITER ;

COMMIT;


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
