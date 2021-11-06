import { Modal } from './../plugins/modal/modal.js';

export const view = {
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
