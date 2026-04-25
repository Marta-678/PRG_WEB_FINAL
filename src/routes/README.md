# routes

Esta carpeta contiene la definición de rutas de la API.

Cada archivo conecta endpoints HTTP con su middleware y su controlador correspondiente.

## Archivos

### `user.routes.js`

Define las rutas del módulo de usuarios.

Debe incluir endpoints como:

- `POST /api/user/register`
- `PUT /api/user/validation`
- `POST /api/user/login`
- `PUT /api/user/register`
- `PATCH /api/user/company`
- `PATCH /api/user/logo`
- `GET /api/user`
- `POST /api/user/refresh`
- `POST /api/user/logout`
- `DELETE /api/user`
- `PUT /api/user/password`
- `POST /api/user/invite`

### `client.routes.js`

Define las rutas del módulo de clientes.

Debe incluir endpoints como:

- `POST /api/client`
- `PUT /api/client/:id`
- `GET /api/client`
- `GET /api/client/:id`
- `DELETE /api/client/:id`
- `GET /api/client/archived`
- `PATCH /api/client/:id/restore`

### `project.routes.js`

Define las rutas del módulo de proyectos.

Debe incluir endpoints como:

- `POST /api/project`
- `PUT /api/project/:id`
- `GET /api/project`
- `GET /api/project/:id`
- `DELETE /api/project/:id`
- `GET /api/project/archived`
- `PATCH /api/project/:id/restore`

### `deliverynote.routes.js`

Define las rutas del módulo de albaranes.

Debe incluir endpoints como:

- `POST /api/deliverynote`
- `GET /api/deliverynote`
- `GET /api/deliverynote/:id`
- `GET /api/deliverynote/pdf/:id`
- `PATCH /api/deliverynote/:id/sign`
- `DELETE /api/deliverynote/:id`

## Qué va a hacer esta carpeta
Declarar de forma ordenada la API pública del backend y enlazar cada ruta con sus middlewares y controladores.