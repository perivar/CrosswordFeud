import { useEffect, useReducer, useState } from 'react';
import axios from 'axios';

interface IAction {
  type: string;
  payload?: object;
}

interface IState {
  response: any | null;
  isLoading: boolean;
  isError: boolean;
  error: any | null;
}

export const actions = {
  init: 'INIT',
  success: 'SUCCESS',
  fail: 'FAIL'
};

export const initialResponse: IState = {
  response: null,
  isLoading: false,
  isError: false,
  error: null
};

export function responseReducer(state: IState, action: IAction): IState {
  switch (action.type) {
    case actions.init:
      return { response: null, isLoading: true, isError: false, error: null };
    case actions.success:
      return { response: action.payload, isLoading: false, isError: false, error: null };
    case actions.fail:
      return { response: null, isLoading: false, isError: true, error: action.payload };
    default:
      return initialResponse;
  }
}

/**
 * Params
 * @param  {string} initialUrl - The request URL
 * @param  {('GET'|'POST'|'PUT'|'DELETE'|'HEAD'|'OPTIONS'|'PATCH')} method - The request method
 * @param  {object} [options={}] - (optional) The config options of Axios.js (https://goo.gl/UPLqaK)
 * @param  {function} [callback=(error, response) => {}] - (optional) Custom handler callback, NOTE: `error` and `response` will be set to `null` before request
 */

export interface DataApiProperties {
  initialUrl: string;
  method?: string;
  options?: any | null;
  callback?: Function;
}

/**
 * Returns
 * @param  {object} response - The response of Axios.js (https://goo.gl/dJ6QcV)
 * @param  {boolean} isLoading - The loading status
 * @param  {boolean} isError - The error status
 * @param  {object} error - HTTP error
 */

interface DataApiReturn extends IState {
  setUrl: Function;
}

const CancelToken = axios.CancelToken;

export const useDataApi = ({
  initialUrl,
  method = 'get',
  options = null, // cannot be {} as this will trigger an endless loop in useEffect
  callback
}: DataApiProperties): DataApiReturn => {
  const [results, dispatch] = useReducer(responseReducer, initialResponse);
  const [url, setUrl] = useState<string>(initialUrl);

  useEffect(() => {
    if (!url) return;

    // Set up a cancellation source
    const source = CancelToken.source();

    const callbackHandler = (error: any, response: any) => {
      if (callback) {
        // note this call back mush be called with an useCallback to avoid endless loop
        callback(error, response);
      }
    };

    const fetchData = async () => {
      callbackHandler(null, null);
      dispatch({ type: actions.init });
      try {
        const response = await axios({
          url,
          method,
          ...options,
          cancelToken: source.token
        });
        callbackHandler(null, response);
        dispatch({ type: actions.success, payload: response });
      } catch (error) {
        // check that this error is not because we cancelled it ourselves
        if (!axios.isCancel(error)) {
          callbackHandler(error, null);
          dispatch({ type: actions.fail, payload: error });

          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            // console.log(error.response.data);
            // console.log(error.response.status);
            // console.log(error.response.headers);
            // setErrorMessage(error.response);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            // console.log(error.request);
            // setErrorMessage(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            // console.log('Error', error.message);
            // setErrorMessage(error.message);
          }
          // console.log(error.config);
        }
      } finally {
        // setIsLoading(false);
      }
    };

    fetchData();
  }, [callback, method, options, url]);

  return {
    ...results,
    setUrl
  };
};
