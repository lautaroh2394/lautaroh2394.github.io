import { create } from "../dom-utils.js"

export const AccordionDetails = ({imgSrc, name, publisher, episodes}) => {
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