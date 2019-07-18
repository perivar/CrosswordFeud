import { useEffect, useState } from 'react';
import axios from 'axios';

export interface DataApiProperties {
  initialUrl: string;
  method?: string;
  options?: any | null;
  initialData?: any | null;
  autoLoad?: boolean;
  callback?: Function;
}

export interface DataApiState {
  data: any;
  isLoading: boolean;
  isError: boolean;
  errorMessage: any | null;
  setUrl: Function;
}

export const useDataApi = ({
  initialUrl,
  method = 'get',
  options = null,
  initialData = null,
  autoLoad = true,
  callback
}: DataApiProperties): any => {
  const [data, setData] = useState<any | null>(initialData);
  const [url, setUrl] = useState<string>(initialUrl);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        const result = await axios({
          url,
          method,
          ...options
        });
        setData(result.data);

        if (callback) {
          // note this call back mush be called with an useCallback to avoid endless loop
          callback(result.data);
        }
      } catch (error) {
        setIsError(true);

        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          // console.log(error.response.data);
          // console.log(error.response.status);
          // console.log(error.response.headers);
          setErrorMessage(error.response);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          // console.log(error.request);
          setErrorMessage(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          // console.log('Error', error.message);
          setErrorMessage(error.message);
        }
        // console.log(error.config);
      } finally {
        setIsLoading(false);
      }
    };

    // if autoLoad is true, just trigger fetch data immideatly
    if (autoLoad) {
      fetchData();
    } else {
      // otherwise wait until the url has changed
      if (url !== initialUrl) fetchData();
    }
  }, [autoLoad, initialUrl, method, options, url, callback]);

  return [data, isLoading, isError, errorMessage, setUrl];
};
