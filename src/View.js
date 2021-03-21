const pageView = {
    start: _ => {
        if (!estoyAutorizado()){
            pageView.askLogin()
        }
        else{
            pageView.showSearch()
        }
    },
    askLogin: _ => {
        pageView.hideAllBlocks();
        pageView.show("#askLogin");
    },
    showSearch: _=> {
        pageView.hideAllBlocks();
        pageView.show("#busqueda");
        pageView.show("#resultados")
    },
    hideAllBlocks: _=>{
        [...document.querySelectorAll("body > div")].forEach(block => {
            block.style.display = "none"
        })
    },
    showError: error =>{
        //TODO - Show error y volver a loguearse
        console.log(error)
    },
    show: sel => {
        document.querySelector(sel).style.display = "";
    }
}