const CACHE_NAME = "PodcastRandomizer";
const assets_to_cache = [
    "/assets/icon.png",
    "/assets/loading-spinner.gif",
    "/",
    "/no-connection.html",
    "/src/dom-utils.js",
    "/src/spotify-utils.js",
    "/src/View.js",
    "/styles/styles.css"
]

// Install
self.addEventListener('install', function(event) {
    // Perform install steps
    console.log("Instalando...")
    //Guardo assets para cuando no hay internet
    event.waitUntil(/*new Promise(resolve => {*/
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(assets_to_cache)
        }).then(r => console.log("Instalado"))
        /*
        fetch("/no-connection.html").then(response => {
            caches.open(CACHE_NAME).then(cache => {
                cache.put(new Request("/no-connection.html"), response);
            })
            console.log("Instalado")
            resolve();
        })
        */
    /*})*/)
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
                        //TODO: Call Client para disparar la llamada y que detecte que está offline 
                        resolve(fetch(event.request))
                    }
                })
            })
        }
    }))
});