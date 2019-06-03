import { applyMiddleware, combineReducers, createStore, Store } from "redux";
import thunk from "redux-thunk";
import { logger } from "./logger";

import forecastReducer from "../components/forecast/ducks/reducers";
import alertReducer from "../components/alert/ducks/reducers";
import authenticationReducer from "../components/auth/ducks/reducers";
import { IStoreState } from "../components/auth/types";

const reducers = {
  ...forecastReducer,
  ...alertReducer,
  ...authenticationReducer
};

export default function configureStore(): Store<IStoreState> {
  const rootReducer = combineReducers<IStoreState>(reducers);
  return createStore<IStoreState, any, any, any>(
    rootReducer,
    undefined,
    applyMiddleware(thunk, logger)
  );
}
