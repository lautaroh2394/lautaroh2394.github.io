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

const getSearchParams = _ => {
    //TODO
    return "?q=trasnoche&type=show"
}

const search = async input => {
    const url = 'https://api.spotify.com/v1/search' + getSearchParams();
    const res = await fetch(buildRequest(url));
    return await res.json();
}

const View = {
    askLogin: _ => {
        //TODO - Mostrar popup pidiendo autorizacion. Boton que si se clickea se redirige a la url de autorizacion de spotify
        console.log("askLogin")
    },
    showSearch: _=> {
        //TODO - Mostrar barra de búsqueda con botón de búsqueda. El botón sólo se habilita luego de ingresados 5 caracteres
        console.log("showSearch")
    }
}