import { create } from "../dom-utils.js"

export const AccordionHeader = (params)=>{
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