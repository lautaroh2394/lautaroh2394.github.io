import pageModel from './view.js';
import { SPOTIFY_MAX_LIMIT, SPOTIFY_TOKEN_DETAILS } from './constants.js';

const getSpotifyParams = () => {
  if (window.spotifyTokenDetails) return window.spotifyTokenDetails;
  let spotifyTokenDetails = JSON.parse(localStorage.getItem(SPOTIFY_TOKEN_DETAILS))
  if (spotifyTokenDetails){
    const tokenIsValid = (Date.now() - Date.parse(spotifyTokenDetails.saved_at)) < (parseInt(spotifyTokenDetails.expires_in) * 1000)
    if (tokenIsValid) {
      window.spotifyTokenDetails = spotifyTokenDetails
      return spotifyTokenDetails
    }
  }

  const regex = RegExp(`https?://${window.location.host}/?#`);
  const spotifyParams = window.location.toString().replace(regex, '');
  window.spotifyTokenDetails = spotifyParams.split('&').map((param) => param.split('=')).reduce((prev, curr) => {
    prev[curr[0]] = curr[1];
    return prev;
  }, {});
  localStorage.setItem(SPOTIFY_TOKEN_DETAILS, JSON.stringify({...window.spotifyTokenDetails, saved_at: new Date().toISOString()}))
  return window.spotifyTokenDetails;
};

export const getSpotifyToken = () => getSpotifyParams().access_token

const buildRequest = (url) => {
  const token = getSpotifyToken();
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${token}`);
  return new Request(url, { headers });
};

export const isAuthorized = () => !!getSpotifyToken();

const getSearchParams = (input) => `?q=${encodeURI(input)}&type=show`;

export const spotifySearch = async (input) => {
  const url = `https://api.spotify.com/v1/search${getSearchParams(input)}`;
  const res = await fetch(buildRequest(url));
  return res.json();
};

const getRandomEpisode = async (id, totalEpisodios) => {
  const random = parseInt(Math.random() * (totalEpisodios + 1));
  const url = `https://api.spotify.com/v1/shows/${id}/episodes?limit=1&${random !== 0 ? `offset=${random}` : ''}`;
  const res = await fetch(buildRequest(url));
  return res.json();
};

export const getEpisodes = async (id, offset) => {
    const url = `https://api.spotify.com/v1/shows/${id}/episodes?limit=${SPOTIFY_MAX_LIMIT}&offset=${offset}`;
    const res = await fetch(buildRequest(url));
    if (res.error) {
      pageModel.showAuth(res.error.message);
      return;
    }
    return res.json();
}

export const playRandomEpisode = async ({ episodes, id }) => {
  const res = await getRandomEpisode(id, episodes);
  if (res.error) {
    pageModel.showAuth(res.error.message);
    return;
  }
  open(res.items[0].uri);
};

export const playEpisode = async (episode) => {
  open(episode.uri);
};
