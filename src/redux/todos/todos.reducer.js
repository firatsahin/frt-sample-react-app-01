import { SET_TODOS } from "./todos.actions";

const INITIAL_STATE = {
    inProgress: false,
    todos: []
};

const reducer = (state = INITIAL_STATE, action) => {
    console.log("todos reducer here!", state);
    switch (action.type) {
        case SET_TODOS:
            return { ...state, todos: action.payload.todos };
        default: return state;
    }
};

export default reducer;