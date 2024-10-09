const defaultState = {
    todos: [],
};

export default (state = defaultState, action) => {
    switch (action.type) {
        // Replaces state of all todos with new todos
        case 'TODOS/SET':
            return {
                ...state,
                todos: action.todos,
            };

        // Toggles completion status of a single todo given its todoID
        case 'TODOS/TOGGLE_COMPLETION':
            return {
                ...state,
                todos: state.todos.map(todo =>
                    todo.todoID === action.todoID
                        ? { ...todo, completed: !todo.completed }
                        : todo
                ),
            };

        case 'TODOS/RENAME':
            return {
                ...state,
                todos: state.todos.map(todo =>
                    todo.todoID === action.todoID
                        ? { ...todo, name: action.name }
                        : todo
                ),
            };

        case 'TODOS/DELETE':
            return {
                ...state,
                todos: state.todos.filter(todo => todo.todoID !== action.todoID),
            };
            
        default:
            return state;
    }
};
