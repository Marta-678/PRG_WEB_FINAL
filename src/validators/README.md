# Validación 
Esta carpeta contiene los esquemas de validación con Zod.

Su objetivo es validar la entrada de cada endpoint antes de ejecutar lógica de negocio.

## Archivos

### `user.validator.js`

Debe incluir los esquemas del módulo de usuarios, por ejemplo:

- registro;
- validación de email;
- login;
- onboarding de datos personales;
- onboarding de compañía;
- refresh token;
- cambio de contraseña;
- invitación.

### `client.validator.js`

Debe incluir los esquemas de validación para crear, actualizar, listar y restaurar clientes.

### `project.validator.js`

Debe incluir los esquemas de validación para crear, actualizar, listar y restaurar proyectos.

### `deliverynote.validator.js`

Debe incluir los esquemas de validación para crear, listar, firmar y borrar albaranes.

## Qué va a hacer esta carpeta

Definir de forma explícita qué datos acepta cada endpoint y rechazar entradas inválidas antes de llegar al controlador.