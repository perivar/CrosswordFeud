import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { logger } from "./logger";

import forecast from "../components/forecast/ducks/reducers";
import alert from "../components/alert/ducks/reducers";
import authentication from "../components/auth/ducks/reducers";

const reducers = {
  ...forecast,
  ...alert,
  ...authentication
};

export default function configureStore(initialState = {}) {
  const rootReducer = combineReducers(reducers as any);
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk, logger)
  );
}
