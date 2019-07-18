import { useEffect, useState } from 'react';
import axios from 'axios';

export interface DataApiProperties {
  initialUrl: string;
  method?: string;
  options?: any | null;
  initialData?: any | null;
  autoLoad?: boolean;
}

export interface DataApiState {
  data: any;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  setUrl: Function;
}

export const useDataApi = ({
  initialUrl,
  method = 'get',
  options = null,
  initialData = null,
  autoLoad = true
}: DataApiProperties): DataApiState => {
  const [data, setData] = useState<any | null>(initialData);
  const [url, setUrl] = useState<string>(initialUrl);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      } catch (error) {
        setIsError(true);
        setErrorMessage(error.message);
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
  }, [autoLoad, initialUrl, method, options, url]);

  return { data, isLoading, isError, errorMessage, setUrl };
};
