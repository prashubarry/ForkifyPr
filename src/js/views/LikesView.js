import {elements} from './base';
import {limitRecipeTitle} from './SearchView'
// function to toggle button for the like button
export const toggleLikeBtn = isLiked =>{
    /*We toggle the below:
    <use href="img/icons.svg#icon-heart-outlined"></use>
    1. #icon-heart-outlined- when liked
    2. #icon-hear-notoutline- when not liked
    */
    const iconString = isLiked ? 'icon-heart':'icon-heart-outlined';
    // In the use tag with class recipe__love use we set the attribute of the tag as below
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
}

// function to add the list of the liked items to main heart besides the search field
export const toggleLikeMenu = numLikes => {
    elements.likesMenu.style.visibility = numLikes > 0? 'visible':'hidden';
}

// function to render the liked items in the like menu
export const renderLike = like => {
    const markup = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="${like.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                    <p class="likes__author">${like.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.likesList.insertAdjacentHTML('beforeend', markup);
    
}

// function to delete like from the list
export const deleteLike = (id) =>{
    const el = document.querySelector(`.likes__link[href="#${id}"]`);
    if (el) el.parentElement.removeChild(el);
}