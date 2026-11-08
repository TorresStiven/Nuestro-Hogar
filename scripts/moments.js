
/*
Responsabilidad: gestionar la galería de recuerdos.
Utiliza storage.js para guardar y recuperar datos.
*/

document.addEventListener("DOMContentLoaded", () => {

    // -----------------------------------------
    // 1. REFERENCIAS A LOS ELEMENTOS HTML
    // -----------------------------------------

    const form = document.getElementById("memoryForm");
    const photoInput = document.getElementById("memoryPhoto");

    const titleInput = document.getElementById("memoryTitle");
    const descriptionInput = document.getElementById("memoryDescription");
    const dateInput = document.getElementById("memoryDate");

    const previewContainer = document.getElementById("photoPreview");
    const previewImage = document.getElementById("previewImage");
    const removePreviewButton = document.getElementById("removePreview");

    const gallery = document.getElementById("memoryGallery");
    const totalMoments = document.getElementById("totalMoments");

    let previewUrl = null;

    // -----------------------------------------
    // 2. FECHA ACTUAL
    // -----------------------------------------

    function getToday() {

        const today = new Date();

        // El input date requiere el formato AAAA-MM-DD aunque la interfaz esté en español.
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    dateInput.value = getToday();

    // -----------------------------------------
    // 3. VISTA PREVIA DE LA FOTOGRAFÍA
    // -----------------------------------------

    photoInput.addEventListener("change", () => {

        const file = photoInput.files[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        // Reviso tipo y tamaño antes de crear la vista previa para evitar archivos no admitidos.
        if (!allowedTypes.includes(file.type)) {
            alert("Selecciona una imagen JPG, PNG o WEBP.");
            photoInput.value = "";
            return;
        }

        if (file.size > 8 * 1024 * 1024) {
            alert("La fotografía no puede superar los 8 MB.");
            photoInput.value = "";
            return;
        }

        // Liberar una vista previa anterior.
        clearPreview();

        previewUrl = URL.createObjectURL(file);
        previewImage.src = previewUrl;

        previewContainer.classList.remove("hidden");
    });

    // Quitar la fotografía seleccionada.
    removePreviewButton.addEventListener("click", () => {

        photoInput.value = "";
        clearPreview();

        previewContainer.classList.add("hidden");
    });

    function clearPreview() {

        previewImage.src = "";

        if (previewUrl) {
            // Libero la URL temporal para no dejar recursos ocupados al cambiar de foto.
            URL.revokeObjectURL(previewUrl);
            previewUrl = null;
        }
    }

    // -----------------------------------------
    // 4. AGREGAR UN RECUERDO
    // -----------------------------------------

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        const file = photoInput.files[0];

        const title = titleInput.value.trim();
        const description = descriptionInput.value.trim();
        const date = dateInput.value;

        if (!file) {
            alert("Selecciona una fotografía.");
            return;
        }

        if (!title || !date) {
            alert("Completa el título y la fecha.");
            return;
        }

        const newMemory = {
            id: crypto.randomUUID(),
            title: title,
            description: description,
            date: date,
            createdAt: new Date().toISOString()
        };

        const submitButton = form.querySelector(
            'button[type="submit"]'
        );

        submitButton.disabled = true;
        submitButton.textContent = "Guardando...";

        try {

            // moments.js controla la interfaz; storage.js se encarga de persistir los datos y la foto.
            await window.NuestroHogarStorage.addMemory(
                newMemory,
                file
            );

            form.reset();
            dateInput.value = getToday();

            clearPreview();
            previewContainer.classList.add("hidden");

            await renderGallery();

            alert("¡Nuestro recuerdo quedó guardado! ♡");

        } catch (error) {

            console.error("Error guardando el recuerdo:", error);

            alert(
                "No fue posible guardar el recuerdo. Inténtalo nuevamente."
            );

        } finally {

            submitButton.disabled = false;
            submitButton.textContent = "Guardar recuerdo ♡";
        }
    });

    // -----------------------------------------
    // 5. MOSTRAR LA GALERÍA
    // -----------------------------------------

    async function renderGallery() {

        const memories =
            window.NuestroHogarStorage.getMemories();

        gallery.innerHTML = "";

        // El contador refleja los registros válidos, aunque alguno no tenga una foto recuperable.
        totalMoments.textContent = memories.length;

        if (memories.length === 0) {
            showEmptyGallery();
            return;
        }

        for (const memory of memories) {

            try {

                let imageBlob = null;

                try {
                    imageBlob =
                        await window.NuestroHogarStorage.getPhoto(memory.id);
                } catch (error) {
                    console.warn(
                        "No se pudo cargar la fotografía del recuerdo:",
                        memory.id,
                        error
                    );
                }

                // Crear tarjeta.
                const card = document.createElement("article");
                card.className = "memory-card";

                if (imageBlob) {
                    // La URL temporal permite mostrar el Blob que IndexedDB devuelve.
                    const imageUrl = URL.createObjectURL(imageBlob);
                    const image = document.createElement("img");
                    image.src = imageUrl;
                    image.alt = memory.title;

                    image.addEventListener("load", () => {
                        URL.revokeObjectURL(imageUrl);
                    }, { once: true });

                    image.addEventListener("error", () => {
                        URL.revokeObjectURL(imageUrl);
                    }, { once: true });

                    card.appendChild(image);
                } else {
                    // No oculto el recuerdo si la foto falta: muestro su información y un marcador.
                    console.warn(
                        "No se encontró la fotografía del recuerdo:",
                        memory.id
                    );

                    const placeholder = document.createElement("div");
                    placeholder.className = "memory-image-placeholder";
                    placeholder.textContent = "Fotografía no disponible";
                    card.appendChild(placeholder);
                }

                // Contenido.
                const content = document.createElement("div");
                content.className = "memory-card-content";

                const title = document.createElement("h3");
                title.textContent = memory.title;

                const description = document.createElement("p");
                description.textContent =
                    memory.description || "Un momento para recordar ♡";

                const date = document.createElement("span");
                date.className = "memory-date";
                date.textContent = formatDate(memory.date);

                // Botón eliminar.
                const deleteButton = document.createElement("button");
                deleteButton.className = "delete-memory";
                deleteButton.type = "button";
                deleteButton.textContent = "Eliminar recuerdo";

                deleteButton.addEventListener("click", () => {
                    removeMemory(memory.id);
                });

                content.append(
                    title,
                    description,
                    date,
                    deleteButton
                );

                card.appendChild(content);
                gallery.appendChild(card);

            } catch (error) {

                console.error(
                    "Error mostrando el recuerdo:",
                    memory.id,
                    error
                );
            }
        }
    }

    // -----------------------------------------
    // 6. GALERÍA VACÍA
    // -----------------------------------------

    function showEmptyGallery() {

        // Este mensaje se crea desde JS para usar la misma función en cada carga de la galería.
        const empty = document.createElement("div");
        empty.className = "gallery-empty";

        const heart = document.createElement("span");
        heart.textContent = "♡";

        const heading = document.createElement("h3");
        heading.textContent = "Nuestro álbum comienza aquí";

        const message = document.createElement("p");
        message.textContent =
            "Agrega esa primera fotografía que quieras conservar.";

        empty.append(heart, heading, message);
        gallery.appendChild(empty);
    }

    // -----------------------------------------
    // 7. ELIMINAR UN RECUERDO
    // -----------------------------------------

    async function removeMemory(id) {

        const confirmed = confirm(
            "¿Seguro que quieres eliminar este recuerdo?"
        );

        if (!confirmed) return;

        try {

            await window.NuestroHogarStorage.removeMemory(id);

            await renderGallery();

        } catch (error) {

            console.error("Error eliminando el recuerdo:", error);

            alert("No fue posible eliminar el recuerdo.");
        }
    }

    // -----------------------------------------
    // 8. FORMATEAR FECHAS
    // -----------------------------------------

    function formatDate(dateString) {

        // Creo la fecha con valores numéricos para evitar diferencias de zona horaria.
        const [year, month, day] = dateString.split("-");

        const date = new Date(
            Number(year),
            Number(month) - 1,
            Number(day)
        );

        return new Intl.DateTimeFormat("es-CO", {
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(date);
    }

    // -----------------------------------------
    // 9. INICIAR EL MÓDULO
    // -----------------------------------------

    async function initialize() {

        try {

            // Primero espero a IndexedDB; después ya puedo cargar los recuerdos y sus fotografías.
            await window.NuestroHogarStorage.init();

            await renderGallery();

            console.log("Nuestros Instantes está funcionando.");

        } catch (error) {

            console.error("Error iniciando el módulo:", error);

            gallery.textContent =
                "No fue posible cargar el álbum. Revisa el almacenamiento del navegador.";
        }
    }

    initialize();

});
