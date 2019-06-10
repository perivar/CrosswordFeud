import { applyMiddleware, combineReducers, createStore, Store } from "redux";
import thunk from "redux-thunk";
import { logger } from "./logger";

import forecastReducer from "../components/forecast/ducks/reducers";
import alertReducer from "../components/alert/ducks/reducers";
import authenticationReducer from "../components/auth/ducks/reducers";
import crosswordReducer from "../components/crossword/ducks/reducers"
import { IAlertState, IAuthState, IRegisterState, IUserState } from "../components/auth/types";
import { IForecastState } from "../components/forecast/types";

const reducers = {
  ...forecastReducer,
  ...alertReducer,
  ...authenticationReducer,
  ...crosswordReducer
};

export default function configureStore(): Store<IStoreState> {
  const rootReducer = combineReducers<IStoreState>(reducers);
  return createStore<IStoreState, any, any, any>(
    rootReducer,
    undefined,
    applyMiddleware(thunk, logger)
  );
}

export interface IStoreState {
  alert: IAlertState,
  authentication: IAuthState,
  crossword: any
  forecast: IForecastState,
  registration: IRegisterState,
  users: IUserState
}