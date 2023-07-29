import { clickPlayCallbackGenerator, create } from "../dom-utils.js"

export const PlayRandomButton = (params)=> {
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