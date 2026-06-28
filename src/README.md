# Archivos de Arranque
Esta carpeta contiene los archivos principales que ponen en marcha la aplicación.  
Su función es separar dos responsabilidades:
- `app.js`: construye y configura la aplicación Express
- `index.js`: arranca el servidor y prepara el entorno antes de levantar la app

## Contenido
- `config/`: configuración centralizada de la app y de sus servicios.
- `controllers/`: lógica que responde a cada endpoint.
- `middleware/`: middlewares de autenticación, validación, errores y subida de archivos.
- `models/`: modelos de Mongoose.
- `routes/`: definición de endpoints.
- `services/`: servicios auxiliares y lógica transversal.
- `utils/`: utilidades compartidas.
- `validators/`: esquemas Zod.
- `docs/`: configuración Swagger si se separa en una carpeta propia.
- `app.js`: configuración principal de Express.
- `index.js`: punto de entrada del servidor.

## Objetivo
Mantener el proyecto ordenado y separar responsabilidades para que cada parte del backend tenga una función clara.

---

_Voy a explicar más a profundidad aquí_

## APP.JS
Configura la alicación principal de Express. Aquí se inicializan los middlewares globales, las rutas principales de la API, las rutas de prueba y el sistema centralizado de errores. 

No levanta el servidor directamente.