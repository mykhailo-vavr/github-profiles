import { model } from './model.js';
import { view } from './view.js';

export const controller = {
  start() {
    this.setListeners();
    view.searchInput.focus();
  },

  setListeners() {
    view.searchInput.addEventListener(
      'input',
      this.debounceForKeyup(model.startLoading.bind(model))
    );
    view.usersContainer.addEventListener(
      'click',
      this.onClick.bind(this)
    );
    window.addEventListener(
      'scroll',
      this.debounceForScroll(this.onScroll.bind(this))
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

  onScroll() {
    const windowBottom =
      document.documentElement.getBoundingClientRect().bottom;
    view.togglePreloader('remove');

    if (windowBottom < document.documentElement.clientHeight + 100) {
      model.loadGitHubUsers();
      view.togglePreloader('add');
    }
  },

  debounceForScroll(func, ms = 500) {
    let timerId,
      isCalled = false;

    return function (...args) {
      if (isCalled) {
        clearInterval(timerId);
        timerId = setTimeout(() => {
          func.apply(this, args);
        }, ms);
        return;
      }
      clearInterval(timerId);
      func.apply(this, args);
      isCalled = true;
      setTimeout(() => (isCalled = false), ms);
    };
  },

  debounceForKeyup(func, ms = 500) {
    let timerId;
    return function (...args) {
      clearInterval(timerId);
      timerId = setTimeout(() => func.apply(this, args), ms);
    };
  }
};
