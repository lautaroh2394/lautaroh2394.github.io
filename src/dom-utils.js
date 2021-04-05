const create = ({tag, clases, children, attributes, textContent, events}) => {
    let el = document.createElement(tag);
    clases && clases.forEach(clase => el.classList.add(clase));
    children && children.forEach(child => el.append(create(child)));
    attributes && Object.keys(attributes).forEach(attrKey => el.setAttribute(attrKey, attributes[attrKey]));
    textContent && (el.textContent = textContent);
    events && Object.keys(events).forEach(event => {
        el.addEventListener(event, events[event])
    })
    return el
}

const addListRow = ({name, description, imgSrc, publisher, episodes, spotifyUri, id, nroFila, callback}) => {
    callback = callback || (ev => playRandomEpisode({name, description, imgSrc, publisher, episodes, spotifyUri, id}));
    nroFila = nroFila || "1";
    let el = create({
        tag: "div",
        clases: ["accordion-item"],
        children: [
            {
                tag: "h2",
                clases: ["accordion-header"],
                attributes: {
                    "id": "heading" + nroFila
                },
                children: [
                    {
                        tag: "button",
                        clases: ["accordion-button", "collapsed"],
                        attributes: {
                            type: "button",
                            "data-bs-toggle": "collapse",
                            "data-bs-target" : "#collapse" + nroFila,
                            "aria-expanded" : "true",
                            "aria-controls" : "collapse" + nroFila
                        },
                        children: [
                            {
                                tag: "div",
                                clases: ["accordion-item-title"],
                                children:[
                                    {
                                        tag: "img",
                                        attributes: {
                                            "src" : imgSrc
                                        }
                                    },
                                    {
                                        tag: "div",
                                        clases: ["accordion-item-name", "flex-center"],
                                        children: [
                                            {
                                                tag: "span",
                                                textContent: name
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                tag: "div",
                clases:[
                    "accordion-collapse",
                    "collapse",
                    /*"show"*/
                ],
                attributes:{
                    "id": "collapse" + nroFila,
                    "aria-labelledby" : "heading" + nroFila,
                    /*"data-bs-parent" : "#accordionExample"*/
                },
                children: [
                    {
                        tag: "div",
                        clases: ["accordion-body"],
                        children:[
                            {
                                tag: "div",
                                clases: [
                                    "accordion-item-detalles"
                                ],
                                children:[
                                    {
                                        tag: "div",
                                        clases: [
                                            "flex-2"
                                        ],
                                        children:[
                                            {
                                                tag:"img",
                                                attributes:{
                                                    src: imgSrc
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        tag: "div",
                                        clases: [
                                            "cell",
                                            "nombre",
                                            "flex-center"
                                        ],
                                        children:[
                                            {
                                                tag:"h3",
                                                textContent: name
                                            }
                                        ]
                                    },
                                    {
                                        tag: "div",
                                        clases: [
                                            "flex-3",
                                            "flex-center"
                                        ],
                                        children:[
                                            {
                                                tag: "h6",
                                                textContent: publisher
                                            }
                                        ]
                                    },
                                    {
                                        tag: "div",
                                        clases: [
                                            "flex-2",
                                            "flex-center"
                                        ],
                                        children: [
                                            {
                                                tag: "h6",
                                                textContent: episodes
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                tag: "div",
                                clases: ["play-random"],
                                children:[
                                    {
                                        tag: "button",
                                        clases: [
                                            "btn",
                                            "btn-success"
                                        ],
                                        attributes: {
                                            type: "button"
                                        },
                                        textContent: "Reproducir aleatorio",
                                        events: {
                                            click: callback
                                        }
                                    }
                                ]
                            },
                            {
                                tag: "div",
                                clases: [
                                    "accordion-item-descripcion",
                                    "flex-center"
                                ],
                                children:[
                                    {
                                        tag: "span",
                                        textContent: description
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
);

    resultados.appendChild(el);
    return (parseInt(nroFila) + 1).toString();
}

const emptyList = _ => {
    [...resultados.children].forEach(child => resultados.removeChild(child))
}

const setEvents = _ => {
    autorizar.addEventListener("click", ev => {
        window.location = "https://accounts.spotify.com/authorize?client_id=76fb0a13403d4147b10d78950a9fe7d2&redirect_uri=https%3A%2F%2Flautaroh2394.github.io&response_type=token";
    })

    BUSQUEDA_BTN.addEventListener("click", async ev => {
        emptyList();
        page.showLoading();
    
        let val = BUSQUEDA_INPUT.value;
        const res = await search(val);
        if (res.error){
            page.showAuth(res.error.message);
            return;
        }
        
        const listaPodcasts = res.shows.items
        listaPodcasts.reduce((prev, podcast) => {
            return addListRow({
                name: podcast.name,
                description: podcast.description,
                episodes: podcast.total_episodes,
                imgSrc: podcast.images.reduce((prev,curr) => curr.height < prev.height ? curr : prev).url,
                publisher: podcast.publisher,
                spotifyUri: podcast.uri,
                id: podcast.id,
                nroFila: prev
            })
        }, 1)

        page.hideLoading();
    })

    BUSQUEDA_INPUT.addEventListener("keydown", ev => {
        ev.keyCode == 13 && BUSQUEDA_BTN.click()
    })

    window.addEventListener("offline", ev => {
        page.toggleOffline(ev.type)
    })
    window.addEventListener("online", ev => {
        page.toggleOffline(ev.type)
    })

    guardados.addEventListener("click", ev => {
        emptyList();
        page.showLoading();

        if (window.GUARDADOS){
            //TODO: Debería de queriear a la idb en vez de guardarse al inicio de la pantalla. O cada vez que se guarde un podcast, actualizar en el client la lista.
            GUARDADOS.reduce((prev, podcast) => {
                return addListRow({
                    name: podcast.podcast_data.name,
                    description: podcast.podcast_data.description,
                    imgSrc: podcast.podcast_data.imgSrc,
                    publisher: podcast.podcast_data.publisher,
                    episodes: podcast.podcast_data.totalEpisodios,
                    spotifyUri: podcast.podcast_data.spotifyUri,
                    id: podcast.id,
                    nroFila: prev,
                    callback: ev => {
                        //Open randomly from podcast.podcast_episodes
                        const random = parseInt(Math.random() * 100000 % podcast.podcast_episodes.length);
                        open(podcast.podcast_episodes[random])
                    }
                })
            }, 1)
    
            page.hideLoading();
        }
    })
}

const setSW = _ =>{
    if ('serviceWorker' in navigator) {
        if (!navigator.serviceWorker.controller){
            navigator.serviceWorker.register('/sw.js').then(function(registration) {
                // Registration was successful
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, function(err) {
                // registration failed :(
                console.log('ServiceWorker registration failed: ', err);
            });
        }

        navigator.serviceWorker.addEventListener('message', processPostedMessage)
        navigator.serviceWorker.controller.postMessage({execute:"check-saved"})
    }
}

const startPage = _ =>{
    window.BUSQUEDA_BTN = document.querySelector("#busqueda-btn");
    window.BUSQUEDA_INPUT = document.querySelector("#busqueda-input");
    
    setEvents();
    setSW();
    page.start();
}