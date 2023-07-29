import { SAVED_PODCASTS } from "../constants.js";
import { create } from "../dom-utils.js"

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