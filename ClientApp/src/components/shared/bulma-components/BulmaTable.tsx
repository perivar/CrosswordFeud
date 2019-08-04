import React, {
  Dispatch,
  SetStateAction,
  ChangeEvent,
  CSSProperties,
  HTMLAttributes,
  useCallback,
  useState,
  useEffect,
  useRef,
  ReactNode
} from 'react';
import axios, { AxiosInstance } from 'axios';
import produce, { Draft } from 'immer';
import { useDataApi } from '../hooks/data-api-hook';
import './bulma-table.scss';
import { BulmaCheckboxField } from './BulmaCheckboxField';
import BulmaPaginator, { PaginationPlacement } from './BulmaPagination';
import { BulmaSearchField } from './BulmaSearchField';
// import { useWhyDidYouUpdate } from '../hooks/why-did-you-update-hook';
import { useDependenciesDebugger } from '../hooks/dependency-debugger-hook';

export type SortingType = 'desc' | 'asc' | 'both';

export interface SortableTableData {
  [key: string]: any;
}

export interface SortableCheckboxMap {
  [key: string]: boolean;
}

export interface SortableTableColumn {
  header: string;
  key: string;
  uniqueId?: boolean; // which column holds the id key
  defaultSorting?: string; // ASC or asc or DESC or desc
  headerStyle?: CSSProperties; // { fontSize: '15px', backgroundColor: '#FFDAB9', width: '100px' },
  headerProps?: HTMLAttributes<HTMLElement>; // { className: 'align-left' },
  dataStyle?: CSSProperties; // { fontSize: '15px', backgroundColor: '#FFDAB9' },
  dataProps?: HTMLAttributes<HTMLElement>; // { className: 'align-right' },
  sortable?: boolean;
  searchable?: boolean;
  render?: (value: RenderProps) => ReactNode;
  descSortFunction?: (sortedData: SortableTableData, key: string) => SortableTableData;
  ascSortFunction?: (sortedData: SortableTableData, key: string) => SortableTableData;
}

export interface SortableTableIconInfo {
  iconStyle?: CSSProperties;
  iconDesc?: ReactNode;
  iconAsc?: ReactNode;
  iconBoth?: ReactNode;
}

export interface QueryParams {
  limit: number;
  offset: number;
  search: string;
  sort: string;
  order: SortingType;
  [key: string]: string | number;
}

export interface ResponseParams {
  total: number;
  rows: any;
}

export interface ActionButtonProps {
  tableState: SortableTableState;
  setTableState: Dispatch<SetStateAction<SortableTableState>>;
  url?: string;
  setUrl: Function;
}

export interface ActionButton {
  key: string;
  render?: (value: ActionButtonProps) => ReactNode;
}

export interface SortableTableProps extends SortableTableIconInfo {
  columns: SortableTableColumn[];
  data: SortableTableData;
  setData?: Dispatch<React.SetStateAction<SortableTableData | any>>;
  tableState: SortableTableState;
  setTableState: Dispatch<SetStateAction<SortableTableState>>;
  pagination?: boolean;
  search?: boolean;
  pageSize?: number;
  baseUrl?: string;
  url?: string;
  sidePagination?: 'server' | 'client';
  sortOrder?: 'desc' | 'asc';
  queryParams?: (params: QueryParams) => Record<string, string | number | boolean | undefined>;
  responseHandler?: (response: any) => ResponseParams;
  style?: CSSProperties;
  maxButtons?: number;
  paginationPlacement?: PaginationPlacement;
  useGotoField?: boolean;
  alwaysUsePreviousNextButtons?: boolean;
  actionButtons?: ActionButton[];
}

export interface SortableTableState {
  sortings: SortingType[];
  isAllSelected: boolean;
  checkboxes: SortableCheckboxMap;
  filter: string;
}

interface SortableTableHeaderProps extends SortableTableIconInfo {
  columns: SortableTableColumn[];
  tableState: SortableTableState;
  setTableState: Dispatch<SetStateAction<SortableTableState>>;
  handleCheckboxChange: (changeEvent: ChangeEvent<HTMLInputElement>) => void;
}

interface SortableTableHeaderItemProps extends SortableTableIconInfo {
  column: SortableTableColumn;
  setTableState: Dispatch<SetStateAction<SortableTableState>>;
  index: number;
  sorting?: SortingType;
}

// SortableTableHeaderItem
const SortableTableHeaderItem = (props: SortableTableHeaderItemProps) => {
  // useWhyDidYouUpdate('SortableTableHeaderItem', props);
  const { column, setTableState, index, sorting, iconStyle, iconDesc, iconAsc, iconBoth } = props;
  // console.log(`render header :: ${column.key}`);
  const handleHeaderClick = useCallback(() => {
    if (column.sortable || column.sortable === undefined) {
      setTableState(
        produce((draft: Draft<SortableTableState>) => {
          draft.sortings = draft.sortings.map((sorting: SortingType, i: number) => {
            // set next sorting type for the selected sorting
            // the others need to be reset back to both
            if (i === index) {
              sorting = nextSortingState(sorting);
            } else {
              sorting = 'both';
            }
            return sorting;
          });
        })
      );
    }
  }, [column.sortable, index, setTableState]);

  // default to being sortable (i.e. undefined)
  let sortIcon;
  if (column.sortable || column.sortable === undefined) {
    if (iconBoth) {
      sortIcon = iconBoth;
    } else {
      sortIcon = (
        <span className="icon has-text-grey-light" style={iconStyle}>
          <i className="fas fa-sort" />
        </span>
      );
    }
    if (sorting === 'desc') {
      if (iconDesc) {
        sortIcon = iconDesc;
      } else {
        sortIcon = (
          <span className="icon has-text-info" style={iconStyle}>
            <i className="fas fa-sort-up" />
          </span>
        );
      }
    } else if (sorting === 'asc') {
      if (iconAsc) {
        sortIcon = iconAsc;
      } else {
        sortIcon = (
          <span className="icon has-text-info" style={iconStyle}>
            <i className="fas fa-sort-down" />
          </span>
        );
      }
    }
  }

  return (
    <th
      className="is-unselectable"
      key={`header-${column.key}`}
      style={column.headerStyle}
      onClick={handleHeaderClick}
      {...column.headerProps}>
      {column.header}
      {sortIcon}
    </th>
  );
};

const MemoizedSortableTableHeaderItem = React.memo(SortableTableHeaderItem);

// SortableTableHeader
const SortableTableHeader = (props: SortableTableHeaderProps) => {
  // useWhyDidYouUpdate('SortableTableHeader', props);
  const { columns, tableState, setTableState, iconStyle, iconDesc, iconAsc, iconBoth, handleCheckboxChange } = props;
  const headers = columns.map((column: SortableTableColumn, index: number) => {
    const sorting = tableState.sortings[index];

    const sortableTableHeaderItem = (
      <MemoizedSortableTableHeaderItem
        key={`header-${column.key}`}
        column={column}
        // tableState={tableState}
        setTableState={setTableState}
        index={index}
        sorting={sorting}
        iconStyle={iconStyle}
        iconDesc={iconDesc}
        iconAsc={iconAsc}
        iconBoth={iconBoth}
      />
    );

    return sortableTableHeaderItem;
  });

  const name = 'checkAll';
  const checkbox = (
    <th key="header-select-all">
      <BulmaCheckboxField
        label=""
        name={name}
        checked={tableState.isAllSelected}
        handleChange={handleCheckboxChange}
        checkboxProps={{ 'aria-label': `${tableState.isAllSelected ? 'Un-select all' : 'Select all'}` }}
      />
    </th>
  );

  return (
    <thead>
      <tr key="header-row">
        {checkbox}
        {headers}
      </tr>
    </thead>
  );
};

export interface RenderProps {
  uniqueRowId: string;
  column: SortableTableColumn;
  row: any;
  value: any;
  setUrl: Function;
  setTableState: Dispatch<SetStateAction<SortableTableState>>;
}

interface SortableTableRowProps {
  data: SortableTableData;
  columns: SortableTableColumn[];
  uniqueIdKey: string;
  isSelected: boolean;
  setUrl: Function;
  setTableState: Dispatch<SetStateAction<SortableTableState>>;
  handleCheckboxChange: (changeEvent: ChangeEvent<HTMLInputElement>) => void;
}

// SortableTableRow
const SortableTableRow = (props: SortableTableRowProps) => {
  // useWhyDidYouUpdate('SortableTableRow', props);
  const { data, columns, uniqueIdKey, isSelected, setUrl, setTableState, handleCheckboxChange } = props;

  console.log(`render row :: ${data[uniqueIdKey]}`);

  const tds = columns.map((column: SortableTableColumn) => {
    let value = data[column.key];
    if (column.render) {
      const renderInfo: RenderProps = {
        uniqueRowId: data[uniqueIdKey],
        column,
        value,
        row: data,
        setUrl,
        setTableState
      };
      value = column.render(renderInfo);
    }
    return (
      <td key={`row-${data[uniqueIdKey]}-${column.key}`} style={column.dataStyle} {...(column.dataProps || {})}>
        {value}
      </td>
    );
  });

  const checkbox = (
    <td key={`row-${data[uniqueIdKey]}-select`}>
      <BulmaCheckboxField
        label=""
        name={`${data[uniqueIdKey]}`}
        checked={isSelected}
        handleChange={handleCheckboxChange}
        checkboxProps={{ 'aria-label': `${isSelected ? 'Un-select' : 'Select'} row with id: ${data[uniqueIdKey]}` }}
      />
    </td>
  );

  return (
    <tr key={`row-${data[uniqueIdKey]}`} className={isSelected ? 'is-selected' : ''}>
      {checkbox}
      {tds}
    </tr>
  );
};

interface SortableTableBodyProps {
  columns: SortableTableColumn[];
  uniqueIdKey: string;
  data: SortableTableData;
  tableState: SortableTableState;
  setTableState: Dispatch<SetStateAction<SortableTableState>>;
  setUrl: Function;
  handleCheckboxChange: (changeEvent: ChangeEvent<HTMLInputElement>) => void;
}

// make sure to memoize the rows to avoid re-renders
const MemoizedSortableTableRow = React.memo(SortableTableRow);

// SortableTableBody
const SortableTableBody = (props: SortableTableBodyProps) => {
  // useWhyDidYouUpdate('SortableTableBody', props);
  const { columns, uniqueIdKey, data, tableState, setTableState, setUrl, handleCheckboxChange } = props;

  const bodies = data.map((row: any) => {
    const sortableTableRow = (
      <MemoizedSortableTableRow
        key={`row-${row[uniqueIdKey]}`}
        uniqueIdKey={uniqueIdKey}
        data={row}
        columns={columns}
        isSelected={tableState.checkboxes[row[uniqueIdKey]]}
        handleCheckboxChange={handleCheckboxChange}
        setUrl={setUrl}
        setTableState={setTableState}
      />
    );

    return sortableTableRow;
  });

  return <tbody>{bodies}</tbody>;
};

// filter
const filterData = (
  data: SortableTableData,
  columns: SortableTableColumn[],
  searchQuery: string
): SortableTableData => {
  // https://dev.to/iam_timsmith/lets-build-a-search-bar-in-react-120j
  let currentList: SortableTableData = [];

  // Variable to hold the filtered list before putting into state
  let newList: SortableTableData = [];

  // If the search bar isn't empty
  if (searchQuery !== '') {
    // Variable to hold the original version of the list
    currentList = data;

    // change search term to lowercase
    const lowercasedFilter = searchQuery.toLowerCase();

    // Use .filter() to determine which items should be displayed
    // based on the search terms
    newList = currentList.filter((item: any) => {
      return Object.keys(item).some(key => {
        // lookup columns with this key
        const column = columns.find(a => a.key === key);
        // check if the column has searchable set to true true or undefined
        if (column && (column.searchable || column.searchable === undefined)) {
          // get value using key
          const value = item[key];
          if (value) {
            let lowercasedValue = value;
            if (typeof value === 'string') {
              // change current item to lowercase
              lowercasedValue = value.toLowerCase();
            } else if (typeof value === 'number') {
              // change current item to string
              lowercasedValue = value.toString();
            }
            // check to see if the current list item includes the search term
            // If it does, it will be added to newList. Using lowercase eliminates
            // issues with capitalization in search terms and search content
            return lowercasedValue.includes(lowercasedFilter);
          } else {
            return null;
          }
        } else {
          return null;
        }
      });
    });
  } else {
    // If the search bar is empty, set newList to original task list
    newList = data;
  }

  return newList;
};

export interface SortableActionButtonProps {
  label: string;
  key: string;
  classNames: string; // is-warning
  disabled: boolean;
  handleOnClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const SortableActionButton = (props: SortableActionButtonProps): ReactNode => {
  const { label, key, classNames, disabled, handleOnClick } = props;
  return (
    <button
      key={key}
      type="button"
      className={'button' + (classNames ? ' ' + classNames : '')}
      disabled={disabled}
      aria-label={label}
      onClick={handleOnClick}>
      {label}
    </button>
  );
};

interface SortableTableTopBarProps {
  numberOfRows: number;
  tableState: SortableTableState;
  setTableState: Dispatch<SetStateAction<SortableTableState>>;
  search: boolean;
  url?: string;
  setUrl: Function;
  actionButtons?: ActionButton[];
}

// SortableTableSearchBar
const SortableTableTopBar = (props: SortableTableTopBarProps) => {
  const { numberOfRows, tableState, search, setTableState, url, setUrl, actionButtons } = props;

  const handleSearchSubmit = (filterQuery: string) => {
    setTableState(
      produce((draft: Draft<SortableTableState>) => {
        draft.filter = filterQuery;
      })
    );
  };

  const actionInfo: ActionButtonProps = { tableState, setTableState, url, setUrl };

  return (
    <nav className="level">
      <div className="level-left">
        {actionButtons &&
          actionButtons.map((actionButton: ActionButton) => (
            <p key={actionButton.key} className="level-item">
              {actionButton.render && actionButton.render(actionInfo)}
            </p>
          ))}
      </div>

      <div className="level-right">
        <div className="level-item">
          <p className="subtitle is-6">
            <strong>{numberOfRows}</strong> elements
          </p>
        </div>
        <div className="level-item">
          {search ? (
            <BulmaSearchField
              type="addon"
              label="Search"
              value={tableState.filter}
              placeholder="Find in table"
              handleSubmit={handleSearchSubmit}
            />
          ) : (
            ''
          )}
        </div>
      </div>
    </nav>
  );
};

// sort methods
const parseFloatable = (value: any): boolean => {
  return typeof value === 'string' && (/^\d+$/.test(value) || /^\d+$/.test(value.replace(/[,.%$]/g, '')))
    ? true
    : false;
};

const parseIfFloat = (value: any): number => {
  return parseFloat(value.replace(/,/g, ''));
};

const ascSortData = (data: SortableTableData, key: string): SortableTableData => {
  return sortDataByKey(data, key, (a: any, b: any) => {
    if (parseFloatable(a) && parseFloatable(b)) {
      a = parseIfFloat(a);
      b = parseIfFloat(b);
    }
    if (a >= b) {
      return 1;
    } else if (a < b) {
      return -1;
    }
  });
};

const descSortData = (data: SortableTableData, key: string): SortableTableData => {
  return sortDataByKey(data, key, (a: any, b: any) => {
    if (parseFloatable(a) && parseFloatable(b)) {
      a = parseIfFloat(a);
      b = parseIfFloat(b);
    }
    if (a <= b) {
      return 1;
    } else if (a > b) {
      return -1;
    }
  });
};

const sortData = (data: SortableTableData, columns: SortableTableColumn[], sortings: string[]): SortableTableData => {
  let sortedData = data;
  for (var i in sortings) {
    const sorting = sortings[i];
    const column = columns[i];
    const key = columns[i].key;
    switch (sorting) {
      case 'desc':
        if (column.descSortFunction && typeof column.descSortFunction == 'function') {
          sortedData = column.descSortFunction(sortedData, key);
        } else {
          sortedData = descSortData(sortedData, key);
        }
        break;
      case 'asc':
        if (column.ascSortFunction && typeof column.ascSortFunction == 'function') {
          sortedData = column.ascSortFunction(sortedData, key);
        } else {
          sortedData = ascSortData(sortedData, key);
        }
        break;
    }
  }
  return sortedData;
};

const sortDataByKey = (data: SortableTableData, key: string, fn: any): SortableTableData => {
  const clone = Array.apply(null, data as any);

  return clone.sort((a: any, b: any) => {
    return fn(a[key], b[key]);
  });
};

// get state methods
const nextSortingState = (state: SortingType): SortingType => {
  let next;
  switch (state) {
    case 'both':
      next = 'desc';
      break;
    case 'desc':
      next = 'asc';
      break;
    case 'asc':
      next = 'both';
      break;
  }
  return next as SortingType;
};

export const getInitialSortings = (columns: SortableTableColumn[]): SortingType[] => {
  // console.log('getting initial sortings');
  const sortings = columns.map((column: SortableTableColumn) => {
    let sorting = 'both';
    if (column.defaultSorting) {
      const defaultSorting = column.defaultSorting.toLowerCase();

      if (defaultSorting === 'desc') {
        sorting = 'desc';
      } else if (defaultSorting === 'asc') {
        sorting = 'asc';
      }
    }
    return sorting as SortingType;
  });

  return sortings;
};

const getInitialCheckboxes = (data: SortableTableData, uniqueIdKey: string): SortableCheckboxMap => {
  // console.log('getting initial checkboxes');
  // the reduce function creates a map of ids and a boolean, initially false
  const checkboxes = data.reduce(
    (options: any, option: any) => ({
      ...options,
      [option[uniqueIdKey]]: false
    }),
    {}
  );
  return checkboxes;
};

const getCurrentDataSlice = (data: SortableTableData, activePage: number, rowsPerPage: number): SortableTableData => {
  // console.log('getting data slice. activePage: ' + activePage + ' ,rowsPerPage:' + rowsPerPage);
  const currentDataSlice = data.slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage);
  return currentDataSlice;
};

// const getInitalTableState = (
//   data: SortableTableData,
//   columns: SortableTableColumn[],
//   uniqueIdKey: string
// ): SortableTableState => {
//   // console.log('getting initial table state');
//   return {
//     sortings: getInitialSortings(columns),
//     isAllSelected: false,
//     checkboxes: getInitialCheckboxes(data, uniqueIdKey),
//     filter: ''
//   };
// };

const axiosInstance: AxiosInstance = axios.create({});

// https://stackoverflow.com/questions/53446020/how-to-compare-oldvalues-and-newvalues-on-react-hooks-useeffect
// function usePrevious(value: any) {
//   const ref = useRef();
//   useEffect(() => {
//     ref.current = value;
//   });
//   return ref.current;
// }

// BulmaTable
const BulmaTable = (props: SortableTableProps) => {
  // useWhyDidYouUpdate('BulmaTable', props);
  const {
    columns,
    data,
    setData,
    tableState,
    setTableState,
    pagination = true,
    search = true,
    pageSize = 10,
    baseUrl: initialBaseUrl,
    url: initialUrl,
    sidePagination = 'client',
    sortOrder = 'asc',
    queryParams,
    responseHandler,
    style,
    maxButtons,
    paginationPlacement,
    useGotoField = true,
    alwaysUsePreviousNextButtons = true,
    actionButtons,
    iconStyle,
    iconDesc,
    iconAsc,
    iconBoth
  } = props;

  // unique id column key - default is 'id'
  const [uniqueIdKey, setUniqueIdKey] = useState('id');

  // don't need to initialize the current data chunk since we are running an effect that does the same
  const [currentData, setCurrentData] = useState<SortableTableData>([]);

  // sorted data
  // const [sortedAndFilteredData, setSortedAndFilteredData] = useState<SortableTableData>([]);

  // paging state
  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [numberOfRows, setNumberOfRows] = useState(0);

  // data api for reading data over ODATA
  // instead of using the callback in the data api hook we can use the useEffect hook to monitor the response object
  const [url, setUrl] = useState(initialUrl);
  if (initialBaseUrl) axiosInstance.defaults.baseURL = initialBaseUrl;
  const { response, isLoading, setUrl: fetchData } = useDataApi({
    // isError, error
    axios: axiosInstance
  });

  // useEffect means run on intial rendering and each subsequent change to the dependency array

  useEffect(() => {
    if (columns.length > 0) {
      console.log('useEffect() - initializing uniqueIdColumn');

      // see if one of the columns have specified an unique id key
      const uniqueIdColumn = columns.find(a => a.uniqueId === true);
      if (uniqueIdColumn) {
        setUniqueIdKey(uniqueIdColumn.key);
      }
    }
  }, [columns]);

  const prevUrlRef = useRef<string | undefined>();
  useEffect(() => {
    if (url) {
      console.log('useEffect() - fetching data - checking if we need to do anything ...');

      // inline method to get full url
      const getFullUrl = () => {
        if (sidePagination === 'server') {
          const indexFound = tableState.sortings.findIndex(a => a && a !== 'both');
          const index = indexFound !== -1 ? indexFound : 0; // default to first column
          const sort = columns[index].key;
          const order = indexFound !== -1 ? tableState.sortings[index] : sortOrder; // default to sortOrder
          const params: QueryParams = {
            limit: rowsPerPage,
            offset: (activePage - 1) * rowsPerPage,
            search: tableState.filter,
            sort: sort,
            order: order
          };

          const queryObject = queryParams ? queryParams(params) : params;

          // have to reduce to remove any elements that are undefined
          const queryString = Object.entries(queryObject)
            .reduce(
              (result, pair) => {
                const [key, value] = pair;
                if (value !== undefined && value !== null) {
                  result.push(key + '=' + value);
                }
                return result;
              },
              [] as string[]
            )
            .join('&');
          return `${url}?${queryString}`;
        } else {
          return `${url}`;
        }
      };

      // check if url has changed
      const hasUrlChanged = prevUrlRef.current !== url;
      let fullUrl = '';

      if (sidePagination === 'client') {
        if (!hasUrlChanged) {
          return;
        } else {
          // url has changed
          fullUrl = getFullUrl();
        }
      } else {
        // server pagination
        fullUrl = getFullUrl();
      }

      console.log('useEffect() - fetching data - fetching data using url: ' + fullUrl);
      fetchData(fullUrl);
    }

    prevUrlRef.current = url;
  }, [activePage, columns, rowsPerPage, sidePagination, sortOrder, url, tableState.sortings, tableState.filter]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (response) {
      console.log('useEffect() - handling response');

      let localData = [];
      let localTotalCount = 0;
      if (responseHandler) {
        const { total, rows } = responseHandler(response.data);
        localData = rows;
        localTotalCount = total ? total : rows.length;
      } else {
        localData = response.data.value;
        localTotalCount = response.data.value.length;
      }
      console.log('useEffect() - total count: ' + localTotalCount);
      setNumberOfRows(localTotalCount);

      if (setData) setData(localData);

      // check if we need to change the active page
      const localNumberOfPages = Math.ceil(localTotalCount / rowsPerPage);
      if (activePage > localNumberOfPages) {
        setActivePage(1); // 1 or localNumberOfPages?
      }
    }
  }, [response]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (data.length > 0) {
      console.log('useEffect() - initializing table state for checkboxes');
      setTableState(
        produce((draft: Draft<SortableTableState>) => {
          draft.checkboxes = getInitialCheckboxes(data, uniqueIdKey);
        })
      );
    }
  }, [data, setTableState, uniqueIdKey]);

  useEffect(() => {
    if (data.length > 0 && tableState.sortings.length > 0) {
      if (sidePagination === 'server') {
        console.log('useEffect() - server-side sorting and filtering');
        setCurrentData(data);
      } else {
        console.log('useEffect() - local sorting and filtering');
        const localSortedData = sortData(data, columns, tableState.sortings);

        const localSortedAndFilteredData =
          tableState.filter !== '' ? filterData(localSortedData, columns, tableState.filter) : localSortedData;

        // setSortedAndFilteredData(localSortedAndFilteredData);

        // calculate number of rows from the possisly sorted and filtered data
        setNumberOfRows(localSortedAndFilteredData.length);

        if (localSortedAndFilteredData.length > rowsPerPage) {
          const localDataSlice = getCurrentDataSlice(localSortedAndFilteredData, activePage, rowsPerPage);
          setCurrentData(localDataSlice);
        } else {
          setCurrentData(localSortedAndFilteredData);
        }

        // check if we need to change the active page
        const localNumberOfPages = Math.ceil(localSortedAndFilteredData.length / rowsPerPage);
        if (activePage > localNumberOfPages) {
          setActivePage(1); // 1 or localNumberOfPages?
        }
      }
    }
  }, [activePage, columns, data, rowsPerPage, sidePagination, tableState.sortings, tableState.filter]); // eslint-disable-line react-hooks/exhaustive-deps

  // debug what has changed between renders
  useDependenciesDebugger({ activePage, columns, data, rowsPerPage, sidePagination, sortOrder, url, tableState });

  const handleCheckboxChange = useCallback(
    (changeEvent: ChangeEvent<HTMLInputElement>) => {
      const { name: id } = changeEvent.target;

      if (id === 'checkAll') {
        setTableState(
          produce((draft: Draft<SortableTableState>) => {
            // toggle isAllSelected
            draft.isAllSelected = !draft.isAllSelected;

            // and update all checkboxes
            Object.keys(draft.checkboxes).forEach(id => {
              draft.checkboxes[id] = draft.isAllSelected;
            });
          })
        );
      } else {
        setTableState(
          produce((draft: Draft<SortableTableState>) => {
            // only toggle the given id
            draft.checkboxes[id] = !draft.checkboxes[id];

            // check if all is selected
            draft.isAllSelected = Object.keys(draft.checkboxes).every(id => draft.checkboxes[id]);
          })
        );
      }
    },
    [setTableState]
  );

  const sortableTableHeader = SortableTableHeader({
    columns,
    tableState,
    setTableState,
    iconStyle,
    iconDesc,
    iconAsc,
    iconBoth,
    handleCheckboxChange
  });

  const sortableTableBody = SortableTableBody({
    columns,
    uniqueIdKey,
    data: currentData,
    tableState,
    setTableState,
    setUrl,
    handleCheckboxChange
  });

  const sortableTableTopBar = SortableTableTopBar({
    numberOfRows,
    tableState,
    setTableState,
    search,
    url,
    setUrl,
    actionButtons
  });

  const bulmaPaginator = BulmaPaginator({
    initialPage: activePage,
    setInitialPage: setActivePage,
    numberOfRows,
    rowsPerPage,
    setRowsPerPage,
    maxButtons,
    paginationPlacement,
    useGotoField,
    alwaysUsePreviousNextButtons
  });

  return (
    <>
      {sortableTableTopBar}
      <div className="table-container">
        <table className="table is-bordered is-striped is-hoverable is-fullwidth" style={style}>
          {sortableTableHeader}
          {sortableTableBody}
        </table>
      </div>
      {isLoading ? <div className="is-loading" /> : ''}
      {pagination ? bulmaPaginator : ''}
    </>
  );
};

export default BulmaTable;
