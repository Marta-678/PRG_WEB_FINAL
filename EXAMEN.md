# EXAMEN — Marta-678
 
 
   ## Reto
   F13 — PUT que en realidad es un PATCH disfrazado
 
 
   ## Tarea técnica
   ### Qué problema detecté
   En `src/controllers/client.controller.js:76-80` y `src/controllers/project.controller.js:94-99` tu PUT usa `campo ?? valorActual`, es decir, si no envías un campo se conserva el valor anterior; y en `src/validators/client.validator.js:26-33` y `src/validators/project.validator.js:26-33` todos los campos del PUT son `.optional()`. Eso es semántica de PATCH, no de PUT (que debería exigir la representación completa del recurso y sustituirla entera, vaciando lo que no se envíe). Elige un endpoint (cliente o proyecto) y o bien conviertes el PUT en un reemplazo completo real (campos requeridos, sin `??`, borrando lo que no llegue), o bien separas PUT (reemplazo total) de un PATCH nuevo (parcial, tu comportamiento actual).

   ### Cómo lo arreglé
   Separé el PUT del PATCH en `cliente.validator` para que en vez de que todos los dats sean opcionales al menos `name`y `cif` sean obligatorios. La nueva validación se llama `replaceClientValidator` 
   ```js
    export const replaceClientValidator = z.object({
    body: z.object({
        name: z.string().trim().min(1, 'El nombre es obligatorio'),
        cif: z.string({ required_error: 'El CIF es obligatorio' }).trim().min(9, 'CIF no válido'),
        email: z.string().trim().email('Email no válido').toLowerCase().optional(),
        phone: z.string().trim().optional(),
        address: addressValidator,
    }),
    params: z.object({ id: objectIdValidator }),
    });
   ```

   En `cliente.controller` sustituí `updateClient` porque como me has indicado actualiza si el valor anterior no es actualizado y eso no es un PUT. Ahora he creado dos `replaceClient` y `patchClient`. Ahora tengo 2 PACTH pero no son lo mismo uno es con solo el id y el otro es con el id/restore. 

   Se repite el mismo procedimiento en `Project`,en este los datos oblogarorios son el `name`, el  `projectCode` y el `client`. 
   ```js
    export const replaceProjectValidator = z.object({
    body: z.object({
        name: z.string().min(1, 'El nombre del proyecto es obligatorio'),
        projectCode: z.string().min(1, 'El código del proyecto es obligatorio'),
        client: objectId,
        address: addressSchema.optional(),
        email: z.string().email('Email no válido').optional(),
        notes: z.string().optional(),
        active: z.boolean().optional(),
    }),
    params: z.object({ id: objectId }),
    });
   ```

   Finalmente se ponene los test estos test comrpueban:
   - Test de idempotencia: Si envias 2 veces la misma petcición lso datos tienen que ser iguales.

   ```js
    it('PUT es idempotente: la misma petición repetida deja el mismo estado final', async () => {
    const { token } = await createCompanyWithUser();

    const createRes = await request(app)
        .post('/api/client')
        .set(authHeader(token))
        .send({ name: 'Cliente Idempotente', cif: 'B44444444' });

    const id = createRes.body.data.client._id;
    const payload = { name: 'Cliente Final', cif: 'B44444444', phone: '699999999' };

    const first = await request(app).put(`/api/client/${id}`).set(authHeader(token)).send(payload);
    const second = await request(app).put(`/api/client/${id}`).set(authHeader(token)).send(payload);

    expect(first.body.data.client.name).toBe(second.body.data.client.name);
    expect(first.body.data.client.phone).toBe(second.body.data.client.phone);
    expect(second.body.data.client.email).toBeUndefined();
    }); 
   ```
   - Test de reemplazo real: un campo no enviado se borra en vez de conservarse. 
   ```js
    it('PUT reemplaza el documento completo y borra los campos no enviados', async () => {
    const { token } = await createCompanyWithUser();

    const createRes = await request(app)
        .post('/api/client')
        .set(authHeader(token))
        .send({ name: 'Cliente Full', cif: 'B33333333', email: 'full@test.com', phone: '600000000' });

    const id = createRes.body.data.client._id;

    const putRes = await request(app)
        .put(`/api/client/${id}`)
        .set(authHeader(token))
        .send({ name: 'Cliente Reemplazado', cif: 'B33333333' });

    expect(putRes.status).toBe(200);
    expect(putRes.body.data.client.email).toBeUndefined();
    expect(putRes.body.data.client.phone).toBeUndefined();
    }); 
   ```


   ### Por qué mi solución es correcta
    Por que a pesar de que la mayoría de datos siguien siendo opcionales, ahora hay datos no opcionales y además borra los datos que no se ponen en PUT. Ahora que se ha solucionado lo que se me ha indicado el código hace lo que debe. Por el resto del código al comprobar no se detectaron erroes o al menos grabe y conseguía sacar el pdf, subir imágenes sin problema. 
 
 
   ## Respuestas socráticas
   1. Era una forma más cómoda y rápida, además de evitar poner errores en los datos, ruido visual al hacer test y confusión si intentaba probar varias cosas. 
   2. Lo rompe porque en vez de eliminarlo, guarda el anterior. Estaría haciendo un PACTH en verdad. 
   3. En principio la primera petición será eliminada por la segunda porque no tengo nada implementado para evitar esto. 
   4. Creo que le queda mejor al borrado de un albarán firmado. A pesar que ambos puedan encajar, para el cliente es mejor indicarle la duplicación, mientras que el mensaje con el borrado deja más claro, no e slo más optimo, pero concuerda mejor. 
   5. Pues la ganas de agilizar el proceso de realizar el código, mi complicación de no diferenciarlos del todo y no entender para que usar cada uno y en que contexto hizo que cometira ese error de usarlos indescriminadamente como lo mismo. 
 
 
   ## Proceso
   Tiempo total invertido: [X horas]
   Herramientas usadas: [IDE, IA tal/cual, Stack Overflow, ...]
   - ChatGPT
   Prompts a IA (si aplica, copia literal):
    - # CONTEXTO (C) 
        Soy estudiante de Ingeniería de Software haciendo una práctica de Web back-end que debo de entregar en 3 semanas
        # ROL (R) 
        Actúa como mi Tech Lead Senior. Eres pragmático y conoces mis limitaciones de tiempo y habilidades.  

        # OBJETIVO (O) 
        Audita mi idea y dame un plan de batalla. No sugieras otras que no sean las fuentes. 
        Node.js + Express 5 + Zod + MongoDB Atlas + Mongoose + JWT + bcryptjs + Multer + Helmet + express-rate-limit + express-mongo-sanitize
        # ESTILO (S) 
        Brutalmente honesto. Si voy a fallar, dímelo ahora. 

   - (no puedo poner exactamente el mensaje porque eran capturas de panatallas de errores y ponía como lo soluciono)