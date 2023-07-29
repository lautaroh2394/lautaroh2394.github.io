import { create } from "../dom-utils.js"

export const SearchEpisodeButton = (params)=> {
    const clickSearchEpisodeCallback = ()=>{
        //TODO
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
