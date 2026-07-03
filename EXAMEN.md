# EXAMEN — Marta-678
 
 
   ## Reto
   F13 — PUT que en realidad es un PATCH disfrazado
 
 
   ## Tarea técnica
   ### Qué problema detecté
   En `src/controllers/client.controller.js:76-80` y `src/controllers/project.controller.js:94-99` tu PUT usa `campo ?? valorActual`, es decir, si no envías un campo se conserva el valor anterior; y en `src/validators/client.validator.js:26-33` y `src/validators/project.validator.js:26-33` todos los campos del PUT son `.optional()`. Eso es semántica de PATCH, no de PUT (que debería exigir la representación completa del recurso y sustituirla entera, vaciando lo que no se envíe). Elige un endpoint (cliente o proyecto) y o bien conviertes el PUT en un reemplazo completo real (campos requeridos, sin `??`, borrando lo que no llegue), o bien separas PUT (reemplazo total) de un PATCH nuevo (parcial, tu comportamiento actual).

   ### Cómo lo arreglé
   Separé el PUT del PATCH en `cliente.validator` para que en vez de que todos los dats sean opcionales al menos `name`y `cif` sean obligatorios. La nueva validación se llama `replaceClientValidator` 

   En `cliente.controller` sustituí `updateClient` porque como me has indicado actualiza si el valor anterior no es actualizado y eso no es un PUT. Ahora he creado dos `replaceClient` y `patchClient`. Ahora tengo 2 PACTH pero no son lo mismo uno es con solo el id y el otro es con el id/restore. 
   

   ### Por qué mi solución es correcta
   [...]
 
 
   ## Respuestas socráticas
   1. [respuesta 1, 3-5 frases]
   2. [respuesta 2, 3-5 frases]
   3. [...]
   4. [...]
   5. [...]
 
 
   ## Proceso
   Tiempo total invertido: [X horas]
   Herramientas usadas: [IDE, IA tal/cual, Stack Overflow, ...]
   Prompts a IA (si aplica, copia literal):
   - "..."
   - "..."