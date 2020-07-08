// Global app controller
//Lecture 1 to 10
/*
import number from './test';
const x = 23;
console.log(`I imported ${number} from another module test.js! Variable x is : ${x}`);
*/

// Lecture 11: How ES6 Modules works
// Controller Codes go in here
// import str from './models/Search';
// Named Imports
//import {add, multiply, ID} from './views/SearchView'
// Creating aliases for above named imports
//import { add as a, multiply as m, ID} from './views/SearchView'
// Importing in different Type
// import * as searchView from './views/SearchView'
// Named imports
// console.log(`Using imported functions! ${add(ID, 2)} and ${multiply(ID, 2)}. ${str}`);

// Aliases
//console.log(`Using imported functions! ${a(ID, 2)} and ${m(ID, 2)}. ${str}`);

// Different Type
// console.log(`Using imported functions! ${searchView.add(searchView.ID, 2)} and ${searchView.multiply(searchView.ID, 2)}. ${str}`);

// Lecture 12: Making First API Calls
// https://forkify-api.herokuapp.com/
// Step 1: Create a function getResults using axios
/*import axios from 'axios'
async function getResults(query){
    
    try{
        // using axios to fetch results
        const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${query}`);
        // get the data of the recipes
        const recipes = res.data.recipes;
        //console.log(res);
        // Print the recipes from the response.
        console.log(recipes);
    }catch(error){
        alert(error);
    }
}

getResults('pasta');*/
// Leture 13: Building the search model
import Search from './models/Search'
import Recipe from './models/Recipe'
import List from './models/List'
import Likes from './models/Likes'
import {elements, renderLoader, clearLoader} from './views/base'
import * as searchView from './views/SearchView'
import * as recipeView from './views/RecipeView'
import * as listView from './views/ListView'
import * as likesView from './views/LikesView'
/*Global state of the app
1. Search object
2. Current recipe object
3. Shopping List object
4. Liked Recipes
*/
const state ={

};
//window.state = state;
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
* SEARCH CONTROLLER
*/
// The below method will be called on clicking the search button.
const controlSearch = async () =>{
    // 1. Get Query from the view
    //const query = 'pizza'// TODO
    const query = searchView.getInput();
    //console.log(query);
    
    if (query){
        // 2. Search the object and add it to the state.
        state.search = new Search(query);
        
        // 3. Prepare UI for results
        
        // clear the input field after every search
        searchView.clearInput();
        // clear the search result for every new search
        searchView.clearResults();
        
        // Render the loader spinner
        renderLoader(elements.searchRes);
        
        
        try{
            // 4. search for recipes
            await state.search.getResults();

            // 5. Render the results on UI
            //console.log(state.search.results);
            clearLoader();
            searchView.renderResults(state.search.results);
        }catch(error){
            console.log('Something Went wrong with the search');
            clearLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', e=>{
 e.preventDefault();
 controlSearch();
});

// TESTING
/*window.addEventListener('load', e=>{
 e.preventDefault();
 controlSearch();
});*/

// Add event listener for the pagination buttons
elements.searchResPages.addEventListener('click', e=>{
    const btn = e.target.closest('.btn-inline')
    //console.log(e.target);
    //console.log(btn);//o/p: <button class="btn-inline results__btn--next" data-goto="3"></button>
    
    if(btn){
        // The below script tries to extract the data from data-goto using btn.dataset.goto
        const goToPage = parseInt(btn.dataset.goto,10);
        searchView.clearResults();// clear the old page results and the pagination button
        searchView.renderResults(state.search.results, goToPage);
        //console.log(goToPage);
    }
});
/*
// Instantiate the Search class as below
const search = new Search('pizza')
console.log(search)

/*
Output:

Search({query: 'Pizza'})
*/

// Now we call the getResults function from the model in the controller
//search.getResults();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
* RECIPE CONTROLLER
*/
/* Lecture 19:
const r = new Recipe(47746);
r.getRecipe();
console.log(r);
*/

const controlRecipe = async() =>{
    // window.location.hash is used to extract the hash value from the url
    //const id = window.location.hash;
    // Get the ID from the URL
    const id = window.location.hash.replace('#','');
    //console.log(id);
    if (id){
        // 1. Prepare the UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        
        // Highlight the selected search item
        if (state.search) searchView.highlightSelected(id);
        
        // 2. Create new recipe object
        state.recipe  = new Recipe(id);
        
        // Expose the recipe to window
        // TESTING
        //window.r = state.recipe;
        
        try{
            // 3. Get recipe data using await
            await state.recipe.getRecipe();
            //console.log(state.recipe.ingredients);
            
            state.recipe.parseIngredients();
            
            // 4. Calc Timings and Servings
            state.recipe.calcTime();
            state.recipe.calcServings();
            
            // 5. Render the recipe
            //console.log(state.recipe);
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
                );
            
        }catch(error){
            console.log(error);
            console.log("Error Processing Recipe!");
        }
        
    }
}

// Hashchange event in javascript
//window.addEventListener('hashchange', controlRecipe);

// We need to add event listener to avoid the circumstance where we need to keep the value of hastag of the last page clicked
//window.addEventListener('load', controlRecipe);

// Example of adding the same event listener to multiple events
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
* LIST CONTROLLER
*/
const controlList = () => {
    // Create a new list IF there is none yet
    if (!state.list) {
        state.list = new List();
 
        // Add each ingredient to the list
        state.recipe.ingredients.forEach((el) => {
            const item = state.list.addItem(el.count, el.unit, el.ingredient);
            listView.renderItem(item);
        });
    } else {
        state.recipe.ingredients.forEach((el) => {
            // Check for duplicates
            const id = state.list.duplicateID(el.unit, el.ingredient);
            if (!id) {
                // Add ingredients to list if not duplicate
                const item = state.list.addItem(el.count, el.unit, el.ingredient);
                listView.renderItem(item);
            } else {
                // Update count if duplicate
                const count = state.list.getCount(id) + el.count;
                listView.updateItem(id, count);
                state.list.updateCount(id, count);
            }
        });
    }
};

// Handle delete and update item list events
elements.shopping.addEventListener('click', e => {
   // use the closest function to get the data attribute
   const id = e.target.closest('.shopping__item').dataset.itemid;
   
   // Handle the delete event
   if(e.target.matches('.shopping__delete, .shopping__delete *')){
       // Delete from the state
       state.list.deleteItem(id);
       
       // Delete from the UI
       listView.deleteItem(id);
   }else if(e.target.matches('.shopping__count-value')){
       const val = parseFloat(e.target.value, 10);
       // Handle count update
       // Check if the val goes less than 0
       if (val<=0){
           // stepUp does not let the value go down to -ve value
           e.target.stepUp();
           const val = parseFloat(e.target.value,10);
       }
       state.list.updateCount(id,val);
   }
});

// Handle the count update when user manually updates the value in the shopping count value
elements.shopping.addEventListener('change', (e) => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        if (val <= 0) {
            e.target.stepUp();
            const val = parseFloat(e.target.value, 10);
        }
        state.list.updateCount(id, val);
    }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
LIKE CONTROLLER
*/

const controlLikes = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has NOT yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.publisher,
            state.recipe.img
        );
        // Toggle the like button
        likesView.toggleLikeBtn(true);

        // Add like to UI list
        likesView.renderLike(newLike);

    // User HAS liked current recipe
    } else {
        // Remove like from the state
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like from UI list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();
    
    // Restore likes
    state.likes.readStorage();

    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});

// Handling recipe button clicks
/*
Note: We use the matches function to approimate the click location of the button containing images or span element
*/
elements.recipe.addEventListener('click', e=>{
    if (e.target.matches('.btn-decrease, .btn-decrease *')){
        if(state.recipe.servings > 1){
            // Decrease button is clicked
            state.recipe.updateServings('dec');  
            // Update the UI
            recipeView.updateServingsIngredients(state.recipe);
        }
    }else if (e.target.matches('.btn-increase, .btn-increase *')){
        // Increase button is clicked
        state.recipe.updateServings('inc');   
        recipeView.updateServingsIngredients(state.recipe);
    }else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        // Add ingredients to the shopping list
        controlList();
    }else if(e.target.matches('.recipe__love, .recipe__love *')){
        // Add likes using the like controller
        controlLikes();
    }
    //console.log(state.recipe);
});

