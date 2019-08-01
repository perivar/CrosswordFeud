import React, {
  Dispatch,
  SetStateAction,
  ChangeEvent,
  CSSProperties,
  HTMLAttributes,
  useCallback,
  useState,
  useEffect
} from 'react';
import './bulma-table.scss';
import produce, { Draft } from 'immer';
import { BulmaCheckboxField } from './BulmaCheckboxField';
// import { useWhyDidYouUpdate } from '../hooks/why-did-you-update-hook';
import BulmaPaginator, { PaginationPlacement } from './BulmaPagination';
import { BulmaSearchField } from './BulmaSearchField';

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
  defaultSorting?: string; // ASC or asc or DESC or desc
  headerStyle?: CSSProperties; // { fontSize: '15px', backgroundColor: '#FFDAB9', width: '100px' },
  headerProps?: HTMLAttributes<HTMLElement>; // { className: 'align-left' },
  dataStyle?: CSSProperties; // { fontSize: '15px', backgroundColor: '#FFDAB9' },
  dataProps?: HTMLAttributes<HTMLElement>; // { className: 'align-right' },
  sortable?: boolean;
  searchable?: boolean;
  render?: (id: string) => JSX.Element;
  descSortFunction?: (sortedData: SortableTableData, key: string) => SortableTableData;
  ascSortFunction?: (sortedData: SortableTableData, key: string) => SortableTableData;
}

export interface SortableTableIconInfo {
  iconStyle?: CSSProperties;
  iconDesc?: JSX.Element;
  iconAsc?: JSX.Element;
  iconBoth?: JSX.Element;
}

export interface SortableTableProps extends SortableTableIconInfo {
  columns: SortableTableColumn[];
  data: SortableTableData;
  tableState: SortableTableState;
  setTableState: Dispatch<SetStateAction<SortableTableState>>;
  style?: CSSProperties;
  maxButtons?: number;
  paginationPlacement?: PaginationPlacement;
  useGotoField?: boolean;
  alwaysUsePreviousNextButtons?: boolean;
  actionButtons?: React.ReactNode[];
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
  // tableState: SortableTableState;
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
          <span className="icon has-text-grey-light" style={iconStyle}>
            <i className="fas fa-sort-up" />
          </span>
        );
      }
    } else if (sorting === 'asc') {
      if (iconAsc) {
        sortIcon = iconAsc;
      } else {
        sortIcon = (
          <span className="icon has-text-grey-light" style={iconStyle}>
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

interface SortableTableRowProps {
  data: SortableTableData;
  columns: SortableTableColumn[];
  isSelected: boolean;
  handleCheckboxChange: (changeEvent: ChangeEvent<HTMLInputElement>) => void;
}

// SortableTableRow
const SortableTableRow = (props: SortableTableRowProps) => {
  // useWhyDidYouUpdate('SortableTableRow', props);
  const { data, columns, isSelected, handleCheckboxChange } = props;
  console.log(`render row :: ${data.id}`);

  const tds = columns.map((column: SortableTableColumn) => {
    let value = data[column.key];
    if (column.render) {
      value = column.render(value);
    }
    return (
      <td key={`row-${data.id}-${column.key}`} style={column.dataStyle} {...(column.dataProps || {})}>
        {value}
      </td>
    );
  });

  const checkbox = (
    <td key={`row-${data.id}-select`}>
      <BulmaCheckboxField
        label=""
        name={`${data.id}`}
        checked={isSelected}
        handleChange={handleCheckboxChange}
        checkboxProps={{ 'aria-label': `${isSelected ? 'Un-select' : 'Select'} row with id: ${data.id}` }}
      />
    </td>
  );

  return (
    <tr key={`row-${data.id}`} className={isSelected ? 'is-selected' : ''}>
      {checkbox}
      {tds}
    </tr>
  );
};

interface SortableTableBodyProps {
  columns: SortableTableColumn[];
  data: SortableTableData;
  tableState: SortableTableState;
  // setTableState: Dispatch<SetStateAction<SortableTableState>>;
  handleCheckboxChange: (changeEvent: ChangeEvent<HTMLInputElement>) => void;
}

// make sure to memoize the rows to avoid re-renders
const MemoizedSortableTableRow = React.memo(SortableTableRow);

// SortableTableBody
const SortableTableBody = (props: SortableTableBodyProps) => {
  // useWhyDidYouUpdate('SortableTableBody', props);
  const { columns, data, tableState, handleCheckboxChange } = props;
  const bodies = data.map((row: any) => {
    const sortableTableRow = (
      <MemoizedSortableTableRow
        key={`row-${row.id}`}
        data={row}
        columns={columns}
        isSelected={tableState.checkboxes[row.id]}
        handleCheckboxChange={handleCheckboxChange}
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

export const SortableActionButton = (props: SortableActionButtonProps) => {
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

interface SortableTableSearchBarProps {
  numberOfRows: number;
  setTableState: Dispatch<SetStateAction<SortableTableState>>;
  actionButtons?: React.ReactNode[];
}

// SortableTableSearchBar
const SortableTableSearchBar = (props: SortableTableSearchBarProps) => {
  const { numberOfRows, setTableState, actionButtons } = props;

  const handleSearchSubmit = (filterQuery: string) => {
    setTableState(
      produce((draft: Draft<SortableTableState>) => {
        draft.filter = filterQuery;
      })
    );
  };

  return (
    <nav className="level">
      <div className="level-left">
        {actionButtons &&
          actionButtons.map((button: any) => (
            <p key={button.key} className="level-item">
              {button}
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
          <BulmaSearchField type="addon" label="Search" placeholder="Find in table" handleSubmit={handleSearchSubmit} />
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

const getInitialSortings = (columns: SortableTableColumn[]): SortingType[] => {
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

const getInitialCheckboxes = (data: SortableTableData): SortableCheckboxMap => {
  // console.log('getting initial checkboxes');
  // the reduce function creates a map of ids and a boolean, initially false
  const checkboxes = data.reduce(
    (options: any, option: any) => ({
      ...options,
      [option.id]: false
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

const getInitalTableState = (data: SortableTableData, columns: SortableTableColumn[]): SortableTableState => {
  // console.log('getting initial table state');
  return {
    sortings: getInitialSortings(columns),
    isAllSelected: false,
    checkboxes: getInitialCheckboxes(data),
    filter: ''
  };
};

// BulmaTable
const BulmaTable = (props: SortableTableProps) => {
  // useWhyDidYouUpdate('BulmaTable', props);
  const {
    columns,
    data,
    tableState,
    setTableState,
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

  // don't need to initialize the current data chunk since we are running an effect that does the same
  const [currentData, setCurrentData] = useState<SortableTableData>([]);

  // sorted data
  const [sortedAndFilteredData, setSortedAndFilteredData] = useState<SortableTableData>([]);

  // paging state
  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    console.log('useEffect() being executed (initializing table state)');
    setTableState(getInitalTableState(data, columns));
  }, [columns, data, setTableState]);

  // this effect will run on intial rendering and each subsequent change to the dependency array
  useEffect(() => {
    if (tableState.sortings.length > 0) {
      console.log('useEffect() being executed (sorting and filtering)');
      const localSortedData = sortData(data, columns, tableState.sortings);

      const localSortedAndFilteredData =
        tableState.filter !== '' ? filterData(localSortedData, columns, tableState.filter) : localSortedData;

      setSortedAndFilteredData(localSortedAndFilteredData);

      if (localSortedAndFilteredData.length > rowsPerPage) {
        const localDataSlice = getCurrentDataSlice(localSortedAndFilteredData, activePage, rowsPerPage);
        setCurrentData(localDataSlice);
      } else {
        setCurrentData(localSortedAndFilteredData);
      }

      // check if we need to change the active page
      const localNumberOfPages = Math.ceil(localSortedAndFilteredData.length / rowsPerPage);
      if (activePage > localNumberOfPages) {
        setActivePage(localNumberOfPages); // 1 or localNumberOfPages?
      }
    }
  }, [activePage, columns, data, rowsPerPage, tableState.filter, tableState.sortings]);

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

  // calculate number of rows from the posisbly sorted and filtered data
  const numberOfRows = sortedAndFilteredData.length;

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
    data: currentData,
    tableState,
    handleCheckboxChange
  });

  const sortableTableSearchBar = SortableTableSearchBar({
    numberOfRows,
    setTableState,
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
      {sortableTableSearchBar}
      <div className="table-container">
        <table className="table is-bordered is-striped is-hoverable is-fullwidth" style={style}>
          {sortableTableHeader}
          {sortableTableBody}
        </table>
      </div>
      {bulmaPaginator}
    </>
  );
};

export default BulmaTable;
