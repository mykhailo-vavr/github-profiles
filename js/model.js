import { view } from './view.js';

export const model = {
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
