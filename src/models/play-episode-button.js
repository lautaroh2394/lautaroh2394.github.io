import { clickPlayCallbackGenerator, create } from "../dom-utils.js"
import { playEpisode } from "../spotify-utils.js"

export const PlayEpisodeButton = (params)=> {
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
            textContent: 'Reproducir episodio',
            events: {
              click: ()=> playEpisode(params),
            },
          }
        ]
    })
}