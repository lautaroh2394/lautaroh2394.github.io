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

const playRandomEpisode = async (id, totalEpisodios) => {
    const res = await getRandomEpisode(id, totalEpisodios);
    if (res.error){
        page.showAuth(res.error.message);
        return;
    }
    open(res.items[0].uri)
}