import View from './View';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');

  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _message = 'Your recipe was uploaded successfully!';

  constructor() {
    super();
    this._addHandlerModalOpen();
    this._addHandlerModalClose();
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  toggleWindow() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }
  
  _addHandlerModalOpen() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _escapeKeyHandler(e) {
    if (e.key === 'Escape') {
      this._toggleWindow();
    }
  }

  _addHandlerModalClose() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    document.addEventListener('keydown', this._escapeKeyHandler.bind(this));
  }
}

export default new AddRecipeView();
