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
        pageView.showSearch();
        pageView.showAuth();
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
    showAuth: mje => {
        mje && (document.querySelector("#authModal > .modal-dialog > modal-content > .modal-body").textContent = mje);
        let authModal = new bootstrap.Modal(document.getElementById('authModal'), {
            keyboard: false,
            backdrop: "static"
        })
        authModal.show()
    },
    showError: error =>{
        //TODO - Show error y volver a loguearse
        console.log(error)
    },
    show: sel => {
        document.querySelector(sel).style.display = "";
    }
}