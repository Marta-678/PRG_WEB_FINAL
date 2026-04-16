# Validación 
## Función 
Se definen las validaciones para las operaciones principales del usuario. Se ha usado tecnología Zod (Del tema 4 y 6). 

Zod permite describir “la forma” esperada de `body/query/params`y validar antes de entrar en el controlador.

**Valida formularios de**:
- registro
- login
- validación por código
- datos personales
- datos de empresa
- cambio de contraseña
- invitación de usuarios


## Estructura Seguida 
Zod se usa para definir esquemas de validación de forma clara y centralizada.

- Se crea un esquema Zod
- Se valida el objeto `body`de la petición 
- Dentro del `body`se validan los campos y se normalizan 
- Se exxportan para ser usados en [[src/routes/user.routes.js|user.routes.js]]