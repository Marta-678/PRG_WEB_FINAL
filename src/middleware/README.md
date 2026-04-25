# middleware

Esta carpeta contiene middlewares reutilizables que se ejecutan antes de llegar a los controladores o durante el manejo de errores.

## Archivos

### `auth.middleware.js`

Middleware de autenticación.

Debe:

- leer el token JWT de la cabecera `Authorization`;
- verificar su validez;
- identificar al usuario autenticado;
- adjuntar el usuario a `req.user`.

### `error-handler.js`

Middleware centralizado de errores.

Debe:

- capturar errores lanzados en controladores y middlewares;
- devolver respuestas consistentes;
- transformar errores operacionales en respuestas HTTP claras.

### `role.middleware.js`

Middleware de autorización por rol.

Su función es limitar el acceso a ciertos endpoints según el rol del usuario cuando la práctica lo exige de forma explícita.

### `upload.js`
Configuración de Multer.

Debe:

- procesar peticiones `multipart/form-data`;
- limitar tipo y tamaño de archivos;
- preparar la recepción de logos o firmas.

### `validate.js`

Middleware de validación con Zod.

Debe:

- validar `body`, `params` y `query` según el endpoint;
- devolver errores de validación antes de llegar al controlador.

## Qué va a hacer esta carpeta
Aplicar autenticación, validación, subida de archivos y manejo uniforme de errores en toda la API.