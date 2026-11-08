# Arquitectura

## Arquitectura actual

La versión 0.1 es una aplicación frontend estática. Se abre desde archivos HTML
locales o se puede servir con un servidor estático. No usa backend, API,
framework ni proceso de compilación.

```text
HTML (páginas)
  ├── CSS (presentación compartida)
  └── JavaScript (interacción por módulo)
        ├── localStorage: tareas y datos de recuerdos
        └── IndexedDB: fotografías de los recuerdos
```

Los datos son locales al navegador y al dispositivo. Actualmente no hay
sincronización ni colaboración en tiempo real.

## Estructura de carpetas

| Ruta | Responsabilidad |
| --- | --- |
| `index.html` | Portada, accesos a los módulos y resumen de tareas. |
| `pages/convivencia.html` | Interfaz de administración de tareas del hogar. |
| `pages/instantes.html` | Formulario y galería de recuerdos. |
| `styles/main.css` | Identidad visual, componentes compartidos y reglas responsive. |
| `scripts/components.js` | Genera la navegación compartida y resalta la página activa. |
| `scripts/app.js` | Actualiza la fecha y el resumen de tareas de Inicio. |
| `scripts/tasks.js` | Gestiona tareas, filtros, indicadores y puntos. |
| `scripts/moments.js` | Gestiona el formulario, la galería y las acciones de recuerdos. |
| `scripts/storage.js` | Encapsula el almacenamiento de recuerdos e imágenes. |
| `assets/images/` | Carpeta para recursos visuales; no contiene fotos personales versionadas. |
| `docs/` | Visión, arquitectura, funcionalidades e historial del proyecto. |

## Persistencia

### Tareas

`scripts/tasks.js` guarda la lista bajo la clave `nuestroHogar_tareas` en
`localStorage`. Cada tarea tiene identificador, título, responsable, puntos,
fecha límite, estado y fecha de creación. Al leer los datos se valida su forma
antes de usarlos.

### Recuerdos

`scripts/storage.js` guarda los metadatos bajo la clave
`nuestroHogar_instantes` en `localStorage`. Cada fotografía se guarda en la base
IndexedDB `NuestroHogarDB`, dentro del almacén `fotografias`. El ID del recuerdo
relaciona sus metadatos con su imagen.

`scripts/moments.js` se encarga de la interfaz y usa las funciones expuestas por
`scripts/storage.js` para leer, guardar y eliminar recuerdos.

## Navegación compartida

Cada página contiene un elemento `#site-header` y carga `scripts/components.js`.
El componente identifica el archivo actual, calcula las rutas relativas y
construye el menú. Los estilos comunes están en `styles/main.css`.

## Ejecución y limitaciones

No se requiere instalar paquetes. Al trabajar con fotos y almacenamiento del
navegador, se recomienda abrir el proyecto desde un servidor local si el
navegador restringe alguna capacidad al usar `file://`.

La información puede perderse al limpiar los datos del sitio o cambiar de
navegador o dispositivo. No existe una copia central ni mecanismos de respaldo.
La fotografía personal utilizada durante el desarrollo se mantiene fuera de Git
mediante `.gitignore`; la portada utiliza una ilustración sin imagen personal.

## Arquitectura futura

Una evolución posible sería separar frontend, API y base de datos. La selección
de framework, lenguaje, servidor y motor de base de datos queda pendiente de
requisitos más concretos; las opciones propuestas en la visión no forman parte
de esta implementación.
