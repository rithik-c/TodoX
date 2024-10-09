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

    // Added function to update the completion status of a todo given the todoID
    async function updateCompletionStatus(todoID, completed) {
        return await collection.updateOne(
            { todoID }, // Find the todo by its ID
            { $set: { completed } } // Update the completed property
        );
    }

    // Added function to update the name of a todo given the todoID
    async function updateTodoName(todoID, name) {
        return await collection.updateOne(
            { todoID }, // Find the todo by its ID
            { $set: { name } } // Update the name property
        );
    }

    return {
        insertOne,
        findAll,
        updateCompletionStatus,
        updateTodoName
    };
};