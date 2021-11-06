export const search = {
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
