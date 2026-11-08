# Manual de uso

Esta guía explica cómo abrir y utilizar la versión actual de Nuestro Hogar.

## 1. Abrir la aplicación

1. Descarga o clona el repositorio.
2. Abre la carpeta del proyecto en Visual Studio Code.
3. Inicia un servidor local con una extensión como Live Server y abre
   `index.html`.
4. Usa el menú superior para entrar a **Inicio**, **Convivencia** o **Instantes**.

Se recomienda usar un servidor local en lugar de abrir los archivos con
`file://`, especialmente para que IndexedDB pueda guardar las fotografías de
los recuerdos.

## 2. Inicio

La portada presenta el proyecto y contiene accesos directos a los módulos. El
contador de tareas pendientes se calcula con las tareas guardadas en el
navegador. Compras y fechas especiales aparecen como módulos en preparación;
todavía no se pueden administrar desde la aplicación.

## 3. Organizar tareas en Convivencia

### Crear una tarea

1. Abre **Convivencia** desde el menú.
2. Escribe el nombre de la actividad.
3. Elige a la persona responsable.
4. Selecciona el esfuerzo de la tarea, de 1 a 5 puntos.
5. Si lo necesitas, elige una fecha límite.
6. Pulsa **Agregar tarea**.

La fecha límite es opcional. El título, responsable y nivel de esfuerzo son
necesarios para registrar la tarea.

### Consultar y actualizar tareas

- Usa el filtro de la lista para mostrar todas, solo pendientes o solo
  completadas.
- Marca la casilla de una tarea para cambiar su estado.
- El resumen y los puntos se actualizan automáticamente. Los puntos se cuentan
  cuando la tarea está completada.
- Usa el botón **×** de una tarea para eliminarla.

Los puntos representan el esfuerzo registrado y no una competencia entre las
personas del hogar.

## 4. Guardar recuerdos en Instantes

### Crear un recuerdo

1. Abre **Instantes** desde el menú.
2. Selecciona una fotografía JPG, PNG o WEBP de hasta 8 MB.
3. Revisa la vista previa; puedes quitar la imagen y seleccionar otra.
4. Escribe un título y confirma la fecha. La descripción es opcional.
5. Pulsa **Guardar recuerdo**.

El recuerdo se agrega al álbum y aumenta el contador. Si el navegador no puede
recuperar una fotografía guardada, la tarjeta del recuerdo permanece visible
con un aviso.

### Eliminar un recuerdo

Pulsa **Eliminar recuerdo** en la tarjeta correspondiente y confirma la acción.
Se eliminarán tanto los datos del recuerdo como su fotografía asociada.

## 5. Almacenamiento y privacidad

Las tareas y los datos de los recuerdos se guardan en `localStorage`; las fotos
del álbum se guardan en IndexedDB. Esta información pertenece al navegador y
dispositivo actuales: no se sincroniza con otra persona ni con otros
dispositivos.

Si limpias los datos del sitio o cambias de navegador o dispositivo, puedes
perder esa información. No hay cuentas ni copia de respaldo en un servidor.

## 6. Si algo no funciona

- Si una tarea no aparece, revisa el filtro seleccionado.
- Si no se guarda un recuerdo, comprueba el formato y que la fotografía no
  supere 8 MB; también revisa que el título y la fecha estén completos.
- Si no carga el álbum, abre la aplicación mediante un servidor local y revisa
  la consola del navegador para ver el error.
- Las imágenes del README incluyen tanto capturas de la aplicación como un
  mockup claramente identificado; este último es solo una referencia visual.
