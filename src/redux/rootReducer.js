import { combineReducers } from 'redux';

// reducers here
import topNavMenu from './topNavMenu/topNavMenu.reducer';
import userAuth from "./userAuth/userAuth.reducer";
import todos from './todos/todos.reducer';

const rootReducer = combineReducers({
    topNav: topNavMenu,
    userAuth: userAuth,
    todos: todos
});

export default rootReducer;