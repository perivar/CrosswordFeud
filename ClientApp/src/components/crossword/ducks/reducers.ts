// ducks/reducers.ts
// The reducer deals with updating the state.

import Crossword from "../crosswords/crossword";
import { CrosswordActions, CrosswordActionTypes } from "./types";
import { ICrosswordReduxState } from "../types";

const initialCrosswordState: ICrosswordReduxState = { loading: false, data: Crossword.defaultProps.data, error: '' };

const crosswordReducer = function crossword(state = initialCrosswordState, action: CrosswordActions): ICrosswordReduxState {
    switch (action.type) {
        case CrosswordActionTypes.GET_REQUEST:
            return {
                ...state,
                loading: true
            };
        case CrosswordActionTypes.GET_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.data
            };
        case CrosswordActionTypes.GET_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.error
            };
        default:
            return state
    }
}

export default {
    crossword: crosswordReducer
};
