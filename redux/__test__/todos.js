import { ADD_TODO, TOGGLE_TODO } from './actions';

export const initialState = [];

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          text: action.text,
          complete: false,
        },
      ];
    case TOGGLE_TODO:
      return state.map((todo, i) => {
        if (i === action.index) {
          return {
            ...todo,
            complete: !todo.complete,
          };
        }
        return todo;
      });
    default:
      return state;
  }
};

export default reducer;
