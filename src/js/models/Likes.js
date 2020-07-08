export default class Likes{
    constructor(){
        this.likes = [];
    }
    
    // Function to add likes
    addLike(id, title, publisher, img){
        // Object Destructuring
        const like = {id, title, publisher, img};
        this.likes.push(like);
        
        // Persist the data in the local storage
        this.persistData();
        return like;
    }
    
    // Function to delete the likes
    deleteLike(id){
        const index = this.likes.findIndex(el => {
            el.id === id
        });
        this.likes.splice(index,1);
        
        // Persist the data in the local storage
        this.persistData();
    }
    
    // Function to check if the particular id is liked so the state is saved.
    isLiked(id){
        return this.likes.findIndex(el => el.id === id) !=-1;
    }
    
    // Function to get the num of liked recipe
    getNumLikes(){
        return this.likes.length;
    }
    
    // create a function to persist data
    persistData(){
        // setItem use a key value pair to store the data
        // here we store the likes in the local storage and convert the items liked into JSON
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }
    
    // retrive the data from the localStorage
    readStorage(){
        const storage = JSON.parse(localStorage.getItem('likes'));
        // Restore the likes from the local storage
        if (storage){
            this.likes = storage;
        }
    }
}