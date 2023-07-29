import pageModel from './view.js';
import { spotifySearch, playRandomEpisode } from './spotify-utils.js';
import { SAVED_PODCASTS, SPOTIFY_APP_URL } from './constants.js';
import { AccordionItem, DeleteAllButton, SavedItem } from './models.js';

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
