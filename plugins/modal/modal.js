export class Modal {
  constructor(user, propsForShow) {
    this.boundOnClick = this.onClick.bind(this);
    this.user = user;
    this.propsForShow = propsForShow;
  }

  create() {
    if (this.isCreated) {
      return console.log(
        'This modal is already created\nUser: ',
        this.user
      );
    }

    const user = this.user;
    console.log(user);
    let items = this.propsForShow.map(this.createItem, this).join('');
    const modalHTML = `
        <div class="modal">
          <div class="modal-overlay hide-modal-overlay" data-action="close">
            <div class="modal-body hide-modal-body">
              ${
                user.avatar_url
                  ? `<img src="${user.avatar_url}"  alt="avatar">`
                  : ''
              } 
              <ul class="modal-body-content">
                ${items}
                <li class="modal-body-content-item">
                  <a
                    href="${user.html_url}"
                    target="_blank"
                  >
                    View on Github
                  <a/>
                </li>
              </ul>
            </div>
          </div>
        </div>`;
    document.body.insertAdjacentHTML('afterbegin', modalHTML);

    this.isCreated = true;
    this.modal = document.querySelector('.modal');
    this.modalBody = document.querySelector('.modal-body');
    this.modalOverlay = document.querySelector('.modal-overlay');

    this.modal.addEventListener('click', this.boundOnClick);
  }

  createItem(prop) {
    const capitalize = word => word[0].toUpperCase() + word.slice(1);
    return `
      <li class="modal-body-content-item">
        <span class="item-caption">
          ${capitalize(prop).replace(/_/g, ' ')}: </span>
        ${this.user[prop] ?? '-'}
      </li>`;
  }

  onClick({ target }) {
    const action = target.dataset.action;
    if (action) {
      this[action]();
    }
  }

  open() {
    if (Modal.isOpen) {
      return console.log('There is already opened modal window!!!');
    }
    this.modalBody.classList.remove('hide-modal-body');
    this.modalOverlay.classList.remove('hide-modal-overlay');
    Modal.isOpen = true;
  }

  close() {
    this.modalBody.classList.add('hide-modal-body');
    this.modalOverlay.classList.add('hide-modal-overlay');
    Modal.isOpen = false;
  }

  destroy() {
    this.modal.remove();
    this.isCreated = false;
    this.modalBody.removeEventListener('click', this.boundOnClick);
  }
}

// let modals = [
//   new Modal({
//     title: 'Fullmetal Alchemist',
//     content:
//       "When a failed alchemical ritual leaves brothers Edward and Alphonse Elric with severely damaged bodies, they begin searching for the one thing that can save them; the fabled philosopher's stone.",
//     imgURL:
//       'https://upload.wikimedia.org/wikipedia/en/6/61/Fullmetal_Alchemist_-_Brotherhood_-_DVD1.jpg',
//     id: 'fma',
//     width: '400px',
//     isClosable: false
//   }),
//   new Modal({
//     title: 'Attack on Titan',
//     content:
//       'After his hometown is destroyed and his mother is killed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction.',
//     imgURL:
//       'https://pbs.twimg.com/profile_images/1324093768618909697/Ij-CAeyd_400x400.jpg',
//     id: 'aot'
//   }),
//   new Modal({
//     title: 'Death parade',
//     content:
//       'After death, there is no heaven or hell, only a bar that stands between reincarnation and oblivion.',
//     imgURL:
//       'https://lyricsfromanime.com/animes-info/death-parade/cover/death-parade-lyrics.jpg',
//     id: 'dp'
//   })
// ];

// modals.forEach(item => {
//   window[item.options.id] = item; // to interact from console
//   item.create();
// });

// document.body.addEventListener('click', buttonClick);

// function buttonClick(event) {
//   const id = event.target.dataset.id;
//   if (!id) {
//     return;
//   }
//   const elem = modals.find(item => item.options.id === id);
//   if (elem) {
//     elem.open();
//   }
// }
