const CACHE_NAME = "PodcastRandomizer";
const ASSETS_TO_CACHE = [
    "/assets/icon.png",
    "/assets/loading-spinner.gif",
    "/",
    "/no-connection.html",
    "/src/dom-utils.js",
    "/src/spotify-utils.js",
    "/src/View.js",
    "/styles/styles.css",
    "/src/idb-helper.js"
]

const IDB_VERSION = 14;
const IDB_OBJ_STORE_SAVED_EP = "SavedEpisodes";
const IDB_NAME = "PodcastRandomizer";

// Install
self.addEventListener('install', function(event) {
    // Perform install steps
    console.log("Instalando service worker...")
    if ('indexedDB' in self) {
        //Creo object store para guardar listas de ids de episodios
        //Guardo usando el id del podcast como key. En value guardo un json con la info necesaria para mostrar el podcast en una lista y la lista de urls de todos los capitulos
        console.log("Creando IDB...")
        let dbOpenRequest = indexedDB.open(IDB_NAME, IDB_VERSION);
        
        dbOpenRequest.onupgradeneeded = ev => {
            console.log("Actualizando IDB...");
            let db = ev.target.result;
            if (!db.objectStoreNames.contains(IDB_OBJ_STORE_SAVED_EP)){
                db.createObjectStore(IDB_OBJ_STORE_SAVED_EP, {keyPath : "id"})
            }
        }
    }
    
    //Guardo assets para cuando no hay internet
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS_TO_CACHE)
        }).then(r => console.log("Service Worker instalado"))
    )
});

//Activate para nuevas versiones
self.addEventListener('activate', event => {
    console.log('Nueva versión instalada');
});

// Catch fetch
self.addEventListener('fetch', async function(event) {
    event.respondWith(new Promise(async resolve => {
        try{
            let res = await fetch(event.request);
            resolve(res);
        }
        catch(error){
            //No hay conexión
            caches.open(CACHE_NAME).then(cache => {
                cache.match(event.request.clone()).then(response => {
                    if (response){
                        //Hay response cacheada
                        resolve(response)
                    }
                    else{
                        //No hay response cacheada
                        resolve(fetch(event.request))
                    }
                })
            })
        }
    }))
});

//Recibo mensajes del client
self.addEventListener("message", async event => {
    let dbOpenRequest;
    switch (event.data.execute){
        case "save":
            dbOpenRequest = indexedDB.open(IDB_NAME, IDB_VERSION);
            dbOpenRequest.onsuccess = ev => {
                let db = ev.target.result
                let store = db.transaction(IDB_OBJ_STORE_SAVED_EP,"readwrite").objectStore(IDB_OBJ_STORE_SAVED_EP)
                store.add(event.data.podcast)
                console.log(`Guardado item en ${IDB_OBJ_STORE_SAVED_EP}`)
            }
            dbOpenRequest.onerror = ev => {
                console.log("Error al abrir el store", ev)
            }
            break
            /*
            //Por ahora no me interesa responder
            const client = await clients.get(ev.clientId);
            client.postMessage("hello")
            */
        case "check-saved":
            dbOpenRequest = indexedDB.open(IDB_NAME, IDB_VERSION);
            dbOpenRequest.onsuccess = ev => {
                let db = ev.target.result
                let store = db.transaction(IDB_OBJ_STORE_SAVED_EP,"readwrite").objectStore(IDB_OBJ_STORE_SAVED_EP)
                
                let dbQueryRequest = store.getAll();
                dbQueryRequest.onsuccess = ev => {
                    if (ev.target.result.length > 0){
                        event.source.postMessage({
                            "type": "saved-episodes",
                            "podcast-list": ev.target.result
                        })
                    }
                }
                dbQueryRequest.onerror = ev => {
                    console.log("Error en la query", ev)
                }
            }
            dbOpenRequest.onerror = ev => {
                console.log("Error al abrir el store", ev)
            }
            break
        default:
            console.log(`No se pudo procesar el mensaje recibido en sw con atributo execute con valor ${event.data.execute}`)
    }
})
//TODO: Refactorear las llamadas a IDB, se repite mucho código