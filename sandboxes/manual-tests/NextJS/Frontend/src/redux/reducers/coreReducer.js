import * as types from '../actions/actionTypes';

const initialState = {
  count: 0
};

const coreReducer = (state = initialState, action) => {
  let count;

  switch (action.type) {
    case types.INCREASE_COUNT: {
      count = state.count + 1;

      return {
        ...state,
        count
      };
    }

    default:
      return state;
  }
};

export default coreReducer;
