import { SAVED_PODCASTS } from './constants.js';
import { playRandomEpisode } from './spotify-utils.js';
import pageModel from './View.js';

const create = ({
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
const deleteFromSavedCallbackGenerator = (id) => {
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

const clickPlayCallbackGenerator = (params) => {
  return async () => {
    playRandomEpisode(params);
    const saved = savePodcastData(params);
    pageModel.configureSaved(saved);
  };
};

export const DeleteAllButton = () => {
    
  return create({
    tag: "div",
    classes: ["accordion-btn"],
    children: [
        {
            tag: 'button',
            classes: ['btn', 'btn-danger'],
            attributes: { id: 'DeleteAllSaved' },
            textContent: 'Borrar todos',
            events: {
              click: () => {
                localStorage.setItem(SAVED_PODCASTS, '[]');
                pageModel.configureSaved();
              },
            },
          }
    ],
    attributes: {type: "button"}
  });
};

export const SavedItem = (params)=>{
    return AccordionItem({ ...params, deleteOption: true });
}

export const AccordionItem = (params) => {    
    const {images} = params
    const imgSrc = images.reduce((prevImg, curr) => {
        return curr.height < prevImg.height ? curr : prevImg;
      }).url;
    params = {...params, imgSrc}
    return create({
        tag: 'div',
        classes: ['accordion-item'],
        children: [
          AccordionHeader(params),
          AccordionBody(params),
        ],
      });
}

const AccordionHeader = (params)=>{
    const {fileNumber, name, imgSrc} = params

    return create({
        tag: 'h2',
        classes: ['accordion-header'],
        attributes: {
          id: `heading${fileNumber}`,
        },
        children: [
          {
            tag: 'button',
            classes: ['accordion-button', 'collapsed'],
            attributes: {
              type: 'button',
              'data-bs-toggle': 'collapse',
              'data-bs-target': `#collapse${fileNumber}`,
              'aria-expanded': 'true',
              'aria-controls': `collapse${fileNumber}`,
            },
            children: [
              {
                tag: 'div',
                classes: ['accordion-item-title'],
                children: [
                  {
                    tag: 'img',
                    attributes: {
                      src: imgSrc,
                    },
                  },
                  {
                    tag: 'div',
                    classes: ['accordion-item-name', 'flex-center'],
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
      })
}

const AccordionBody = (params) => {
    const {fileNumber} = params
    return create({
        tag: 'div',
        classes: [
          'accordion-collapse',
          'collapse',
          /* "show" */
        ],
        attributes: {
          id: `collapse${fileNumber}`,
          'aria-labelledby': `heading${fileNumber}`,
          /* "data-bs-parent" : "#accordionExample" */
        },
        children: [
          {
            tag: 'div',
            classes: ['accordion-body'],
            children: [
              AccordionDetails(params),
              AccordionButtons(params),
              AccordionDescription(params),
            ].flat(),
          },
        ],
      })
}

const AccordionButtons = (params)=> {
    const {deleteOption} = params
    const buttons =  [
        PlayRandomButton(params),
    ]
    if (deleteOption) buttons.push( DeleteSavedButton(params))
    return buttons
}

const PlayRandomButton = (params)=> {
    const clickPlayCallback = clickPlayCallbackGenerator(params);
    return create({
        tag: 'div',
        classes: ['accordion-btn'],
        children: [
          {
            tag: 'button',
            classes: [
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
          }]})
}

const DeleteSavedButton = (params)=>{
    const {deleteOption, id} = params
    const clickPlayCallback = clickPlayCallbackGenerator(params);
    return create({
        tag: 'div',
        classes: ['accordion-btn'],
        children: [
          deleteOption ? {
            tag: 'button',
            classes: [
              'btn',
              'btn-danger',
            ],
            attributes: {
              type: 'button',
            },
            textContent: 'Borrar',
            events: {
              click: deleteFromSavedCallbackGenerator(id),
            },
          } : undefined,
        ]
      })
}
const AccordionDetails = ({imgSrc, name, publisher, episodes}) => {
    return create({
        tag: 'div',
        classes: [
          'accordion-item-detalles',
        ],
        children: [
          {
            tag: 'div',
            classes: [
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
            classes: [
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
            classes: [
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
            classes: [
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
      })
}

const AccordionDescription = ({description})=> {
    return create({
        tag: 'div',
        classes: [
          'accordion-item-descripcion',
          'flex-center',
        ],
        children: [
          {
            tag: 'span',
            textContent: description,
          },
        ],
      })
}