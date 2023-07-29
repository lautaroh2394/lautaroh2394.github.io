import { create } from "../dom-utils.js"
import { AccordionBody } from "./accordion-body.js";
import { AccordionHeader } from "./accordion-header.js";

export const AccordionItem = (params) => {    
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
          AccordionBody(params),
        ],
      });
}