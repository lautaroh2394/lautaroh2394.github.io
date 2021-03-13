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
        pageView.showBlockParent("#askLogin");
    },
    showSearch: _=> {
        pageView.hideAllBlocks();
        pageView.showBlockParent("[name=busqueda]");
    },
    hideAllBlocks: _=>{
        [...document.querySelectorAll(".block-container")].forEach(block => {
            block.style.display = "none"
        })
    },
    showError: error =>{
        //TODO - Show error y volver a loguearse
        console.log(error)
    },
    showBlockParent: sel => {
        document.querySelector(sel).parentElement.style.display = "flex";
    }
}