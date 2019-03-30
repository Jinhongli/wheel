import { SET_VISIBILITY_FILTER, VISIBILITY_FILTER } from './actions';

export const initialState = VISIBILITY_FILTER.ALL;

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter;
    default:
      return state;
  }
};

export default reducer;
