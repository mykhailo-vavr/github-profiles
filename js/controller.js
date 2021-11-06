import { model } from './model.js';
import { view } from './view.js';

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
