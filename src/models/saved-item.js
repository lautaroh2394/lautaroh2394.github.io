import { AccordionItem } from "./accordion-item.js";

export const SavedItem = (params)=>{
    return AccordionItem({ ...params, deleteOption: true });
}