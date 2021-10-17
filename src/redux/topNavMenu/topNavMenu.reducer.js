import AppSettings from "../../data/AppSettings";
import { ADD_NEW, REMOVE_LAST, LOG_ME_IN } from "./topNavMenu.actions";

const INITIAL_STATE = {
    maxItemsAllowed: 10,
    items: AppSettings.navItems
};

const reducer = (state = INITIAL_STATE, action) => {
    console.log("topNav reducer here!", state, action);
    switch (action.type) {
        case ADD_NEW:
            return { ...state, items: [...state.items, { text: action.payload.newMenuText || 'Redux Added', toLink: '/redux-added' }] };
        case REMOVE_LAST:
            state.items.pop(); // remove last one
            return { ...state, items: [...state.items] };
        case LOG_ME_IN:
            console.log("LOG_ME_IN (topNav reducer)");
            return state;
        default: return state;
    }
};

export default reducer;