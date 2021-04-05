const saveEpisodeList = async ({name, description, imgSrc, publisher, totalEpisodios, spotifyUri, podcastId}) => {
    let counter = 0
    let episodes = await Promise.all((new Array(totalEpisodios)).fill()
        .map(e=>counter++)
        //.map(indice => getEpisode(podcastId, indice))
        //Meto delay para no excederme de los limites de la api
        .map(indice => {
            return new Promise(res => {
                setTimeout(
                    _=> getEpisode(podcastId, indice).then(ep => res(ep.items[0].uri)),
                    500 * indice)
            })
        })
    )

    //Le aviso al sw que guarde la info de este podcast
    navigator.serviceWorker.controller.postMessage(
        {
            execute:"save",
            podcast:{
                id: podcastId,
                podcast_data: {name, description, imgSrc, publisher, totalEpisodios, spotifyUri},
                podcast_episodes: episodes
        }
    })
}

const processPostedMessage = ev => {
    console.log("Se recibió un msj desde el service worker", ev);

    switch(ev.data.type){
        case "saved-episodes":
            //Habilitar boton 'ver guardados'
            page.show("#guardados")
            window.GUARDADOS = ev.data["podcast-list"];
            break
        default:
            console.log(`No se pudo procesar el mensaje proveniente del sw con type=${ev.data.type}`)
    }
}