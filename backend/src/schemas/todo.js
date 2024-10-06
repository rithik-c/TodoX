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
        // TODO: Create Redux actions and reducer for this property
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