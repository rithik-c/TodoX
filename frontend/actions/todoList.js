// Action to set todos
export const setTodos = (todos) => ({
    type: 'TODOS/SET',
    todos,
});

// Action to toggle todo completion
export const toggleTodoCompletion = (todoID) => ({
    type: 'TODOS/TOGGLE_COMPLETION',
    todoID,
});

// Action to rename a todo
export const renameTodo = (todoID, name) => ({
    type: 'TODOS/RENAME',
    todoID,
    name,
});
