importScripts("/src/spotify-utils.js");

const CACHE_NAME = "PodcastRandomizer";
const ASSETS_TO_CACHE = [
    "/assets/icon.png",
    "/assets/loading-spinner.gif",
    "/",
    "/src/dom-utils.js",
    "/src/spotify-utils.js",
    "/src/view.js",
    "/styles/styles.css",
]

const IDB_VERSION = 20;
const IDB_OBJ_STORE_SAVED_EP = "SavedEpisodes";
const IDB_NAME = "PodcastRandomizer";
const API_DELAY = 350;
const PODCAST_RANDOMIZER_ORIGIN = "https://lautaroh2394.github.io"

// Install
self.addEventListener('install', function(event) {
    // Perform install steps
    console.log("Instalando service worker...")
    
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
            //No hay conexión. Solo cacheo página principal. Should cache bootstrap?
            const origin = new URL(event.request.url).origin
            const shouldCache = origin == PODCAST_RANDOMIZER_ORIGIN
            shouldCache && caches.open(CACHE_NAME).then(cache => {
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