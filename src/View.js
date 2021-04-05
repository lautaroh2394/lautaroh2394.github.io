const page = {
    start: _ => {
        page.hideAllBlocks();
        page.showLoading();
        
        if (!estoyAutorizado()){
            page.askLogin()
        }
        else{
            page.showSearch()
        }
    },
    askLogin: _ => {
        page.showSearch();
        page.showAuth();
    },
    showSearch: _=> {
        page.hideAllBlocks();
        page.show("#busqueda");
        page.show("#resultados")
    },
    showLoading: _=>{
        page.show("#loading");
    },
    hideLoading:_=>{
        page.hide("#loading");
    },
    hideAllBlocks: _=>{
        [...document.querySelectorAll("body > #container > div")].forEach(block => {
            page.hide(block)
        })
    },
    hide: block =>{
        if (typeof block == "string"){
            document.querySelector(block).style.display = "none"
        }
        else{
            block.style.display = "none"
        }
    },
    showAuth: mje => {
        mje && (document.querySelector("#authModal > .modal-dialog > .modal-content > .modal-body").textContent = mje);
        let authModal = new bootstrap.Modal(document.getElementById('authModal'), {
            keyboard: false,
            backdrop: "static"
        })
        authModal.show()
    },
    show: sel => {
        document.querySelector(sel).style.display = "";
    },
    toggleOffline: type => {
        if (type == "offline") page.show("#nointernet");
        else page.hide("#nointernet");
    }
}