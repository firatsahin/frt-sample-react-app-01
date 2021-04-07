import { combineReducers } from 'redux';

// reducers here
import topNavMenu from './topNavMenu/topNavMenu.reducer';
import userAuth from "./userAuth/userAuth.reducer";

const rootReducer = combineReducers({
    topNav: topNavMenu,
    userAuth: userAuth
});

export default rootReducer;