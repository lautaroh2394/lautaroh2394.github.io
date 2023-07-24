import { isAuthorized } from './spotify-utils.js';

const pageModel = {
  start: (_) => {
    pageModel.hideAllBlocks();
    pageModel.showLoading();

    if (!isAuthorized()) {
      pageModel.askLogin();
    } else {
      pageModel.showSearch();
    }
  },
  askLogin: (_) => {
    pageModel.showSearch();
    pageModel.showAuth();
  },
  showSearch: (_) => {
    pageModel.hideAllBlocks();
    pageModel.show('#search');
    pageModel.show('#results');
  },
  showLoading: (_) => {
    pageModel.show('#loading');
  },
  hideLoading: (_) => {
    pageModel.hide('#loading');
  },
  hideAllBlocks: (_) => {
    [...document.querySelectorAll('body > #container > div')].forEach((block) => {
      pageModel.hide(block);
    });
  },
  hide: (block) => {
    if (typeof block === 'string') {
      document.querySelector(block).style.display = 'none';
    } else {
      block.style.display = 'none';
    }
  },
  showAuth: (mje) => {
    if (mje) {
      document.querySelector('#authModal > .modal-dialog > .modal-content > .modal-body').textContent = mje;
    }
    const authModal = new bootstrap.Modal(document.getElementById('authModal'), {
      keyboard: false,
      backdrop: 'static',
    });
    authModal.show();
  },
  show: (sel) => {
    document.querySelector(sel).style.display = '';
  },
  toggleOffline: (type) => {
    if (type === 'offline') pageModel.show('#nointernet');
    else pageModel.hide('#nointernet');
  },
};

export default pageModel;
