import { LOG_ME_IN, LOG_ME_OUT, REQ_STARTED, REQ_ENDED } from "./userAuth.actions";

const INITIAL_STATE = {
    isAuthenticated: false,
    reqState: 'stopped'
};

const reducer = (state = INITIAL_STATE, action) => {
    console.log("userAuth reducer here!", state, action);
    switch (action.type) {
        case LOG_ME_IN:
            console.log("LOG_ME_IN (userAuth reducer)");
            return { ...state, isAuthenticated: true, userName: action.payload.userName, reqState: 'stopped' };
        case LOG_ME_OUT:
            return INITIAL_STATE;
        case REQ_STARTED:
            return { ...state, reqState: 'running' };
        case REQ_ENDED:
            return { ...state, reqState: 'stopped' };
        default: return state;
    }
};

export default reducer;