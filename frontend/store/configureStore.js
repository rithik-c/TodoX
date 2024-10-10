import { createStore, combineReducers } from 'redux';
import signIn from '../reducers/signIn';
import signUp from '../reducers/signUp';
import todo from '../reducers/todo';
import todoList from '../reducers/todoList';
import colourScheme from '../reducers/colourScheme';


let store;

export default () => {
    if (store) {
        return store;
    }
    //Store creation
    store = createStore(
        combineReducers({
            signIn,
            signUp,
            todo,
            todoList,
            colourScheme
        })
    );

    return store;
};

