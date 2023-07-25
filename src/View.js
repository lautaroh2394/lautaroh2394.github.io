import { isAuthorized } from './spotify-utils.js';

const pageModel = {
  start: (_) => {
    pageModel.hideAllBlocks();
    pageModel.configureSaved();
    pageModel.showLoading();

    if (!isAuthorized()) {
      pageModel.askLogin();
    } else {
      pageModel.showSearch();
      pageModel.hideLoading();
    }
  },
  askLogin: (_) => {
    pageModel.showAuth();
  },
  showSearch: (_) => {
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
    [...document.querySelectorAll('body > .container > div')].forEach((block) => {
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
  configureSaved: () => {
    let saved = localStorage.getItem('saved-podcasts');
    if (!saved) return;
    pageModel.show('#SavedPodcasts');
    saved = JSON.parse(saved);
    saved.items.forEach((podcast) => {
      // todo
    });
  },
  showSavedPodcasts: () => {
    pageModel.show('#SavedPodcasts');
    pageModel.show('#SavedPodcastsList');
  },
  toggleOffline: (status) => {
    if (status === 'offline') pageModel.show('#nointernet');
    else pageModel.hide('#nointernet');
  },
};

export default pageModel;
