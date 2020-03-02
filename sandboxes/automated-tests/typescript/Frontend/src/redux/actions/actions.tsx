import * as types from './actionTypes';
import { CoreActionTypes } from './actionTypes';

export const increaseCount = (): CoreActionTypes => ({
  type: types.INCREASE_COUNT
});
