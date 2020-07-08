import {elements} from './base';

// function to render the item in the View
export const renderItem = item => {
    // Markup varibale for the list contained below ul with class name shopping__list
    const markup = `
        <li class="shopping__item" data-itemid = ${item.id}>
                    <div class="shopping__count">
                        <input type="number" min="0" class = "shopping__count-value" value="${item.count}" step="${item.count}">
                        <p>${item.unit}</p>
                    </div>
                    <p class="shopping__description">${item.ingredient}</p>
                    <button class="shopping__delete btn-tiny">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-cross"></use>
                        </svg>
                    </button>
        </li>
    `;
    elements.shopping.insertAdjacentHTML('beforeend', markup);
}

// function to delete item in the View
export const deleteItem = id =>{
    // select the item id from the data attribute in the list
    const item = document.querySelector(`[data-itemid ="${id}"]`);
    // remove the child
    item.parentElement.removeChild(item);
}

// function to updateItem of the shopping list
export const updateItem = (id, count) => {
    const item = document.querySelector(`[data-itemid="${id}"]`);
    if (item) {
        item.querySelector('.shopping__count-value').value = count;
    }
};