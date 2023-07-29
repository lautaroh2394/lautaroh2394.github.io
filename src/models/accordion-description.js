import { create } from "../dom-utils.js"

export const AccordionDescription = ({description})=> {
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