# Sistema de Ventas

Sistema moderno y eficiente para la gestión de ventas, desarrollado con Spring Boot y React.


## Estructura del Proyecto

El proyecto está dividido en dos partes principales:

- `backend/`: Aplicación Spring Boot (Java)
- `frontend/`: Aplicación React

## Requisitos Previos para la instalación

- Java 17 o superior
- Node.js 18 o superior
- MySQL 8.0 o superior
- Maven 3.8 o superior

## Configuración del Proyecto

### Backend

1. Navegar al directorio backend:
```bash
cd backend
```

2. Instalar dependencias:
```bash
mvn clean install
```

3. Configurar la base de datos:
   - Crear una base de datos MySQL llamada `sistema_ventas`
   - Actualizar las credenciales en `src/main/resources/application.properties`

4. Ejecutar la aplicación:
```bash
mvn spring-boot:run
```

El servidor estará disponible en `http://localhost:8080`

### Frontend

1. Navegar al directorio frontend:
```bash
cd frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Ejecutar la aplicación:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Características Principales

- Gestión de clientes
- Gestión de proveedores
- Gestión de tiendas
- Gestión de productos
- Gestión de productos en tiendas
- Gestión de ventas
- Dashboard con estadísticas

## Tecnologías Utilizadas

### Backend
- Spring Boot
- Spring Data JPA
- Spring Security
- MySQL
- Maven

### Frontend
- React
- Material-UI
- Redux Toolkit
- Axios
- React Router
