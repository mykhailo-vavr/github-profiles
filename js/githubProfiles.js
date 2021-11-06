import { Modal } from './../plugins/modal/modal.js';

const search = {
  async loadJson(url) {
    let response = await fetch(url);
    if (!response.ok) {
      console.error('Error', response.status);
      return;
    }
    return await response.json();
  },

  async loadGitHubUsers(name) {
    const url = `https://api.github.com/search/users?q=${name}&per_page=10`;
    return await this.loadJson(url);
  }
};

const model = {
  async loadGitHubUsers() {
    let name = this.getName().trim();
    if (!name) {
      this.cachedName = null;
      view.clearAll();
      return;
    }

    if (name === this.cachedName) {
      return;
    }
    this.cachedName = name;

    let { total_count, items } = await search.loadGitHubUsers(name);
    this.usersUrl = items.map(({ url }) => url);
    view.showUsers(total_count, items);
  },

  async showModal(id) {
    let user = await search.loadJson(this.usersUrl[id]);
    view.showModal(user, id);
  },

  getName: () => view.input.value
};

const view = {
  input: document.querySelector('.search-input'),
  searchBtn: document.querySelector('.search-btn'),
  msgArea: document.querySelector('.profiles-msg_area'),
  usersContainer: document.querySelector('.profiles-cards_container'),
  modals: [],

  resetUsersContainer() {
    this.cardsCount = 0;
    this.clearModals();
    this.clearAll();
  },

  showUsers(count, users) {
    this.resetUsersContainer();
    if (!users.length) {
      this.showMessage('There is no coincidence...');
      return;
    }

    this.showMessage(`${count} founded...`);
    users.forEach(this.createCard, this);
  },

  async createCard(user) {
    const cardHTML = `
      <div
        class="profiles-card"
        data-action="showModal"
        data-id="${this.cardsCount++}"
      >
        <img
          src="${user.avatar_url}"
          alt="avatar"
          class="profiles-card-img"
        />
        <h3 class="profiles-card-title">${user.login}</h3>
      </div>
    `;

    this.usersContainer.insertAdjacentHTML('beforeend', cardHTML);
  },

  showModal(user, id) {
    const cachedModal = this.modals.find(modal => modal.id === id);
    if (cachedModal) {
      cachedModal.modal.open();
      return;
    }

    const propsForShow = [
      'name',
      'company',
      'bio',
      'location',
      'public_repos',
      'following',
      'followers'
    ];
    let modal = new Modal(user, propsForShow);
    this.modals.push({ modal: modal, id: id });
    modal.create();
    setTimeout(() => modal.open(), 10);
  },

  showMessage(msg) {
    this.msgArea.innerHTML = msg;
  },

  clearAll() {
    this.clear(this.usersContainer);
    this.clear(this.msgArea);
  },

  clear: container => (container.innerHTML = ''),

  clearModals() {
    this.modals.forEach(({ modal }) => modal.destroy());
    this.modals = [];
  }
};

export const controller = {
  start() {
    this.setListeners();
  },

  setListeners() {
    view.input.addEventListener(
      'input',
      this.debounce(model.loadGitHubUsers.bind(model))
    );
    view.usersContainer.addEventListener(
      'click',
      this.onClick.bind(this)
    );
  },

  onClick({ target }) {
    let elem = target.closest('[data-action]');
    let action = elem?.dataset.action;
    if (action) {
      let id = elem?.dataset.id;
      model[action](id);
    }
  },

  debounce(func, ms = 500) {
    let timerId;
    return function (...args) {
      clearInterval(timerId);
      timerId = setTimeout(() => func.apply(this, args), ms);
    };
  }
};

controller.start();
