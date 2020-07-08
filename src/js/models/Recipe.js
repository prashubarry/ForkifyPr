import axios from 'axios'

// Create a Recipe classes whose constructor accepts the recipe ID
export default class Recipe{
    constructor(id){
        this.id = id;
    }
    async getRecipe(){
        try{
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            //console.log(res);
            // Collect the data from the API
            this.title = res.data.recipe.title;
            this.publisher = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        }catch(error){
            console.log(error);
        }
    }
    
    // Function to calculate the time taken to cook the recipe
    calcTime(){
        // Assume that we need 15 mins each for 3 ingredients 
        const  numIng = this.ingredients.length;
        const periods = Math.ceil(numIng/3);// numIng / 3
        this.time = periods * 15;
    }
    
    // Function to calculate the Servings
    calcServings(){
        // Assume 4 servings
        this.servings = 4;
    }
    
    // The Text of ingredients are fo varying texts, hence we need to make it uniform
    // Create a function to parse the ingredients
    parseIngredients(){
        // Create 2 arrays 
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg','g'];
        const resolveCount = (array) => {
            return array.length === 1 ? eval(array[0].replace('-', '+')) : eval(array.join('+'));
        };
        // Create a new array for ingredients
        const newIngredients = this.ingredients.map(el=>{
            // 1. Uniform Units 
            
            // Convert the ingredient to lowercase
            let ingredient = el.toLowerCase();
            
            // Loop through each word from unitsLong in the ingredient and replace the same with word in the unitsShort
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });
            
            // 2. Remove Parenthesis
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
            //ingredient = ingredient.replace(/[\])}[{(] */g, ' ');
            
            // 3. Parse Ingredients into count, unit and ingredient
            // remove the spaces from the word
            const arrIng = ingredient.split(' ');
            //Exceptional Case New code starts here…
            /*arrIng.forEach((word, i) => {
                unitsShort.forEach((unit) => {
                    if (word.startsWith(unit) && word.length === unit.length + 1) {
                        arrIng[i] = unit;
                    }
                });
            });*/
            // Find the unit Index
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));
            
            let objIng; 
            
            if (unitIndex > -1) {
                // There is a unit
                // Ex. 4 1/2 cups, arrCount is [4, 1/2] --> eval("4+1/2") --> 4.5
                // Ex. 4 cups, arrCount is [4]
                
                const arrCount = arrIng.slice(0, unitIndex);// Ex: 4 1/2 cups, arrCount[4, 1/2]
                
                let count;
                
                //eval function is used to do maths in place viz: eval("4+1/2") => 4.5
                if (arrCount.length === 1){//Ex. 4 cups, arrCount is [4]
                    count = eval(arrIng[0].replace('-', '+'));// For 1-1/2 hence replace it as 1+1/2 and call eval
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };

            } else if (parseInt(arrIng[0], 10)) {
                // There is NO unit, but 1st element is number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } 
            /* Exceptional Case else if (parseInt(arrIng[0].charAt(0), 10)) {
                // There is NO unit, but the first element is a number
                const arrCount = [arrIng[0]];
                if (parseInt(arrIng[1].charAt(0), 10)) {
                    arrCount.push(arrIng[1]);
                }
                objIng = {
                    count: resolveCount(arrCount),
                    unit: '',
                    ingredient: arrIng.slice(arrCount.length).join(' '),
                };
            }*/else if (unitIndex === -1) {
                // There is NO unit and NO number in 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }
            
            //return ingredient;
            return objIng;
        });
        this.ingredients = newIngredients;
    }
    
    // A function to update the servings of the Recipe
    updateServings(type){
        // Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
        
        // Ingredients
        
        // Update the count numbers of the ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });
        
        // Updates the servings
        this.servings = newServings;
        
        
    }
}