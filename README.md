


## Package.json
Archivo necesario para arrancar el proyecto. Este archivo describe una API REST con Express 5, usando MongoDB, validación con Zod, autenticación con JWT, seguridad avanzada y subida de archivos con Multer.

Como usa ES Modules: 
```js
import express from "express";
```

El archivo principal de entrada es `src/index.js` que se arranca en "scripts". En terminal para arrancar hay que poner  
```bash
npm run dev
```
```bash
npm start
```
















----

##  .dockerignore


| Línea           | Motivo                                                                                                            |
| --------------- | ----------------------------------------------------------------------------------------------------------------- |
| `node_modules`  | Docker instala sus propias dependencias con `npm install` o `npm ci`.                                             |
| `.git`          | El historial de Git no hace falta dentro del contenedor.                                                          |
| `.env`          | Evita incluir credenciales en la imagen.                                                                          |
| `coverage`      | Son resultados de tests, no son necesarios para ejecutar la aplicación.                                           |
| `uploads`       | Son archivos generados por la aplicación; normalmente se usan volúmenes o almacenamiento externo como Cloudinary. |
| `npm-debug.log` | Archivo temporal de errores de npm.                                                                               |
