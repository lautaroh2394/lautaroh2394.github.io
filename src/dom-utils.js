import pageModel from './view.js';
import { spotifySearch, playRandomEpisode } from './spotify-utils.js';
import { SAVED_PODCASTS, SPOTIFY_APP_URL } from './constants.js';
import { SavedItem } from './models/saved-item.js';
import { AccordionItem } from './models/accordion-item.js';

export const create = ({
  tag, classes, children, attributes, textContent, events,
}) => {
  const el = document.createElement(tag);
  if (classes) classes.forEach((clase) => el.classList.add(clase));
  if (children) children.forEach((child) => {
    const appendable = child instanceof HTMLElement ? child : create(child)
    el.append(appendable)
  });
  if (attributes) {
    Object.keys(attributes).forEach((attrKey) => el.setAttribute(attrKey, attributes[attrKey]));
  }
  if (textContent) (el.textContent = textContent);
  if (events) {
    Object.keys(events).forEach((event) => {
      el.addEventListener(event, events[event]);
    });
  }
  return el;
};

const sameId = (id) => (podcastParam) => podcastParam.id === id;
const updateSaved = (saved) => {
  localStorage.setItem(SAVED_PODCASTS, JSON.stringify(saved));
  return saved;
};
export const getSaved = () => JSON.parse(localStorage.getItem(SAVED_PODCASTS)) || [];
const deleteAndReturnUpdated = (id) => {
  let saved = getSaved();
  const index = saved.findIndex((podcast) => podcast.id === id);
  saved = [
    saved.slice(0, index),
    saved.slice(index + 1, saved.length),
  ].flat();
  updateSaved(saved);
  return getSaved();
};
export const deleteFromSavedCallbackGenerator = (id) => {
  return () => {
    const saved = deleteAndReturnUpdated(id);
    updateSaved(saved);
    pageModel.configureSaved(saved);
  };
};
const savePodcastData = (params) => {
  let saved = getSaved();
  const sameIdAsPodcast = sameId(params.id);
  const alreadySaved = saved.some(sameIdAsPodcast);
  if (alreadySaved) {
    saved = deleteAndReturnUpdated(params.id);
  }
  saved.push(params);
  return updateSaved(saved);
};

export const clickPlayCallbackGenerator = (params) => {
  return async () => {
    playRandomEpisode(params);
    const saved = savePodcastData(params);
    pageModel.configureSaved(saved);
  };
};

const addResult = (params) => {
  const el = AccordionItem(params)
  SearchResults.appendChild(el);
  return (parseInt(params.fileNumber) + 1).toString();
};

export const addSaved = (params) => {
  const el = SavedItem(params)
  SavedPodcastsList.appendChild(el);
};


export const emptyList = (element) => {
  if (element.children) {
    [...element.children].forEach((child) => element.removeChild(child));
  }
};

const setEvents = (_) => {
  Authorize.addEventListener('click', (ev) => {
    window.location = SPOTIFY_APP_URL;
  });

  SearchButton.addEventListener('click', async (ev) => {
    emptyList(SearchResults);
    pageModel.showLoading();

    const val = SearchInput.value;
    const res = await spotifySearch(val);
    if (res.error) {
      pageModel.showAuth(res.error.message);
      return;
    }

    const listaPodcasts = res.shows.items;
    listaPodcasts.reduce((prevPodcastNumber, podcast) => {
      return addResult({
        ...podcast,
        fileNumber: prevPodcastNumber,
        episodes: podcast.total_episodes,
      });
    }, 1);

    pageModel.hideLoading();
  });

  SearchInput.addEventListener('keydown', (ev) => {
    if (ev.keyCode === 13) SearchButton.click();
  });

  window.addEventListener('offline', (ev) => {
    pageModel.toggleOffline(ev.type);
  });
  window.addEventListener('online', (ev) => {
    pageModel.toggleOffline(ev.type);
  });

  SavedPodcasts.addEventListener('click', () => {
    pageModel.toggleSavedPodcasts();
  });

  ShowingSavedPodcasts.addEventListener('click', () => {
    pageModel.toggleSavedPodcasts();
  });
};

const setSW = (_) => {
  if ('serviceWorker' in navigator) {
    if (!navigator.serviceWorker.controller) {
      navigator.serviceWorker.register('/sw.js').then((registration) => {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, (err) => {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
      });
    }

    navigator.serviceWorker.addEventListener('message', processPostedMessage);
  }
};

export const startPage = (_) => {
  setEvents();
  // setSW(); //todo
  pageModel.start();
};
