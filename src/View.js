import { isAuthorized } from './spotify-utils.js';
import {
  addSaved, emptyList, getSaved
} from './dom-utils.js';
import { DeleteAllButton } from './models/delete-all-button.js';

const pageModel = {
  start: (_) => {
    window.showingSaved = false;
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
  askLogin: (_) => {
    pageModel.showAuth();
  },
  showSearch: (_) => {
    pageModel.show('#Search');
    pageModel.show('#SearchResults');
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
};

export default pageModel;
