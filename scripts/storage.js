
/*
Responsabilidad: administrar el almacenamiento.
- localStorage: información de los recuerdos.
- IndexedDB: fotografías.
*/

window.NuestroHogarStorage = (() => {

    const DB_NAME = "NuestroHogarDB";
    const DB_VERSION = 1;
    const STORE_NAME = "fotografias";
    const STORAGE_KEY = "nuestroHogar_instantes";

    let database = null;

    // Confirmo el formato y que la fecha exista realmente (por ejemplo, rechazo el 31 de febrero).
    function isValidMemory(memory) {
        if (
            memory === null ||
            typeof memory !== "object" ||
            typeof memory.id !== "string" ||
            memory.id.length === 0 ||
            typeof memory.title !== "string" ||
            memory.title.trim().length === 0 ||
            typeof memory.description !== "string" ||
            typeof memory.date !== "string" ||
            !/^\d{4}-\d{2}-\d{2}$/.test(memory.date)
        ) {
            return false;
        }

        const [year, month, day] = memory.date.split("-").map(Number);
        const parsedDate = new Date(year, month - 1, day);

        return parsedDate.getFullYear() === year &&
            parsedDate.getMonth() === month - 1 &&
            parsedDate.getDate() === day;
    }

    // Abrir o crear la base de datos IndexedDB.
    function init() {
        return new Promise((resolve, reject) => {

            // IndexedDB se usa para las fotos, que pueden ser demasiado grandes para localStorage.
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, {
                        keyPath: "id"
                    });
                }
            };

            request.onsuccess = (event) => {
                database = event.target.result;

                database.onversionchange = () => {
                    // Cierro la conexión si otra pestaña actualiza la base de datos.
                    database.close();
                    database = null;
                };

                resolve();
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Comprobar que IndexedDB esté inicializada.
    function getDatabase() {
        if (!database) {
            throw new Error("La base de datos no está inicializada.");
        }

        return database;
    }

    // Obtener todos los recuerdos guardados.
    function getMemories() {
        try {
            const savedMemories = localStorage.getItem(STORAGE_KEY);
            const parsedMemories = savedMemories ? JSON.parse(savedMemories) : [];

            if (!Array.isArray(parsedMemories)) {
                throw new Error("Los datos guardados de recuerdos no son una lista.");
            }

            // Solo regreso registros que tengan los campos que necesita la galería.
            const validMemories = parsedMemories.filter(isValidMemory);

            if (validMemories.length !== parsedMemories.length) {
                console.warn("Se omitieron recuerdos guardados con datos inválidos.");
            }

            return validMemories;

        } catch (error) {
            console.error("Error leyendo recuerdos:", error);
            return [];
        }
    }

    // Guardar la información de los recuerdos.
    function saveMemories(memories) {
        // Los textos y las fechas ocupan poco espacio, por eso se guardan como JSON.
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(memories)
        );
    }

    // Guardar una fotografía.
    function savePhoto(id, file) {
        return new Promise((resolve, reject) => {

            const transaction = getDatabase().transaction(
                STORE_NAME,
                "readwrite"
            );

            const store = transaction.objectStore(STORE_NAME);

            // El mismo ID enlaza la fotografía con los datos del recuerdo en localStorage.
            store.put({
                id: id,
                image: file
            });

            transaction.oncomplete = () => resolve();

            transaction.onerror = () => {
                reject(transaction.error);
            };

            transaction.onabort = () => {
                reject(transaction.error);
            };
        });
    }

    // Recuperar una fotografía por su identificador.
    function getPhoto(id) {
        return new Promise((resolve, reject) => {

            const transaction = getDatabase().transaction(
                STORE_NAME,
                "readonly"
            );

            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(id);

            request.onsuccess = () => {
                // Si no existe la foto, devuelvo null para que la galería muestre un aviso.
                resolve(request.result?.image || null);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Eliminar una fotografía.
    function deletePhoto(id) {
        return new Promise((resolve, reject) => {

            const transaction = getDatabase().transaction(
                STORE_NAME,
                "readwrite"
            );

            const store = transaction.objectStore(STORE_NAME);
            store.delete(id);

            transaction.oncomplete = () => resolve();

            transaction.onerror = () => {
                reject(transaction.error);
            };

            transaction.onabort = () => {
                reject(transaction.error);
            };
        });
    }

    // Guardar un recuerdo y su fotografía.
    async function addMemory(memory, image) {

        const memories = getMemories();

        // Primero guardo la foto; luego registro sus datos usando el mismo identificador.
        await savePhoto(memory.id, image);

        try {
            // Después guardamos los datos del recuerdo.
            memories.unshift(memory);
            saveMemories(memories);

        } catch (error) {
            // Si falla el almacenamiento de texto,
            // intentamos eliminar la fotografía guardada.
            try {
                await deletePhoto(memory.id);
            } catch (cleanupError) {
                console.error(
                    "No se pudo eliminar la fotografía tras fallar el guardado:",
                    cleanupError
                );
            }
            throw error;
        }
    }

    // Eliminar un recuerdo y su fotografía.
    async function removeMemory(id) {

        const memories = getMemories();

        const updatedMemories = memories.filter(
            memory => memory.id !== id
        );

        // Actualizo primero los datos y, si falla borrar la foto, restauro la lista anterior.
        saveMemories(updatedMemories);

        try {
            await deletePhoto(id);
        } catch (error) {
            // Si falla IndexedDB, restauramos la lista anterior.
            saveMemories(memories);
            throw error;
        }
    }

    // Exponer las funciones para que moments.js pueda utilizarlas.
    return {
        init,
        getMemories,
        getPhoto,
        addMemory,
        removeMemory
    };

})();
