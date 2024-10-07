export default {
    "type": "object",
    "properties": {
        "todoID": {
            "type": "string"
        },
        "userID": {
            "type": "string"
        },
        "name": {
            "type": "string"
        },
        // Creating new 'completed' property to include in each todo's document data to persist status in the database
        "completed": {
            "type": "boolean"
        },
        "created": {
            "type": "string",
            "examples": ["2021-11-30T23:39:27.060Z"] 
        }
    },
    "required": ["todoID", "userID", "name", "completed", "created"]
};