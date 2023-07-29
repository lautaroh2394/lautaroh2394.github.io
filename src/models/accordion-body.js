import { create } from "../dom-utils.js"
import { AccordionButtons } from "./accordion-buttons.js"
import { AccordionDescription } from "./accordion-description.js"
import { AccordionDetails } from "./accordion-details.js"

export const AccordionBody = (params) => {
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