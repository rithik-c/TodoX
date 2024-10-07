export default (db) => {
    const { TODO_COLLECTION } = process.env;
    const collection = db.collection(TODO_COLLECTION);

    async function insertOne(todo) {
        return await collection.insertOne(todo);
    }

    // Added function to find all todos given a userID to only find currently signed in user's Todos
    async function findAll(userID) {
        return await collection.find({userID}).toArray();
    }

    return {
        insertOne,
        findAll
    };
};