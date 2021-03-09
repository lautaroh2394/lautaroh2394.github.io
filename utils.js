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

const create = ({tag, clases, children, attributes, textContent}) => {
    let el = document.createElement(tag);
    clases && clases.forEach(clase => el.classList.add(clase));
    children && children.forEach(child => el.append(create(child)));
    attributes && Object.keys(attributes).forEach(attrKey => el.setAttribute(attrKey, attributes[attrKey]));
    textContent && (el.textContent = textContent);
    return el
}

const addListRow = ({name, description, imgSrc, publisher, episodes, spotifyUri}) => {
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
            {
                tag: "div",
                clases: ["cell", "play"],
                children : [ { tag: "h4", textContent: "Elegir" }]
            },
            {
                tag: "div",
                clases: ["cell", "play-in-spotify"],
                children : [ { tag: "href", textContent: "Abrir en spotify", attributes: {src: spotifyUri} }]
            }
        ]
    });

    TABLA.appendChild(el);
}

const emptyList = _ => {
    [...TABLA.children].forEach(child => TABLA.removeChild(child))
}

const setEvents = _ =>{
    window.TABLA = document.querySelector("div.table");
    window.BUSQUEDA_BTN = document.querySelector("#busqueda-btn");
    window.BUSQUEDA_INPUT = document.querySelector("#busqueda-input");

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
                spotifyUri: podcast.uri
            })
        })
    })
}