const getSpotifyParams = _ => {
    if (window.Params) return Params;

    const regex = RegExp(`https?:\/\/${window.location.host}/?#`);
    const spotifyParams = window.location.toString().replace(regex,"");
    window.Params = spotifyParams.split("&").map(param => param.split("=")).reduce( (prev, curr) => {
        prev[curr[0]] = curr[1]
        return prev
    }, {})
    return Params;
}

const getSpotifyToken = _ => getSpotifyParams().access_token;

const buildRequest = (url) => {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${getSpotifyToken()}`);
    return new Request(url, {headers})
}

const getCurrentUserInfo = async _ => {
    const url = 'https://api.spotify.com/v1/me';
    const res = await fetch(buildRequest(url));
    return await res.json();
}

const estoyAutorizado = _ => !!getSpotifyToken()

const getSearchParams = input => {
    return `?q=${encodeURI(input)}&type=show`;
}

const search = async input => {
    const url = 'https://api.spotify.com/v1/search' + getSearchParams(input);
    const res = await fetch(buildRequest(url));
    return await res.json();
}

const getRandomEpisode = async (id, totalEpisodios) => {
    const random = parseInt(Math.random() * 100000 % totalEpisodios);
    const url = `https://api.spotify.com/v1/shows/${id}/episodes?limit=1&${random != 0 ? `offset=${random}` : ``}`;
    const res = await fetch(buildRequest(url));
    return await res.json();
}

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

const playRandomEpisode = async (id, totalEpisodios) => {
    const res = await getRandomEpisode(id, totalEpisodios);
    open(res.items[0].uri)
}
const addListRow = ({name, description, imgSrc, publisher, episodes, spotifyUri, id}) => {
    let el = create({
        tag : "div",
        clases : ["row"],
        children : [
            {
                tag: "div",
                clases: ["cell", "img"],
                children : [ { tag: "img", attributes: {src: imgSrc} }]
            },
            {
                tag: "div",
                clases: ["cell", "nombre"],
                children : [ 
                    { 
                        tag: "div",
                        clases: ["nombre"],
                        children: [{tag: "span", textContent: name}] 
                    },
                    { 
                        tag: "div",
                        clases: ["descripcion"],
                        children: [{tag: "span", textContent: description}] 
                    }
                ]
            },
            {
                tag: "div",
                clases: ["cell", "publisher"],
                children : [ { tag: "h4", textContent: publisher }]
            },
            {
                tag: "div",
                clases: ["cell", "episodios"],
                children : [ { tag: "h4", textContent: episodes }]
            },
            /*{
                tag: "div",
                clases: ["cell", "play"],
                children : [ { tag: "h4", textContent: "Elegir" }]
            },*/
            {
                tag: "div",
                clases: ["cell", "play-in-spotify"],
                children : [ 
                    { 
                        tag: "img", 
                        /*textContent: "Abrir en spotify",*/
                        clases: ["sm-click-img"],
                        attributes: {
                            src: "random.png",
                        }
                    }
                ],
                events: {
                    click: ev => playRandomEpisode(id, episodes)
                }
            }
        ]
    });

    TABLA.appendChild(el);
}

const emptyList = _ => {
    [...TABLA.children].forEach(child => TABLA.removeChild(child))
}

const setEvents = _ => {
    autorizar.addEventListener("click", ev => {
        window.location = "https://accounts.spotify.com/authorize?client_id=76fb0a13403d4147b10d78950a9fe7d2&redirect_uri=https%3A%2F%2Flautaroh2394.github.io&response_type=token";
    })

    BUSQUEDA_BTN.addEventListener("click", async ev => {
        emptyList();
    
        let val = BUSQUEDA_INPUT.value;
        const res = await search(val);
        if (res.error){
            pageView.showError(res.error);
            return;
        }
        
        const listaPodcasts = res.shows.items
        listaPodcasts.forEach(podcast => {
            addListRow({
                name: podcast.name,
                description: podcast.description,
                episodes: podcast.total_episodes,
                imgSrc: podcast.images.reduce((prev,curr) => curr.height < prev.height ? curr : prev).url,
                publisher: podcast.publisher,
                spotifyUri: podcast.uri,
                id: podcast.id
            })
        })
    })

    BUSQUEDA_INPUT.addEventListener("keydown", ev => {
        ev.keyCode == 13 && BUSQUEDA_BTN.click()
    })
}

const startPage = (test = false) =>{
    window.TABLA = document.querySelector("div.table");
    window.BUSQUEDA_BTN = document.querySelector("#busqueda-btn");
    window.BUSQUEDA_INPUT = document.querySelector("#busqueda-input");
    
    setEvents();
    pageView.start();

    if (test){
        pageView.showSearch()
        pageView.showBlockParent("[name=busqueda]");
        addListRow({name:"adsdf", description:"adsdf adsdf adsdf adsdf adsdf adsdf adsdf adsdf adsdf adsdf adsdf adsdf adsdf adsdf adsdf adsdf adsdf adsdf adsdf adsdf adsdf adsdf adsdf adsdf ", imgSrc:"https://i.scdn.co/image/9efc9c4c9c0d8a1c9290faf2686510eb57a891b0", publisher:"adsdf", episodes:"adsdf", spotifyUri:"adsdf"})
    }
}