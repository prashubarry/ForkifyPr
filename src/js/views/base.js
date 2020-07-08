/*
The file contains the query selector for each component of the view
1. searchInput: to search the value given in the input
2. searchForm:  to search the value given after the search button is pressed
*/

export const elements = {
    // DOM element to get the value from the search field
    searchInput: document.querySelector('.search__field'),
    // DOM element to get the result on clicking the search button of the form
    searchForm: document.querySelector('.search'),
    // DOM element to add the result to the respective div tag.
    searchResList:document.querySelector('.results__list'),
    // DOM element to add loader spinner
    searchRes: document.querySelector('.results'),
    // DOM element to add the pagination buttons
    searchResPages: document.querySelector('.results__pages'),
    // DOM element for displaying recipe
    recipe: document.querySelector('.recipe'),
    // DOM element for shopping list
    shopping: document.querySelector('.shopping__list'),
    // DOM element for toggle Menu List
    likesMenu: document.querySelector('.likes__field'),
    // DOM element for adding the liked list to menu
    likesList: document.querySelector('.likes__list')
};

export const elementsStrings = {
    loader: 'loader'
}
// Create a function renderLoader which takes in argument of parent
// deciding which parent element requires it.
export const renderLoader = parent =>{
    const loader = `
        <div class = "${elementsStrings.loader}">
            <svg>
                <use href = "img/icons.svg#icon-cw"></use>
            </svg>    
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
}

// clear the loader svg
export const clearLoader = () =>{
    const loader = document.querySelector(`.${elementsStrings.loader}`);
    if (loader){
        // move upto parent and then remove the loader
        loader.parentElement.removeChild(loader);
    }
}