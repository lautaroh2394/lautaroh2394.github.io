import pageModel from './view.js';
import { spotifySearch, playRandomEpisode, getEpisodes } from './spotify-utils.js';
import { SAVED_PODCASTS, SPOTIFY_APP_URL, SPOTIFY_MAX_LIMIT } from './constants.js';
import { SavedItem } from './models/saved-item.js';
import { AccordionItem } from './models/accordion-item.js';
import { AccordionEpisode } from './models/accordion-episode.js';

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

const save = (saved) => {
  localStorage.setItem(SAVED_PODCASTS, JSON.stringify(saved));
  return saved;
};
export const getAllSavedPodcasts = () => JSON.parse(localStorage.getItem(SAVED_PODCASTS)) || [];

const deleteById = (id) => {
  let saved = getAllSavedPodcasts();
  const index = saved.findIndex((podcast) => podcast.id === id);
  const updated  = [
    saved.slice(0, index),
    saved.slice(index + 1, saved.length),
  ].flat();
  return updated;
};

export const deleteFromSavedCallbackGenerator = (id) => {
  return () => {
    const updated = deleteById(id);
    save(updated);
    pageModel.configureSaved(updated);
  };
};
const savePodcast = (podcast) => {
  let updated = getAllSavedPodcasts();
  const alreadySaved = updated.some((id) => (podcastParam) => podcastParam.id === id);
  if (alreadySaved) {
    updated = deleteById(podcast.id);
  }
  updated.push(podcast);
  return save(updated);
};

export const clickPlayCallbackGenerator = (params) => {
  return async () => {
    playRandomEpisode(params);
    const saved = savePodcast(params);
    pageModel.configureSaved(saved);
  };
};

const addFoundEpisodes = (matches)=>{
  matches.reduce((prevEpisodeFileNumber, episode) => {
    const el = AccordionEpisode({...episode, fileNumber: prevEpisodeFileNumber})
    FoundPodcastEpisodes.appendChild(el);
    return prevEpisodeFileNumber + 1;
  }, 1);
}

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

  ReturnToSearch.addEventListener('click', ()=>{
    const currentState = window.history.state
    delete currentState.podcast
    pageModel.hide("#SearchingEpisode")
    window.history.pushState(currentState, null, '/');
    pageModel.start()
  })

  SearchEpisodesButton.addEventListener('click', async ()=>{
    pageModel.showLoading()
    emptyList(FoundPodcastEpisodes)
    
    const podcastData = window.history.state.podcast
    const query = SearchEpisodesInput.value.toLowerCase()

    const matches = await findEpisode(podcastData, query)
    if (matches.length == 0) {
      const dialogModal = new bootstrap.Modal(document.getElementById('DialogModal'), {
        keyboard: true,
        show: true,
        backdrop: true,
      });
      
      dialogModal.show();
      CloseDialogModal.onclick = ()=> dialogModal.hide()
    }
    addFoundEpisodes(matches)
    pageModel.hideLoading()
    pageModel.show("#FoundPodcastEpisodes")
  })

  SearchEpisodesInput.addEventListener('keydown', (ev) => {
    if (ev.keyCode === 13) SearchEpisodesButton.click();
  });

  SearchingEpisode.addEventListener('click', ()=>{
    ReturnToSearch.click()
  })
};

export const findEpisode = async (params, query) => {
  const attempts = parseInt(params.episodes / SPOTIFY_MAX_LIMIT)  + 1
  const results = []
  for(let offset = 0; offset< attempts; offset++ ){
    const res = await getEpisodes(params.id, offset * SPOTIFY_MAX_LIMIT)
    const episodes = res.items
    const found = episodes.filter(episode => 
      episode.description.toLowerCase().includes(query) ||
      episode.name.toLowerCase().includes(query)
    )
    results.push(found)
  }
  return results.flat()
}

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
