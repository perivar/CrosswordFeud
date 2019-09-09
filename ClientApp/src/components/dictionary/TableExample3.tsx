/* eslint-disable prettier/prettier */
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import produce, { Draft } from 'immer';
import axios, { AxiosRequestConfig } from 'axios';
import '../shared/bulma-components/bulma-table.scss';
import { useSelector } from 'react-redux';
import BulmaTable, {
  SortableTableState,
  SortableTableColumn,
  RenderProps,
  getInitialSortings,
  ActionButtonProps,
  ActionButton,
  QueryParams
} from '../shared/bulma-components/BulmaTable';
import { BulmaEditableTextField } from '../shared/bulma-components/BulmaEditableTextField';
import { OdataFilter, OrderBy, OdataValues, getOdataQueryObject } from '../shared/hooks/odata-hook';
import { IStoreState } from '../../state/store';
import { history } from '../../history';
import { BulmaNotificationType, BulmaNotification } from '../shared/bulma-components/BulmaNotification';
import { BulmaConfirmButton } from '../shared/bulma-components/BulmaConfirmButton';
import { BulmaButton } from '../shared/bulma-components/BulmaButton';
import { BulmaAutocomplete } from '../shared/bulma-components/BulmaAutocomplete';
import LetterBoxes from './LetterBoxes';
// import { useDependenciesDebugger } from '../shared/hooks/dependency-debugger-hook';
// import { useDataApi } from '../shared/hooks/data-api-hook';

interface WordData {
  wordId: number;
  language: string;
  value: string;
  numberOfLetters: number;
  numberOfWords: number;
  relatedFrom: any[];
  relatedTo: any[];
  comment: string | null;
  createdDate: string;
  source: string;
}

// initial table state extends SortableTableState to add more attributes
interface ExtendedTableState extends SortableTableState {
  word?: string;
  pattern?: string;
}

// convert QueryParams2ODataValues
const convertQueryParamsToODataValues = (params: QueryParams): OdataValues => {
  const top = params && params.limit;
  const skip = params && params.offset;
  const filters: OdataFilter[] | undefined =
    params && params.search
      ? [
          {
            name: 'Value',
            operation: 'contains',
            value: params.search,
            dataType: 'string'
          }
        ]
      : undefined;
  const orderBy: OrderBy[] | undefined =
    params && params.sort && params.order
      ? [
          {
            name: params.sort,
            direction: params.order === 'asc' ? 'asc' : params.order === 'desc' ? 'desc' : 'asc'
          }
        ]
      : undefined;

  return { top, skip, filters, orderBy, count: true };
};

const getErrorMessage = (error: any) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    if (error.response.status === 401) {
      return 'No access';
    } else {
      return JSON.stringify(error.response.data, null, 0);
    }
  } else {
    // The request was made but no response was received or
    // something happened in setting up the request that triggered an Error
    return error.message;
  }
};

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

const getUrlUsingTableState = (tableState: ExtendedTableState) => {
  let url = '';
  if (tableState.word) {
    if (tableState.pattern) {
      url = "/odata/Words/Synonyms(Word='" + tableState.word + "', Pattern='" + tableState.pattern + "')";
    } else {
      url = "/odata/Words/Synonyms(Word='" + tableState.word + "')";
    }
  } else {
    url = '/odata/Words/';
  }
  return url;
};

//------------------------------------------------
export default function TableExample3() {
  const config = { apiUrl: process.env.REACT_APP_API };

  // const baseUrl = 'http://localhost:5000';
  const baseUrl = config.apiUrl;

  const [notificationType, setNotificationType] = useState<BulmaNotificationType>('warning');
  const [notificationDisplaying, setNotificationDisplaying] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>('');

  // set refs used by the word and word letter form
  // const wordRef: React.RefObject<HTMLInputElement> = React.createRef();
  // const letterPatternRef: React.RefObject<HTMLInputElement> = React.createRef();

  // use redux store
  const authentication = useSelector((state: IStoreState) => state.authentication);

  // redirect to login if we don't have the auth-token
  if (!authentication.logon.token) {
    // http://localhost:3000/login
    history.push('/login');
  }

  // define columns
  const columns: SortableTableColumn[] = useMemo(() => {
    const renderSynonymSearch = (renderProps: RenderProps) => {
      const handleSynonymSearch = (renderProps: RenderProps) => {
        // reset filter
        renderProps.setTableState(
          produce((draft: Draft<ExtendedTableState>) => {
            draft.filter = '';
            draft.word = renderProps.row.value;
            draft.pattern = '';
          })
        );

        // the url is updated automatically using an effect that monitors table state changes
      };

      return (
        <>
          <button
            type="button"
            className="button is-link is-outlined is-fullwidth"
            value={renderProps.value}
            onClick={() => handleSynonymSearch(renderProps)}>
            {renderProps.value}
          </button>
        </>
      );
    };

    const renderEditable = (renderProps: RenderProps) => {
      const handleValueChanged = (renderProps: RenderProps, newValue: string) => {
        // update row with the new value
        const clonedRow = { ...renderProps.row };
        clonedRow.value = newValue;

        const editParams: AxiosRequestConfig = {
          url: baseUrl + '/api/words/' + renderProps.uniqueRowId,
          method: 'PUT',
          data: JSON.stringify(clonedRow),
          responseType: 'json', // this is for parsing received data
          headers: authHeader()
          // headers: authentication.logon.token
          //   ? {
          //       Authorization: 'Bearer ' + authentication.logon.token,
          //       'Content-Type': 'application/json;charset=UTF-8' // this is for sending data
          //     }
          //   : {}
        };

        axios(editParams)
          .then(response => {
            // update the row
            setData(
              produce((draft: Draft<WordData[]>) => {
                const index = draft.findIndex(w => w.wordId === renderProps.row.wordId);
                if (index !== -1) {
                  draft[index] = response.data;
                }
              })
            );
            console.log('successfully updated row');
            console.log(response.data);
          })
          .catch(error => {
            setNotificationType('danger');
            setNotificationMessage(getErrorMessage(error));
            setNotificationDisplaying(true);
          });
      };

      return (
        <BulmaEditableTextField
          value={renderProps.value}
          onValueChanged={value => handleValueChanged(renderProps, value)}
        />
      );
    };

    const renderDateFormat = (dateObject: RenderProps) => {
      const d = new Date(dateObject.value);
      const day = d.getDate();
      const month = d.getMonth() + 1;
      const year = d.getFullYear();

      let dayString = day.toString();
      if (day < 10) {
        dayString = '0' + day;
      }

      let monthString = month.toString();
      if (month < 10) {
        monthString = '0' + month;
      }
      var date = dayString + '/' + monthString + '/' + year;

      return <>{date}</>;
    };
    // renderDateFormat.displayName = 'DateFormat';

    return [
      {
        header: 'Id',
        key: 'wordId',
        uniqueId: true,
        render: renderSynonymSearch
      },
      {
        header: 'Synonym',
        key: 'value',
        render: renderEditable
        // dataProps: { className: 'align-right' }
        // dataStyle: { verticalAlign: 'middle' }
      },
      {
        header: 'Ant. Ord',
        key: 'numberOfWords'
      },
      {
        header: 'Lengde',
        key: 'numberOfLetters'
      },
      {
        header: 'Bruker',
        key: 'comment'
      },
      {
        header: 'Dato',
        key: 'createdDate',
        render: renderDateFormat
      }
    ];
  }, [baseUrl]);

  // define action buttons
  const actionButtons: ActionButton[] = useMemo(() => {
    const renderDeleteButton = (renderProps: ActionButtonProps) => {
      const handleOnDeleteClick = () => {
        const ids = Object.keys(renderProps.tableState.checkboxes).filter(id => renderProps.tableState.checkboxes[id]);
        console.log('delete: ' + ids);

        const deleteParams: AxiosRequestConfig = {
          url: baseUrl + '/api/words/delete',
          method: 'DELETE',
          data: JSON.stringify(ids),
          responseType: 'json', // this is for parsing received data
          headers: authHeader()
          // headers: authentication.logon.token
          //   ? {
          //       Authorization: 'Bearer ' + authentication.logon.token,
          //       'Content-Type': 'application/json;charset=UTF-8' // this is for sending data
          //     }
          //   : {}
        };

        axios(deleteParams)
          .then(response => {
            // remove the row(s)
            setData(
              produce((draft: Draft<WordData[]>) => {
                const nonDeletedRows = draft.filter(element => !ids.includes(element.wordId.toString()));
                if (nonDeletedRows.length > 0) {
                  return nonDeletedRows;
                }
              })
            );
            console.log('successfully deleted row(s): ');
            console.log(response.data);
          })
          .catch(error => {
            setNotificationType('danger');
            setNotificationMessage(getErrorMessage(error));
            setNotificationDisplaying(true);
          });
      };
      const deleteButton = BulmaConfirmButton({
        type: 'danger',
        label: 'Slett',
        confirmLabel: 'Bekreft sletting',
        key: 'deleteRows',
        disabled: Object.keys(renderProps.tableState.checkboxes).some(id => renderProps.tableState.checkboxes[id])
          ? false
          : true,
        handleOnClick: handleOnDeleteClick
      });

      return deleteButton;
    };

    const renderDisconnectButton = (renderProps: ActionButtonProps) => {
      const handleOnDisconnectClick = () => {
        const ids = Object.keys(renderProps.tableState.checkboxes).filter(id => renderProps.tableState.checkboxes[id]);
        console.log('disconnect: ' + ids);
      };
      const disconnectButton = BulmaConfirmButton({
        type: 'warning',
        label: 'Koble fra',
        confirmLabel: 'Bekreft koble fra',
        key: 'disconnectRows',
        disabled: Object.keys(renderProps.tableState.checkboxes).some(id => renderProps.tableState.checkboxes[id])
          ? false
          : true,
        handleOnClick: handleOnDisconnectClick
      });

      return disconnectButton;
    };

    const renderResetButton = (renderProps: ActionButtonProps) => {
      const handleResetClick = () => {
        // reset
        renderProps.setTableState(
          produce((draft: Draft<ExtendedTableState>) => {
            draft.filter = '';
            draft.sortings = getInitialSortings(columns);
            draft.word = '';
            draft.pattern = '';
          })
        );

        // reset word and pattern refs
        // if (wordRef && wordRef.current) wordRef.current.value = '';
        // if (letterPatternRef && letterPatternRef.current) letterPatternRef.current.value = '';

        // the url is updated automatically using an effect that monitors table state changes
      };
      const resetButton = BulmaButton({
        type: 'primary',
        label: 'Tilbakestill',
        key: 'resetRows',
        disabled: false,
        handleOnClick: handleResetClick
      });

      return resetButton;
    };

    return [
      {
        key: 'deleteRows',
        render: renderDeleteButton
      },
      {
        key: 'disconectRows',
        render: renderDisconnectButton
      },
      {
        key: 'resetRows',
        render: renderResetButton
      }
    ];
  }, [baseUrl, columns]);

  const intialState: ExtendedTableState = {
    sortings: getInitialSortings(columns),
    isAllSelected: false,
    checkboxes: {},
    filter: '',
    word: '',
    pattern: ''
  };

  const [data, setData] = useState<WordData[]>(() => []);
  const [tableState, setTableState] = useState<ExtendedTableState>(intialState);
  const [url, setUrl] = useState<string>(getUrlUsingTableState(tableState));

  const handleChangeWordValue = (word: string) => {
    // console.log('word: ' + word);
    setTableState(
      produce((draft: Draft<ExtendedTableState>) => {
        draft.filter = '';
        draft.word = word;
      })
    );
  };

  const handleChangePatternValue = (pattern: string) => {
    // console.log('pattern: ' + pattern);
    setTableState(
      produce((draft: Draft<ExtendedTableState>) => {
        draft.filter = '';
        draft.pattern = pattern;
      })
    );
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // use refs to get value
    // if (wordRef.current) wordValue = wordRef.current.value;
    // if (letterPatternRef.current) patternValue = letterPatternRef.current.value;

    setUrlFromTableState();
  };

  const setUrlFromTableState = useCallback(() => {
    const url = getUrlUsingTableState(tableState);
    setUrl(url);
  }, [tableState]);

  useEffect(() => {
    // console.log('useEffect() - tableState has changed');
    const url = getUrlUsingTableState(tableState);
    setUrl(url);
  }, [tableState]);

  // debug what has changed between renders
  // useDependenciesDebugger({ tableState });

  const queryParams = useCallback((params: QueryParams) => {
    return getOdataQueryObject(convertQueryParamsToODataValues(params));
  }, []);

  // const queryParams = useCallback((params: QueryParams) => {
  //   return {
  //     $filter: params.search === '' ? undefined : "contains(Value,'" + params.search + "')",
  //     $orderby:
  //       (params.sort === undefined ? 'wordId' : params.sort) +
  //       ' ' +
  //       (params.order === undefined ? 'desc' : params.order),
  //     $skip: params.offset,
  //     $top: params.limit,
  //     $count: true
  //   };
  // }, []);

  const renderShowing = useCallback((fromRow: number, toRow: number, numberOfRows: number) => {
    return (
      <>
        Viser {fromRow} til {toRow} av {numberOfRows} treff
      </>
    );
  }, []);

  const renderNumberOfRows = useCallback((numberOfRows: number, tableState: ExtendedTableState) => {
    if (tableState.word) {
      if (tableState.pattern) {
        // check if the pattern only contain the same character
        if (/^(.)\1+$/.test(tableState.pattern)) {
          return (
            <p>
              Fant <strong>{numberOfRows}</strong> synonym til {tableState.word} med {tableState.pattern.length}{' '}
              bokstaver
            </p>
          );
        } else {
          return (
            <p>
              Fant <strong>{numberOfRows}</strong> synonym til {tableState.word} med bokstavene {tableState.pattern}
            </p>
          );
        }
      } else {
        return (
          <p>
            Fant <strong>{numberOfRows}</strong> synonym til {tableState.word}
          </p>
        );
      }
    } else {
      return (
        <p>
          Fant <strong>{numberOfRows}</strong> ord
        </p>
      );
    }
  }, []);

  const bulmaTable = BulmaTable({
    columns,
    data,
    setData,
    tableState,
    setTableState,
    pagination: true,
    search: true,
    pageSize: 10,
    baseUrl,
    url,
    sidePagination: 'server',
    sortOrder: 'desc',
    queryParams: queryParams,
    responseHandler: res => {
      return {
        total: res['@odata.count'],
        rows: res.value
      };
    },
    actionButtons: actionButtons,
    previousText: 'Forrige',
    nextText: 'Neste',
    rowsPerPageText: 'rader på hver side',
    renderShowing: renderShowing,
    findInText: 'Finn',
    searchText: 'Søk',
    elementsText: 'treff',
    renderNumberOfRows,
    onLoadError: error => {
      setNotificationType('danger');
      setNotificationMessage(getErrorMessage(error));
      setNotificationDisplaying(true);
    },
    notFound: 'Fant ingen ord som passet. Vennligst prøv på nytt ...'
  });

  return (
    <>
      <form onSubmit={handleSearchSubmit}>
        <div className="field">
          <label className="label" htmlFor="searchWord">
            Spørreord
          </label>
          <BulmaAutocomplete
            // suggestions={[
            //   "Alligator",
            //   "Bask",
            //   "Crocodilian",
            //   "Death Roll",
            //   "Eggs",
            //   "Jaws",
            //   "Reptile",
            //   "Solitary",
            //   "Tail",
            //   "Wetlands"
            // ]}
            // inputRef={wordRef}
            id="searchWord"
            value={tableState.word}
            placeholder="Spørreord"
            notFound="Fant ingen ord som passet. Vennligst prøv på nytt ..."
            mandatory
            baseUrl={baseUrl}
            headers={authHeader()}
            queryHandler={word => {
              return 'api/words/' + encodeURIComponent(word);
            }}
            responseHandler={res => {
              return res.data;
            }}
            onChangeValue={handleChangeWordValue}
          />
          <p className="help">Skriv inn ordet du søker etter her</p>
        </div>

        <LetterBoxes
          // inputRef={letterPatternRef}
          value={tableState.pattern}
          onChangeValue={handleChangePatternValue}
        />

        <div className="field">
          <button type="submit" className="button is-primary">
            Søk
          </button>
        </div>
      </form>

      <div className="pb-20" />

      <BulmaNotification
        visible={notificationDisplaying}
        setVisible={setNotificationDisplaying}
        type={notificationType}
        message={notificationMessage}
      />
      {bulmaTable}
    </>
  );
}
