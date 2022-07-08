import icons from 'url:../../img/icons.svg'; //linking static files using Parcel

export default class View {
  _data;

  /**
   *Render the recieved object to the DOM
   * @param {Object} data The data to be rendered (e.g.recipe)
   * @returns{undefined | string} A markup string is returned if no data
   * @this{Object} View Instance
   * @author Sandy
   * @todo Finish implementation
   */
  render(data) {
    if (!data || (Array.isArray(data) && !data.length))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderSpinner() {
    const markup = `<div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      let curEl = currElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));

      //Updates Changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log(newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      //Updates Changed Attributes
      if (!newEl.isEqualNode(curEl)) {
        // console.log(Array.from(newEl.attributes));
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }
}

// How does the trim() work at update method?
// 1 upvote
// Kennedy · Lecture 302 · 8 months ago
//       if (
//         !newEl.isEqualNode(curEl) &&
//         newEl.firstChild?.nodeValue.trim() !== ''
//       )
//         curEl.textContent = newEl.textContent;

// I know what trim() is, and without trim(), the display of ingredients and servings gonna be terrible.

// But I don't know why should we add trim() at 'newEl.firstChild?.nodeValue' and how does it work at this situation?
// 3 replies

// Aleksander — Teaching Assistant
// 3 upvotes
// 8 months ago
// Hi Kennedy

// It's to filter the elements which don't contain text nodes as first child. The nodeValue of such elements will be a string consisting of white space (more info on this), for example,

// <h1 class="heading">
//   <span>hello</span>
// </h1>
// const heading = document.querySelector('.heading');
// console.log(heading.firstChild.nodeValue === '');
// console.log(typeof heading.firstChild.nodeValue);
// console.log(heading.firstChild.nodeValue.length); // 3
// console.log(heading.firstChild.nodeValue.trim());
// If we trim all white space, this string will be equal to 0, and will be filtered by this condition

// newEl.firstChild?.nodeValue.trim() !== ''
// The elements with text nodes as first child will pass this condition as there will be some content left after trimming white space
