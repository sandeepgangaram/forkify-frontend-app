import icons from 'url:../../img/icons.svg'; //linking static files using Parcel
import View from './View';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goTo = +btn.dataset.goto;

      handler(goTo);
    });
  }

  _generateMarkup() {
    const curPage = this._data.currentPage;

    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    //Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return this._nextPage(curPage);
    }

    //Last Page
    if (curPage === numPages && numPages > 1) {
      return this._prevPage(curPage);
    }
    //Any other page
    if (curPage < numPages && numPages > 1) {
      return `${this._prevPage(curPage)} ${this._nextPage(curPage)}`;
    }
    //Page 1 and there are NO other pages

    return '';
  }

  _nextPage(curPage) {
    return `
    <button data-goto="${
      curPage + 1
    }" class="btn--inline pagination__btn--next">
    <span>Page ${curPage + 1}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
    </svg>
  </button>`;
  }

  _prevPage(curPage) {
    return `
    <button data-goto="${
      curPage - 1
    }" class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>Page ${curPage - 1}</span>
  </button>`;
  }
}

export default new PaginationView();
