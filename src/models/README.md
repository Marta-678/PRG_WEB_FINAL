# Modelos

Esta carpeta contiene los modelos de datos definidos con Mongoose.

Cada archivo representa una entidad principal del sistema y define su estructura, reglas básicas, referencias e índices.

## Archivos

### `User.js`

Modelo de usuario.

Debe representar:

- credenciales de acceso;
- estado de validación;
- rol;
- datos personales;
- relación con la compañía;
- borrado lógico.

También debe incluir:

- índices para campos de consulta frecuente;
- el virtual `fullName`;
- configuración para exponer virtuals en JSON.

### `Company.js`

Modelo de compañía.

Debe representar:
- propietario de la compañía;
- nombre;
- CIF;
- dirección;
- logo;
- si es autónomo o no;
- borrado lógico.

### `Client.js`

Modelo de cliente.

Debe representar:

- usuario creador;
- compañía a la que pertenece;
- nombre;
- CIF;
- email;
- teléfono;
- dirección;
- borrado lógico.

### `Project.js`

Modelo de proyecto.

Debe representar:

- usuario creador;
- compañía;
- cliente asociado;
- nombre del proyecto;
- código interno;
- dirección;
- email;
- notas;
- estado activo;
- borrado lógico.

### `DeliveryNote.js`

Modelo de albarán.

Debe representar:

- usuario creador;
- compañía;
- cliente;
- proyecto;
- formato del albarán;
- descripción;
- fecha de trabajo;
- datos de horas o materiales;
- estado de firma;
- URL de firma;
- URL de PDF;
- borrado lógico.

## Qué va a hacer esta carpeta

Definir la estructura persistente de la información del sistema y sus relaciones en MongoDB.