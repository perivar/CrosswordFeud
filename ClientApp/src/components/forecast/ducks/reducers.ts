/* eslint-disable default-param-last */
import { IForecast, IForecastState } from '../types';
import * as types from './types';

const initialForecastState: IForecastState = {
  forecasts: [] as IForecast[],
  loading: false,
  loadError: null
};

const forecastReducer = (state = initialForecastState, action: any) => {
  switch (action.type) {
    case types.GET_FORECAST_STARTED:
      return {
        ...state,
        loading: true,
        loadError: null
      };
    case types.GET_FORECAST_SUCCESS: {
      const forecasts = action.response.map((f: any) => f as IForecast);
      return {
        ...state,
        forecasts,
        loading: false
      };
    }
    case types.GET_FORECAST_FAILURE: {
      const { error } = action;
      return {
        ...state,
        forecasts: [],
        loading: false,
        loadError: error.message
      };
    }
    default:
      return state;
  }
};

export default {
  forecast: forecastReducer
};
