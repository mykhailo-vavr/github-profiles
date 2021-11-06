import { view } from './view.js';
import { search } from './search.js';

export const model = {
  perPage: 20,

  resetState() {
    this.page = 0;
    this.usersUrl = [];
    this.isFetched = false;
  },

  async startLoading() {
    this.resetState();
    this.name = this.getName().trim();
    if (!this.name) {
      this.cachedName = null;
      view.clearAllContainers();
      return;
    }

    if (this.name === this.cachedName) {
      return;
    }
    this.cachedName = this.name;
    this.loadGitHubUsers();
  },

  async loadGitHubUsers() {
    try {
      let { total_count, items: users } =
        await search.loadGitHubUsers(
          this.name,
          this.perPage,
          this.page++
        );

      this.usersUrl.push(...users.map(({ url }) => url));
      if (!this.isFetched) {
        view.prepareUsersContainer(total_count, users);
        this.isFetched = true;
      }
      view.showUsers(users);
    } catch ({ message }) {
      console.error(message);
    }
  },

  async showModal(id) {
    let user = await search.loadJson(this.usersUrl[id]);
    view.showModal(user, id);
  },

  getName: () => view.searchInput.value
};
