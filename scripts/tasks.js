
/*
   Módulo de convivencia y tareas
*/

document.addEventListener("DOMContentLoaded", () => {

    // ------------------------------------
    // 1. REFERENCIAS A ELEMENTOS HTML
    // ------------------------------------

    const taskForm = document.getElementById("task-form");
    const taskList = document.getElementById("task-list");
    const taskFilter = document.getElementById("task-filter");

    const pendingCount = document.getElementById("pending-count");
    const completedCount = document.getElementById("completed-count");
    const totalPoints = document.getElementById("total-points");

    const stivenPoints = document.getElementById("stiven-points");
    const anaPoints = document.getElementById("ana-points");

    const taskListDescription = document.getElementById(
        "task-list-description"
    );

    // ------------------------------------
    // 2. ALMACENAMIENTO
    // ------------------------------------

    const STORAGE_KEY = "nuestroHogar_tareas";

    // Los datos se revisan al cargarlos porque localStorage puede contener valores antiguos o editados.
    function isValidTask(task) {
        return task !== null &&
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
            typeof task.completed === "boolean";
    }

    function loadTasks() {
        try {
            const savedTasks = localStorage.getItem(STORAGE_KEY);
            const parsedTasks = savedTasks ? JSON.parse(savedTasks) : [];

            // Una lista es el formato esperado; cualquier otro dato se considera inválido.
            if (!Array.isArray(parsedTasks)) {
                throw new Error("Los datos guardados de tareas no son una lista.");
            }

            const validTasks = parsedTasks.filter(isValidTask);

            if (validTasks.length !== parsedTasks.length) {
                console.warn("Se omitieron tareas guardadas con datos inválidos.");
            }

            return validTasks;

        } catch (error) {
            console.error("No se pudieron recuperar las tareas:", error);
            return [];
        }
    }

    let tasks = loadTasks();

    function saveTasks() {
        // Guardamos la lista completa para recuperarla al volver a abrir la página.
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }

    // ------------------------------------
    // 3. AGREGAR UNA TAREA
    // ------------------------------------

    taskForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const title = document.getElementById("task-title").value.trim();
        const assignee = document.getElementById("task-assignee").value;
        const points = Number(
            document.getElementById("task-points").value
        );
        const date = document.getElementById("task-date").value;

        // Además de los atributos required del HTML, reviso estos valores en JavaScript.
        if (!title || !["Stiven", "Ana"].includes(assignee)) {
            return;
        }

        // Cada tarea tiene un identificador propio para poder actualizarla o eliminarla.
        const newTask = {
            id: crypto.randomUUID(),
            title: title,
            assignee: assignee,
            points: points,
            date: date,
            completed: false,
            createdAt: new Date().toISOString()
        };

        tasks.push(newTask);

        saveTasks();
        renderTasks();

        taskForm.reset();

        // Recuperar el valor predeterminado de puntos.
        document.getElementById("task-points").value = "3";

    });

    // ------------------------------------
    // 4. COMPLETAR UNA TAREA
    // ------------------------------------

    function toggleTask(taskId) {

        // Creo una nueva lista cambiando únicamente el estado de la tarea seleccionada.
        tasks = tasks.map(task => {

            if (task.id === taskId) {
                return {
                    ...task,
                    completed: !task.completed
                };
            }

            return task;
        });

        saveTasks();
        renderTasks();
    }

    // ------------------------------------
    // 5. ELIMINAR UNA TAREA
    // ------------------------------------

    function deleteTask(taskId) {

        // Al filtrar por ID se conservan las demás tareas sin modificar sus datos.
        tasks = tasks.filter(task => task.id !== taskId);

        saveTasks();
        renderTasks();
    }

    // ------------------------------------
    // 6. ACTUALIZAR INDICADORES
    // ------------------------------------

    function updateStatistics() {

        const pending = tasks.filter(task => !task.completed);
        const completed = tasks.filter(task => task.completed);

        // Los puntos se asignan al completar la tarea, no al momento de crearla.
        const pointsStiven = completed
            .filter(task => task.assignee === "Stiven")
            .reduce((total, task) => total + task.points, 0);

        const pointsAna = completed
            .filter(task => task.assignee === "Ana")
            .reduce((total, task) => total + task.points, 0);

        pendingCount.textContent = pending.length;
        completedCount.textContent = completed.length;

        // Los puntos se suman cuando una tarea se completa.
        totalPoints.textContent = pointsStiven + pointsAna;

        stivenPoints.textContent = `${pointsStiven} puntos`;
        anaPoints.textContent = `${pointsAna} puntos`;

    }

    // ------------------------------------
    // 7. MOSTRAR TAREAS EN PANTALLA
    // ------------------------------------

    function renderTasks() {

        // Se vuelve a dibujar la lista para que los cambios y filtros se reflejen enseguida.
        taskList.innerHTML = "";

        const filter = taskFilter.value;

        const filteredTasks = tasks.filter(task => {

            if (filter === "pending") {
                return !task.completed;
            }

            if (filter === "completed") {
                return task.completed;
            }

            return true;
        });

        taskListDescription.textContent =
            `${tasks.length} ${tasks.length === 1 ? "actividad registrada" : "actividades registradas"}`;

        if (filteredTasks.length === 0) {

            // Distingo entre una lista sin tareas y un filtro que no encontró resultados.
            const emptyState = document.createElement("div");
            emptyState.className = "empty-state";

            const icon = document.createElement("span");
            icon.textContent = tasks.length === 0 ? "🏡" : "✨";

            const title = document.createElement("h3");
            title.textContent = tasks.length === 0
                ? "Comencemos juntos"
                : "Todo está al día";

            const description = document.createElement("p");
            description.textContent = tasks.length === 0
                ? "Todavía no hay tareas. Agreguemos nuestra primera actividad."
                : "No hay actividades en esta categoría.";

            emptyState.append(icon, title, description);
            taskList.appendChild(emptyState);

        } else {

            filteredTasks.forEach(task => {

                const article = document.createElement("article");
                article.className = "task-item";

                if (task.completed) {
                    article.classList.add("task-completed");
                }

                // Casilla de finalización.
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.className = "task-check";
                checkbox.checked = task.completed;
                checkbox.setAttribute("aria-label", "Completar tarea");

                checkbox.addEventListener("change", () => {
                    toggleTask(task.id);
                });

                // Información de la tarea.
                const details = document.createElement("div");
                details.className = "task-details";

                const title = document.createElement("h4");
                title.textContent = task.title;

                const description = document.createElement("p");

                const formattedDate = task.date
                    ? new Date(`${task.date}T12:00:00`).toLocaleDateString("es-CO")
                    : "Sin fecha límite";

                description.textContent =
                    `${task.assignee} · ${formattedDate}`;

                details.append(title, description);

                // Puntos.
                const points = document.createElement("span");
                points.className = "task-points";
                points.textContent = `⭐ ${task.points}`;

                // Botón eliminar.
                const deleteButton = document.createElement("button");
                deleteButton.type = "button";
                deleteButton.className = "task-delete";
                deleteButton.textContent = "×";
                deleteButton.setAttribute("aria-label", "Eliminar tarea");

                deleteButton.addEventListener("click", () => {
                    deleteTask(task.id);
                });

                article.append(
                    checkbox,
                    details,
                    points,
                    deleteButton
                );

                taskList.appendChild(article);

            });
        }

        updateStatistics();
    }

    // ------------------------------------
    // 8. FILTRAR ACTIVIDADES
    // ------------------------------------

    taskFilter.addEventListener("change", renderTasks);

    // ------------------------------------
    // 9. INICIAR EL MÓDULO
    // ------------------------------------

    renderTasks();

});
