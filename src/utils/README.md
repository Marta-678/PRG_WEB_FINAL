# utils

Esta carpeta contiene utilidades compartidas por distintas partes del proyecto.

## Archivos

### `AppError.js`

Clase de error personalizada.

Debe servir para:

- crear errores operacionales de forma consistente;
- centralizar códigos y mensajes;
- facilitar el trabajo del middleware global de errores.

## Posibles utilidades futuras

Aquí también podrían existir utilidades auxiliares para:

- generación de códigos;
- manejo de fechas;
- formateo de respuestas;
- utilidades de JWT o contraseñas, si decides separarlas de servicios y middleware.

## Qué va a hacer esta carpeta

Reunir piezas pequeñas de lógica compartida que no pertenecen a un modelo, controlador o servicio concreto.