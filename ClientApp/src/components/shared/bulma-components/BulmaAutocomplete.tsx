import React, { useState, memo, useCallback, useEffect } from 'react';
import axios, { AxiosInstance } from 'axios';
import produce, { Draft } from 'immer';
import { useDataApi } from '../hooks/data-api-hook';

interface BulmaAutocompleteState {
  // The active selection's index
  activeSuggestion: number;
  // The suggestions that match the user's input
  filteredSuggestions: any[];
  // Whether or not the suggestion list is shown
  showSuggestions: boolean;
  // What the user has entered
  userInput: string;
}

const initialState: BulmaAutocompleteState = {
  // The active selection's index
  activeSuggestion: 0,
  // The suggestions that match the user's input
  filteredSuggestions: [],
  // Whether or not the suggestion list is shown
  showSuggestions: false,
  // What the user has entered
  userInput: ''
};

interface BulmaAutocompleteArguments {
  suggestions?: any[];
  baseUrl?: string;
}

const authHeader = () => {
  // return authorization header with jwt token
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (user && user.token) {
    return {
      Authorization: 'Bearer ' + user.token,
      'Content-Type': 'application/json;charset=UTF-8' // this is for sending data
    };
  } else {
    return {};
  }
};

const axiosInstance: AxiosInstance = axios.create({});

const Autocomplete = (props: BulmaAutocompleteArguments) => {
  const { suggestions = [], baseUrl = '' } = props;

  const [state, setState] = useState<BulmaAutocompleteState>(initialState);

  if (baseUrl) axiosInstance.defaults.baseURL = baseUrl;
  if (authHeader) axiosInstance.defaults.headers = authHeader();
  const { response, error, isLoading, setUrl: fetchData } = useDataApi({
    // isError
    axios: axiosInstance
  });

  // Event fired when the user presses a key down
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const { activeSuggestion, filteredSuggestions } = state;

      // User pressed the enter key, update the input and close the
      // suggestions
      if (e.keyCode === 13 || e.keyCode === 9) {
        e.preventDefault();

        if (filteredSuggestions.length === 0) return;

        setState(
          produce((draft: Draft<BulmaAutocompleteState>) => {
            draft.activeSuggestion = 0;
            draft.showSuggestions = false;
            draft.userInput = filteredSuggestions[activeSuggestion];
          })
        );
      }
      // User pressed the up arrow, decrement the index
      else if (e.keyCode === 38) {
        e.preventDefault();

        if (activeSuggestion === 0) {
          return;
        }

        setState(
          produce((draft: Draft<BulmaAutocompleteState>) => {
            draft.activeSuggestion = draft.activeSuggestion - 1;
          })
        );
      }
      // User pressed the down arrow, increment the index
      else if (e.keyCode === 40) {
        e.preventDefault();

        if (activeSuggestion + 1 === filteredSuggestions.length) {
          return;
        }

        setState(
          produce((draft: Draft<BulmaAutocompleteState>) => {
            draft.activeSuggestion = draft.activeSuggestion + 1;
          })
        );
      }
    },
    [state]
  );

  // Event fired when the input value is changed
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const userInput = e.currentTarget.value;

      let filteredSuggestions: any[] = [];
      if (baseUrl) {
        const url = 'api/words/' + userInput;
        fetchData(url);
      } else {
        // Filter our suggestions that don't contain the user's input
        filteredSuggestions = suggestions.filter(
          suggestion => suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
        );
      }

      // Update the user input and filtered suggestions, reset the active
      // suggestion and make sure the suggestions are shown
      setState(
        produce((draft: Draft<BulmaAutocompleteState>) => {
          draft.activeSuggestion = 0;
          draft.filteredSuggestions = filteredSuggestions;
          draft.showSuggestions = true;
          draft.userInput = userInput;
        })
      );
    },
    [baseUrl, fetchData, suggestions]
  );

  // Event fired when the user clicks on a suggestion
  const handleClick = useCallback((e: any) => {
    e.preventDefault();
    const currentValue = e.currentTarget.innerText;
    // Update the user input and reset the rest of the state
    setState(
      produce((draft: Draft<BulmaAutocompleteState>) => {
        draft.activeSuggestion = 0;
        draft.filteredSuggestions = [];
        draft.showSuggestions = false;
        draft.userInput = currentValue;
      })
    );
  }, []);

  useEffect(() => {
    if (response) {
      console.log('useEffect() - handling load success (response)');

      const filteredSuggestions = response.data;

      // Update the user input and filtered suggestions, reset the active
      // suggestion and make sure the suggestions are shown
      setState(
        produce((draft: Draft<BulmaAutocompleteState>) => {
          draft.activeSuggestion = 0;
          draft.filteredSuggestions = filteredSuggestions;
          draft.showSuggestions = true;
        })
      );
    }
  }, [response]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (error) {
      console.log('useEffect() - handling load error');
      console.error(error);
    }
  }, [error]); // eslint-disable-line react-hooks/exhaustive-deps

  // suggestions list component
  const suggestionsListComponent = useCallback(
    (props: BulmaAutocompleteState) => {
      const { activeSuggestion, filteredSuggestions, showSuggestions, userInput } = props;

      if (showSuggestions && userInput) {
        if (filteredSuggestions.length) {
          return (
            <div className="dropdown-content">
              {filteredSuggestions.map((suggestion, index) => {
                return (
                  <div
                    key={suggestion}
                    role="presentation"
                    className={`dropdown-item${index === activeSuggestion ? ' is-active' : ''}`}
                    onClick={handleClick}>
                    {suggestion}
                  </div>
                );
              })}
            </div>
          );
        } else {
          return (
            <div className="dropdown-content">
              <div className="dropdown-item">No suggestions, you are on your own!</div>
            </div>
          );
        }
      }
    },
    [handleClick]
  );

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          className="input"
          type="text"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          value={state.userInput}
          aria-haspopup="true"
          aria-controls="dropdown-menu"
        />
      </div>
      {isLoading && <div className="is-loading" />}
      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        {suggestionsListComponent(state)}
      </div>
    </div>
  );
};

export const BulmaAutocomplete = memo(Autocomplete);
// export const BulmaAutocomplete = Autocomplete;
