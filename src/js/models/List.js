// Import uniqid
import uniqid from 'uniqid';

export default class List{
    constructor(){
        // Pushing the ingredients to the item array
        this.items = [];
    }
    
    // function to addItem to the Shopping list
    addItem(count, unit, ingredient){
        // We need to add external ID to track the ingredinets being added
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }
    
    // function to deleteItem from the Shopping List
    deleteItem(id){
        // usage of splice method
        // [2,4,6] splice(1,1)=> returns 4 and the array now is [2,6]
        // [2,4,6] slice(1,2)=> returns 4 but the array remains the same [2, 4,6]
        // Using findIndex to return the index of the specified value
        const index = this.items.findIndex(el => {
            // test current element id equals the passed id
            el.id === id
        });
        
        this.items.splice(index,1);
    }
    
    // function to update the count of the ingredients
    updateCount(id, newCount){
        // using find to return the item
        this.items.find(el => el.id === id).count = newCount;
    }
    
    // function to get the duplicateId being added to the list
    duplicateID(unit, ingredient) {
        const dupeItem = this.items.find((el) => el.ingredient === ingredient && el.unit === unit);
        return dupeItem ? dupeItem.id : false;
    }
    
    // Function to get the count of the list
    getCount(id) {
        return this.items.find((el) => el.id === id).count;
    }
}