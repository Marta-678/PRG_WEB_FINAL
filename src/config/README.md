# Configuración
Esta carpeta contiene la configuración centralizada del proyecto.

Su objetivo es evitar valores repartidos por todo el código y dejar en un único lugar la lectura y validación de variables de entorno.

## Archivos
### `index.js`
Archivo de configuración principal.

Debe encargarse de:
- leer variables de entorno;
- exponer configuración reutilizable del proyecto;
- centralizar valores como puerto, URI de MongoDB, secretos JWT, expiración de tokens, URL pública y credenciales de servicios externos.

### `swagger.js`
Archivo de configuración principal de Swagger.

Debe encargarse de:
- definir la información general de la API;
- registrar esquemas reutilizables;
- configurar seguridad Bearer JWT;
- indicar qué archivos contienen anotaciones OpenAPI.

## Qué va a hacer esta carpeta
- Definir la configuración global del backend.
- Preparar la app para distintos entornos.
- Evitar hardcodear valores sensibles en el código.