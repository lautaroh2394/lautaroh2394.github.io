import { create, deleteFromSavedCallbackGenerator } from "../dom-utils.js"

export const DeleteSavedButton = (params)=>{
    const {id} = params

    return create({
        tag: 'div',
        classes: ['accordion-btn'],
        children: [
          {
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
          }
        ]
      })
}