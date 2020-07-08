/*Named exports*/
/*
export const add = (a, b)=> a + b;
export const multiply = (a, b) => a * b;
export const ID = 26;
*/
import {elements} from './base';

// The function to get the input from the Input box of the DOM
export const getInput = () => elements.searchInput.value;

// Function to clear the input text box
export const clearInput = () =>{
        elements.searchInput.value = '';
};

// Function to clear the markup after
export const clearResults = () => {
    // clears the search results of old pages
    elements.searchResList.innerHTML = '';
    // clears the pagination buttons
    elements.searchResPages.innerHTML = '';
};

// Function to highlightSelected links of search
export const highlightSelected = (id) =>{
    // Collect all the links from the results__link and store in the form of the array
    const resultsArray = Array.from(document.querySelectorAll('.results__link'));
    // loop through each link and remove the highlighted part
    resultsArray.forEach(el => {
        el.classList.remove('results__link--active');
    });
    // We add style to the link containg the list of recipe as follows
    // This will permanently add the highlight to the current page we are on
    document.querySelector(`[href="#${id}"]`).classList.add('results__link--active');
}
/*
Example of working of below reducer function
// 'Pasta with tomato and spinach'
acc: 0 / acc + cur.length = 5 / newTitle = ['Pasta']
acc: 5 / acc + cur.length = 9 / newTitle = ['Pasta', 'with']
acc: 9 / acc + cur.length = 15 / newTitle = ['Pasta', 'with', 'tomato']
acc: 15 / acc + cur.length = 18 / newTitle = ['Pasta', 'with', 'tomato']
acc: 18 / acc + cur.length = 24 / newTitle = ['Pasta', 'with', 'tomato']
*/

// Create a private function to limit the lengt of title to 17 characters
export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);

        // return the result
        return `${newTitle.join(' ')} ...`;
    }
    return title;
};

/*
Another method is using substring
*/
/*
const limitRecipeTitle1 = (title, limit= 17)=>{
    if(title.length > limit){
        title = title.substring(0, limit);
        return `${title.substring(0, title.lastIndexOf(' '))}...`;
    }
    return title;
}*/

// Create a function to loop through the receipes
const renderRecipe = recipe => {
    const markup = `
                <li>
                    <a class="results__link" href="#${recipe.recipe_id}">
                        <figure class="results__fig">
                            <img src="${recipe.image_url}" alt="${recipe.title}">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                            <p class="results__author">${recipe.publisher}</p>
                        </div>
                    </a>
                </li>
    `;
    
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
    
};


// Create a private function the takes the 2 arguments as below:
/*
type: 'prev' and 'next'
data-*attributes
data-goto
*/
// type: 'prev' or 'next'
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;
// Function to Render Pagination Buttons
// We call a create button above to display the button markup
const renderButtons = (page, numResults, resPerPage) => {
    /*
        Divide the pages into number of pages as follows:
        1. numResults = 30 and resPerPage =10 then pages = 3
        2. numResults = 45 and resPerPage =10 then pages = 4.5~5
    */
    const pages = Math.ceil(numResults / resPerPage);

    let button;
    // If we have first page and they are more than one pages for the search
    if (page === 1 && pages > 1) {
        // Only button to go to next page
        button = createButton(page, 'next');
    } 
    // If we are in the next page and there are more pages
    else if (page < pages) {
        // Both buttons
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    } 
    // If it is the last page
    else if (page === pages && pages > 1) {
        // Only button to go to prev page
        button = createButton(page, 'prev');
    }
    // Insert the element into the DOM element
    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};


// Function which contains the logic to divde the results into number of pages
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    // render results of currente page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);

    // render pagination buttons by calling the renderButtons
    renderButtons(page, recipes.length, resPerPage);
};

/*
Explanation:
1. We change the renderResults funtion by adding 2 new parameters:
i. pages = 1
ii. resultsPerPage = 10

2. We then define the start and end variables to slice the data of the array as per the resultsPerPage.
i. start: (pages-1) * resultsPerPage
ii. end: pages * resultsPerPage

3. We then use the slice method of the array on the recipes to slice the amount of data between start and end
*/

