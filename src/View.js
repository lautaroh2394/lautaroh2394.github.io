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
        let loading = document.getElementById("loading");
        page.hide(loading);
    },
    hideAllBlocks: _=>{
        [...document.querySelectorAll("body > div")].forEach(block => {
            page.hide(block)
        })
    },
    hide: block =>{
        block.style.display = "none"
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
    }
}