
// NUESTRO HOGAR - APLICACIÓN PRINCIPAL

document.addEventListener("DOMContentLoaded", () => {

    // Esta clave debe coincidir con la que usa tasks.js para leer las mismas tareas.
    const TASKS_STORAGE_KEY = "nuestroHogar_tareas";

    // Estos elementos existen en Inicio; otras páginas pueden usar este archivo sin ellos.
    const dateElement = document.getElementById("current-date");
    const pendingTasksCount = document.getElementById("pending-tasks-count");
    const pendingTasksDescription = document.getElementById(
        "pending-tasks-description"
    );

    // La fecha se presenta en español para que el inicio se sienta más personalizado.
    const today = new Date();

    const formattedDate = new Intl.DateTimeFormat("es-CO", {
        weekday: "long",
        day: "numeric",
        month: "long"
    }).format(today);

    // Mostrar la fecha en pantalla.
    if (dateElement) {
        dateElement.textContent = formattedDate.toUpperCase();
    }

    // El resumen de Inicio se calcula desde localStorage, igual que la lista de Convivencia.
    if (pendingTasksCount && pendingTasksDescription) {
        try {
            const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
            const parsedTasks = savedTasks ? JSON.parse(savedTasks) : [];

            // Si el contenido guardado no es una lista, lo tratamos como un dato dañado.
            if (!Array.isArray(parsedTasks)) {
                throw new Error("Los datos guardados de tareas no son una lista.");
            }

            // Valido la estructura antes de contar para no mostrar resultados incorrectos.
            const validTasks = parsedTasks.filter(task =>
                task !== null &&
                typeof task === "object" &&
                typeof task.id === "string" &&
                task.id.length > 0 &&
                typeof task.title === "string" &&
                task.title.trim().length > 0 &&
                ["Stiven", "Ana"].includes(task.assignee) &&
                Number.isInteger(task.points) &&
                task.points >= 1 &&
                task.points <= 5 &&
                typeof task.date === "string" &&
                typeof task.completed === "boolean"
            );

            if (validTasks.length !== parsedTasks.length) {
                console.warn("Se omitieron tareas guardadas con datos inválidos.");
            }

            // Solo cuentan las tareas válidas que todavía no se han completado.
            const pendingCount = validTasks.filter(task => !task.completed).length;
            pendingTasksCount.textContent = pendingCount;
            pendingTasksDescription.textContent =
                pendingCount === 1
                    ? "Tarea pendiente en Convivencia"
                    : "Tareas pendientes en Convivencia";
        } catch (error) {
            // Mostramos un estado claro en vez de dejar un número de ejemplo como si fuera real.
            console.error("No se pudieron cargar las tareas del inicio:", error);
            pendingTasksCount.textContent = "—";
            pendingTasksDescription.textContent = "No se pudieron cargar las tareas";
        }
    }

});
