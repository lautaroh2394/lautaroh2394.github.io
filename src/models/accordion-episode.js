import { create } from "../dom-utils.js"
import { AccordionBody } from "./accordion-body.js";
import { AccordionDescription } from "./accordion-description.js";
import { AccordionDetails } from "./accordion-details.js";
import { AccordionHeader } from "./accordion-header.js";
import { PlayEpisodeButton } from "./play-episode-button.js";

export const AccordionEpisode = (params) => {    
    const {images} = params
    const imgSrc = images.reduce((prevImg, curr) => {
        return curr.height < prevImg.height ? curr : prevImg;
      }).url;
    params = {...params, imgSrc}

    return create({
        tag: 'div',
        classes: ['accordion-item'],
        children: [
          AccordionHeader(params),
          AccordionEpisodeBody(params),
        ],
      });
}

const AccordionEpisodeBody = (params)=>{
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
            PlayEpisodeButton(params),
            AccordionDescription(params),
          ].flat(),
        },
      ],
    })
}