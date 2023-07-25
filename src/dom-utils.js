import pageModel from './view.js';
import { spotifySearch, playRandomEpisode } from './spotify-utils.js';
import { SAVED_PODCASTS } from './constants.js';

const create = ({
  tag, clases, children, attributes, textContent, events,
}) => {
  const el = document.createElement(tag);
  if (clases) clases.forEach((clase) => el.classList.add(clase));
  if (children) children.forEach((child) => el.append(create(child)));
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

const savePodcastData = (params) => {
  let saved = JSON.parse(localStorage.getItem(SAVED_PODCASTS)) || [];
  const sameIdAsPodcast = sameId(params.id);
  const alreadySaved = saved.some(sameIdAsPodcast);
  if (alreadySaved) {
    const index = saved.findIndex(sameIdAsPodcast);
    saved = [
      saved.slice(0, index),
      saved.slice(index, saved.length - 1),
    ].flat();
  }
  saved.push(params);
  localStorage.setItem(SAVED_PODCASTS, JSON.stringify(saved));
  return saved;
};
const clickPlayCallbackGenerator = (params) => {
  return async () => {
    playRandomEpisode(params);
    const saved = savePodcastData(params);
    // pageModel.configureSaved(saved); -- todo - bugueadisimo
  };
};

const createListRow = ({
  name, description, images, publisher, episodes, uri, id, nroFila,
}) => {
  const imgSrc = images.reduce((prevImg, curr) => {
    return curr.height < prevImg.height ? curr : prevImg;
  }).url;
  nroFila = nroFila || '1';
  const clickPlayCallback = clickPlayCallbackGenerator({
    name, description, images, publisher, episodes, uri, id, nroFila,
  });
  const el = create({
    tag: 'div',
    clases: ['accordion-item'],
    children: [
      {
        tag: 'h2',
        clases: ['accordion-header'],
        attributes: {
          id: `heading${nroFila}`,
        },
        children: [
          {
            tag: 'button',
            clases: ['accordion-button', 'collapsed'],
            attributes: {
              type: 'button',
              'data-bs-toggle': 'collapse',
              'data-bs-target': `#collapse${nroFila}`,
              'aria-expanded': 'true',
              'aria-controls': `collapse${nroFila}`,
            },
            children: [
              {
                tag: 'div',
                clases: ['accordion-item-title'],
                children: [
                  {
                    tag: 'img',
                    attributes: {
                      src: imgSrc,
                    },
                  },
                  {
                    tag: 'div',
                    clases: ['accordion-item-name', 'flex-center'],
                    children: [
                      {
                        tag: 'span',
                        textContent: name,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        tag: 'div',
        clases: [
          'accordion-collapse',
          'collapse',
          /* "show" */
        ],
        attributes: {
          id: `collapse${nroFila}`,
          'aria-labelledby': `heading${nroFila}`,
          /* "data-bs-parent" : "#accordionExample" */
        },
        children: [
          {
            tag: 'div',
            clases: ['accordion-body'],
            children: [
              {
                tag: 'div',
                clases: [
                  'accordion-item-detalles',
                ],
                children: [
                  {
                    tag: 'div',
                    clases: [
                      'flex-2',
                    ],
                    children: [
                      {
                        tag: 'img',
                        attributes: {
                          src: imgSrc,
                        },
                      },
                    ],
                  },
                  {
                    tag: 'div',
                    clases: [
                      'cell',
                      'nombre',
                      'flex-center',
                    ],
                    children: [
                      {
                        tag: 'h3',
                        textContent: name,
                      },
                    ],
                  },
                  {
                    tag: 'div',
                    clases: [
                      'flex-3',
                      'flex-center',
                    ],
                    children: [
                      {
                        tag: 'h6',
                        textContent: publisher,
                      },
                    ],
                  },
                  {
                    tag: 'div',
                    clases: [
                      'flex-2',
                      'flex-center',
                    ],
                    children: [
                      {
                        tag: 'h6',
                        textContent: episodes,
                      },
                    ],
                  },
                ],
              },
              {
                tag: 'div',
                clases: ['play-random'],
                children: [
                  {
                    tag: 'button',
                    clases: [
                      'btn',
                      'btn-success',
                    ],
                    attributes: {
                      type: 'button',
                    },
                    textContent: 'Reproducir aleatorio',
                    events: {
                      click: clickPlayCallback,
                    },
                  },
                ],
              },
              {
                tag: 'div',
                clases: [
                  'accordion-item-descripcion',
                  'flex-center',
                ],
                children: [
                  {
                    tag: 'span',
                    textContent: description,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  });
  return el;
};

const addResult = (params) => {
  const el = createListRow(params);
  SearchResults.appendChild(el);
  return (parseInt(params.nroFila) + 1).toString();
};

export const addSaved = (params) => {
  const el = createListRow(params);
  SavedPodcastsList.appendChild(el);
  return (parseInt(params.nroFila) + 1).toString();
};

export const emptyList = (element) => {
  if (element.children) {
    [...element.children].forEach((child) => element.removeChild(child));
  }
};

const setEvents = (_) => {
  Authorize.addEventListener('click', (ev) => {
    window.location = 'https://accounts.spotify.com/authorize?client_id=76fb0a13403d4147b10d78950a9fe7d2&redirect_uri=https%3A%2F%2Flautaroh2394.github.io&response_type=token';
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
        nroFila: prevPodcastNumber,
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

  SavedPodcasts.addEventListener('click', (ev) => {
    pageModel.toggleSavedPodcasts();
  });

  ShowingSavedPodcasts.addEventListener('click', (ev) => {
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
