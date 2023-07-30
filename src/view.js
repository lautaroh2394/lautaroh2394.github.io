import { isAuthorized } from './spotify-utils.js';
import {
  addSaved, emptyList, getSaved
} from './dom-utils.js';
import { DeleteAllButton } from './models/delete-all-button.js';

const pageModel = {
  start: () => {
    window.showingSaved = false;
    window.pageModel = pageModel;
    pageModel.hideAllBlocks();
    if (getSaved().length > 0 ) pageModel.show('#SavedPodcasts');
    pageModel.configureSaved();
    pageModel.showLoading();

    if (!isAuthorized()) {
      pageModel.askLogin();
    } else {
      pageModel.showSearch();
      pageModel.hideLoading();
    }
  },
  askLogin: () => {
    pageModel.showAuth();
  },
  showEpisodeSearch: (params)=>{
    pageModel.hideAllBlocks();
    pageModel.configureSaved();
    pageModel.show('#SearchEpisodes')
  },
  showSearch: () => {
    pageModel.show('#Search');
    pageModel.show('#SearchResults');
  },
  showLoading: () => {
    pageModel.show('#loading');
  },
  hideLoading: () => {
    pageModel.hide('#loading');
  },
  hideAllBlocks: () => {
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
      document.querySelector('#AuthModal > .modal-dialog > .modal-content > .modal-body').textContent = mje;
    }
    const authModal = new bootstrap.Modal(document.getElementById('AuthModal'), {
      keyboard: false,
      backdrop: 'static',
    });
    authModal.show();
  },
  show: (sel) => {
    document.querySelector(sel).style.display = '';
  },
  configureSaved: () => {
    const saved = getSaved();
    emptyList(SavedPodcastsList);
    if (saved.length === 0) return;

    saved.forEach((podcastParams, index) => {
      addSaved({ ...podcastParams, fileNumber: index });
    });
    if (saved.length > 0) {
      SavedPodcastsList.appendChild(DeleteAllButton());
      if (!showingSaved) pageModel.show('#SavedPodcasts');
    }
  },
  showSavedPodcasts: () => {
    pageModel.hide('#SavedPodcasts');
    pageModel.show('#SavedPodcastsList');
    pageModel.show('#ShowingSavedPodcasts');
  },
  toggleOffline: (status) => {
    if (status === 'offline') pageModel.show('#nointernet');
    else pageModel.hide('#nointernet');
  },
  toggleSavedPodcasts: () => {
    window.showingSaved = !window.showingSaved;
    pageModel.hideAllBlocks();

    if (window.showingSaved) {
      pageModel.showSavedPodcasts();
    } else {
      pageModel.hide('#ShowingSavedPodcasts');
      pageModel.hide('#SavedPodcastsList');
      if (getSaved().length > 0 ) pageModel.show('#SavedPodcasts');
      pageModel.showSearch();
    }
  },
  showSearchingEpisode: (name)=> {
    document.querySelector("#SearchingEpisode > div > button" ).textContent = `Buscando episodio de ${name}`
    pageModel.show("#SearchingEpisode")
  }
};

export default pageModel;
