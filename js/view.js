import { Modal } from './../plugins/modal/modal.js';

export const view = {
  searchInput: document.querySelector('.search-input'),
  searchBtn: document.querySelector('.search-btn'),
  msgContainer: document.querySelector('.profiles-msg_area'),
  usersContainer: document.querySelector('.profiles-cards_container'),
  preloader: document.querySelector('#preloader'),
  modals: [],

  resetUsersContainer() {
    this.cardsCount = 0;
    this.clearModals();
    this.clearAllContainers();
  },

  prepareUsersContainer(count, { length }) {
    this.resetUsersContainer();
    if (!length) {
      this.showMessage('There is no coincidence...');
      return;
    }
    this.showMessage(`${count} founded...`);
  },

  showUsers(users) {
    users.forEach(this.createCard, this);
  },

  createCard(user) {
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
    this.msgContainer.innerHTML = msg;
  },

  togglePreloader(action) {
    this.preloader.classList[action]('hide');
  },

  clearAllContainers() {
    this.clear(this.usersContainer);
    this.clear(this.msgContainer);
    view.togglePreloader('add');
  },

  clear: container => (container.innerHTML = ''),

  clearModals() {
    this.modals.forEach(({ modal }) => modal.destroy());
    this.modals = [];
  }
};
