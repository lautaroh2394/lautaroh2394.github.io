import { create, findEpisode } from "../dom-utils.js"
import { getSpotifyToken } from "../spotify-utils.js";
import pageModel from "../view.js";

export const SearchEpisodeButton = (params)=> {
    const clickSearchEpisodeCallback = ()=>{
        const currentState = window.history.state
        window.history.pushState({ 
            ...currentState,
            podcast: params,
         }, 'Búsqueda de capítulo', '/?episode-search');
        pageModel.hide('#SavedPodcastsList');
        pageModel.hide('#ShowingSavedPodcasts');
        pageModel.showEpisodeSearch();
        pageModel.showSearchingEpisode(params.name)
    };

    return create({
        tag: 'div',
        classes: ['accordion-btn'],
        children: [
          {
            tag: 'button',
            classes: [
              'btn',
              'btn-info',
            ],
            attributes: {
              type: 'button',
            },
            textContent: 'Buscar episodio',
            events: {
              click: clickSearchEpisodeCallback,
            },
          }
        ]
    })
}
