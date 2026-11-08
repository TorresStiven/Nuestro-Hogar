# Funcionalidades

Este documento describe qué está implementado en la versión 0.1 y qué sigue
siendo una idea futura.

## Inicio

- Muestra una bienvenida y la fecha actual.
- Incluye navegación y accesos a Convivencia e Instantes.
- Calcula el número de tareas pendientes a partir de los datos locales.
- Identifica compras y fechas especiales como módulos en preparación; todavía
  no registra datos para ellos.

## Convivencia

- Crear una tarea con título, responsable y nivel de esfuerzo.
- Añadir una fecha límite opcional.
- Marcar tareas como pendientes o completadas.
- Filtrar la lista por todas, pendientes o completadas.
- Eliminar tareas.
- Consultar contadores de tareas y puntos obtenidos por cada integrante.
- Guardar y recuperar tareas en `localStorage`.
- Validar los registros guardados antes de mostrarlos.

Los puntos se suman únicamente por tareas completadas. Representan el esfuerzo
registrado y no deben interpretarse como una competencia.

## Nuestros Instantes

- Seleccionar una imagen JPG, PNG o WEBP de hasta 8 MB.
- Ver una vista previa y quitar la fotografía seleccionada.
- Crear un recuerdo con título, fecha y descripción opcional.
- Ver los recuerdos guardados en una galería y consultar su contador.
- Eliminar un recuerdo junto con su fotografía asociada.
- Guardar metadatos en `localStorage` y fotografías en IndexedDB.
- Mostrar un marcador si la fotografía de un recuerdo no está disponible.
- Validar los datos recuperados antes de utilizarlos.

## Datos y limitaciones

- La información queda guardada en el navegador y dispositivo actuales.
- No hay inicio de sesión, backend, sincronización o colaboración entre
  dispositivos.
- Limpiar los datos del navegador puede eliminar la información local.
- Compras, inventario, finanzas, recetas, calendario y metas todavía no están
  implementados.
- La ruleta de tareas es una idea futura y aún no tiene interacción.

## Ideas futuras

La prioridad de estas ideas dependerá de los objetivos del proyecto:

- Lista de compras e inventario del hogar.
- Calendario de eventos y fechas importantes.
- Ruleta o distribución equilibrada de responsabilidades.
- Gastos, presupuestos y metas de ahorro.
- Recetas y planificación de comidas.
- Cuentas, hogares compartidos y sincronización.
- Notificaciones o aplicación web progresiva.
