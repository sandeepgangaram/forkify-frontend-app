import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

import 'core-js/stable'; //Polyfill rest
import 'regenerator-runtime/runtime'; //Polyfill async

if (module.hot) {
  module.hot.accept();
}

const controlRecipe = async function () {
  try {
    const hash = window.location.hash.slice(1);

    if (!hash) return;

    recipeView.renderSpinner();
    //0)Update results view to mark currently selected search result
    resultsView.update(model.getSearchResultsPage());
    //1) updating bookmarks view
    bookmarkView.update(model.state.bookmarked);

    //2)Load recipe
    await model.loadRecipe(hash);

    //3)render recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    console.error(error);
    recipeView.renderError();
  }
};

const controlSearch = async function () {
  try {
    //Get Search Query
    const query = searchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();

    //Load Search Results
    await model.loadSearch(query);

    //Render Results
    resultsView.render(model.getSearchResultsPage(1));

    //Render Pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.error(error);
  }
};

const controlPagination = function (goTo) {
  //Render New Results
  resultsView.render(model.getSearchResultsPage(goTo));

  //Render new Pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Change servings in State
  model.updateServings(newServings);

  //Render recipe with updated servings
  // recipeView.render(model.state.recipe);

  //Update recipe with new Servings
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  recipeView.update(model.state.recipe);

  bookmarkView.render(model.state.bookmarked);
};

const controlBookmark = function () {
  bookmarkView.render(model.state.bookmarked);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //show spinner
    addRecipeView.renderSpinner();

    //Upload recipe
    await model.uploadRecipe(newRecipe);

    //render new recipe
    recipeView.render(model.state.recipe);

    //Render Success Message
    addRecipeView.renderMessage();

    //Render bookmark view
    bookmarkView.render(model.state.bookmarked);

    //Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    window.location.reload();
    //Close Modal
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
    //reload page
  } catch (error) {
    addRecipeView.renderError(error.message);
  }
};

//Publisher-Subscriber Architecture
const init = function () {
  bookmarkView.addHandlerRender(controlBookmark);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.updateServingsHandler(controlServings);
  recipeView.addBookmarkHandler(controlAddBookmark);
  searchView.addHandlerRender(controlSearch);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
