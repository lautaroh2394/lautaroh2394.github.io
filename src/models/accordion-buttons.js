import { DeleteSavedButton } from "./delete-saved-button.js"
import { PlayRandomButton } from "./play-random-button.js"
import { SearchEpisodeButton } from "./search-episode-button.js"

export const AccordionButtons = (params)=> {
    const {deleteOption} = params
    const buttons =  [
        PlayRandomButton(params),
        SearchEpisodeButton(params),
    ]
    if (deleteOption) buttons.push( DeleteSavedButton(params))
    return buttons
}