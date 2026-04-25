# Controlador
Esta carpeta contiene los controladores de la aplicación.

Un controlador recibe la petición ya validada, aplica la lógica del endpoint y devuelve la respuesta HTTP.

## Archivos
### `user.controller.js`
Controlador del módulo de usuarios heredado de la práctica intermedia.

Debe implementar la lógica de endpoints como:
- registro de usuario;
- validación de email;
- login;
- onboarding de datos personales;
- onboarding de compañía;
- subida del logo;
- obtención del usuario autenticado;
- refresh token;
- logout;
- borrado de usuario;
- cambio de contraseña;
- invitación de compañeros.

### `client.controller.js`
Controlador de clientes.

Debe encargarse de:
- crear clientes;
- actualizar clientes;
- listar clientes con paginación y filtros;
- obtener un cliente concreto;
- hacer soft delete o hard delete;
- listar archivados;

- restaurar archivados.

### `project.controller.js`
Controlador de proyectos.

Debe encargarse de:
- crear proyectos;
- actualizar proyectos;
- listar proyectos con paginación y filtros;
- obtener un proyecto concreto;
- hacer soft delete o hard delete;
- listar archivados;
- restaurar archivados.

### `deliverynote.controller.js`
Controlador de albaranes.

Debe encargarse de:

- crear albaranes;
- listar albaranes con filtros;
- obtener un albarán concreto;
- descargar un albarán en PDF;
- firmar un albarán;
- borrar un albarán si procede.

## Qué va a hacer esta carpeta
Coordinar la lógica de negocio de cada endpoint sin mezclar definición de rutas, validación ni definición de modelos.