import 'regenerator-runtime/runtime'; //Polyfill async
import { API_KEY, API_URL, RESULTS_PER_PAGE } from './config.js';
import { getJSON, sendJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    currentPage: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarked: [],
};

const createRecipeObject = function (data) {
  const {
    id,
    title,
    publisher,
    source_url: sourceUrl,
    image_url: image,
    servings,
    cooking_time: cookingTime,
    ingredients,
    key,
  } = data.data.recipe;

  return {
    id,
    title,
    publisher,
    sourceUrl,
    image,
    servings,
    cookingTime,
    ingredients,
    ...(key && { key }),
  };
};
export const loadRecipe = async function (hash) {
  try {
    const data = await getJSON(`${API_URL}/${hash}?key=${API_KEY}`);

    state.recipe = createRecipeObject(data);

    if (state.bookmarked?.some(bookmark => bookmark.id === hash)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
    console.log(state.recipe);
  } catch (error) {
    throw error;
  }
};

export const loadSearch = async function (query) {
  try {
    const data = await getJSON(`${API_URL}?search=${query}&key=${API_KEY}`);

    state.search.query = query;
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });

    console.log(state.search.results);
  } catch (error) {
    throw error;
  }
};

export const getSearchResultsPage = function (page = state.search.currentPage) {
  state.search.currentPage = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('forkify-bookmarks', JSON.stringify(state.bookmarked));
};

export const addBookmark = function (recipe) {
  //Add recipe to bookmarked
  state.bookmarked.push(recipe);

  //Add bookmarked to recipe
  state.recipe.bookmarked = true;

  //save to localStorage
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  //Remove recipe from bookmarked
  const index = state.bookmarked.findIndex(bookmark => bookmark.id === id);
  state.bookmarked.splice(index, 1);

  //Set bookmarked to false on recipe
  state.recipe.bookmarked = false;

  //save to localStorage
  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('forkify-bookmarks');
  if (storage) state.bookmarked = JSON.parse(storage);
};

init();

const clearBookmarks = function () {
  localStorage.clear('forkify-bookmarks');
};

// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3) {
          throw new Error(
            'Wrong ingredient format. Please use the correct format :)'
          );
        }
        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const {
      title,
      publisher,
      sourceUrl: source_url,
      image: image_url,
      servings,
      cookingTime: cooking_time,
    } = newRecipe;

    const recipe = {
      title,
      publisher,
      source_url,
      image_url,
      ingredients,
      servings: +servings,
      cooking_time: +cooking_time,
    };

    const data = await sendJSON(`${API_URL}?key=${API_KEY}`, recipe);

    state.recipe = createRecipeObject(data);

    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};
