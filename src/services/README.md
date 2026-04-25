# services

Esta carpeta contiene servicios auxiliares reutilizables que encapsulan lógica transversal o integración con herramientas externas.

## Archivos

### `notification.service.js`

Servicio basado en EventEmitter.

Debe emitir eventos del ciclo de vida de usuario y registrar listeners básicos por consola.

Eventos esperados en la práctica intermedia:

- `user:registered`
- `user:verified`
- `user:invited`
- `user:deleted`

### `socket.service.js`

Servicio para la capa de tiempo real con Socket.IO.

Debe encargarse de:

- iniciar la conexión WebSocket;
- autenticar con JWT;
- organizar usuarios por compañía en rooms;
- emitir eventos de negocio.

### `pdf.service.js`

Servicio de generación de PDF.

Debe construir el PDF de un albarán con datos del usuario, cliente, proyecto y firma si existe.

### `storage.service.js`
Servicio de almacenamiento de archivos.

Debe abstraer la subida de imágenes y PDFs a local o a la nube.

### `slack.service.js`

Servicio para notificar errores 5XX mediante Slack Incoming Webhooks.

### `mail.service.js`

Servicio para envío de emails relacionados con validación o invitaciones, si se implementa en la práctica final.

## Qué va a hacer esta carpeta

Separar integraciones y lógica transversal del controlador para que el código de los endpoints no se vuelva caótico.