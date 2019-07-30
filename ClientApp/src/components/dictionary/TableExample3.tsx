import React, { useState, useEffect, useMemo } from 'react';
import produce, { Draft } from 'immer';
import { getUniqueData, Data } from './TableExampleData';
import BulmaPaginator from '../shared/bulma-components/BulmaPagination';
import '../shared/bulma-components/bulma-table.scss';
import BulmaTable, {
  SortingType,
  SortableTableColumn,
  SortableCheckboxMap,
  SortableTableData,
  SortableTableState
} from '../shared/bulma-components/BulmaTable';

const getInitialSortings = (columns: SortableTableColumn[]): SortingType[] => {
  console.log('getting initial sortings');
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
  console.log('getting initial checkboxes');
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

const getCurrentDataSlice = (data: SortableTableData, activePage: number, rowsPerPage: number) => {
  console.log('getting data slice. activePage: ' + activePage + ' ,rowsPerPage:' + rowsPerPage);
  const currentDataSlice = data.slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage);
  return currentDataSlice;
};

// render methods must have displayName
const renderIdUrl = (id: string) => {
  return <a href={'user/' + id}>{id}</a>;
};
renderIdUrl.displayName = 'RenderIdUrl';

const columns = [
  {
    header: 'Id',
    key: 'id',
    defaultSorting: 'ASC'
    // headerStyle: { fontSize: '15px', backgroundColor: '#FFDAB9', width: '100px' },
    // dataStyle: { fontSize: '15px', backgroundColor: '#CCCCCC' },
    // dataProps: { className: 'align-right' },
    // render: renderIdUrl
  },
  {
    header: 'Age',
    key: 'age',
    // headerStyle: { fontSize: '20px' },
    sortable: false
  },
  {
    header: 'First Name',
    key: 'firstName'
    // headerStyle: { fontSize: '15px' },
    // headerProps: { className: 'align-left' }
  },
  {
    header: 'Last Name',
    key: 'lastName'
    // headerStyle: { fontSize: '15px' },
    // headerProps: { className: 'align-left' }
  }
];

const style = {
  // backgroundColor: '#eee'
};

const iconStyle = {
  // color: '#aaa',
  // paddingLeft: '5px',
  // paddingRight: '5px'
};

const intialTableState = {
  sortings: getInitialSortings(columns),
  isAllSelected: false,
  checkboxes: {} // if we have the full data avaialale we should set the initial checkboxes here
};

export default function TableExample3() {
  // paging state
  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // data state
  // have to memoize data to avoid triggering the effect all the time since the data object is changing every render
  const data = useMemo(() => getUniqueData(), []);
  const numberOfRows = data.length;

  // don't need to initialize the current data chunk since we are running an effect that does the same
  const [currentData, setCurrentData] = useState<Data[]>([]);

  // table state
  const [tableState, setTableState] = useState<SortableTableState>(intialTableState);

  // this effect will run on intial rendering and each subsequent change to the dependency array
  useEffect(() => {
    console.log(
      'useEffect() being executed - setCurrentData and setTableState. activePage: ' +
        activePage +
        ' ,rowsPerPage: ' +
        rowsPerPage
    );
    const localDataSlice = getCurrentDataSlice(data, activePage, rowsPerPage);
    setCurrentData(localDataSlice);

    setTableState(
      produce((draft: Draft<SortableTableState>) => {
        draft.checkboxes = getInitialCheckboxes(localDataSlice);
      })
    );
  }, [activePage, data, rowsPerPage]);

  const maxButtons = 3;
  const useGotoField = true;
  const paginationPlacement = 'left';

  const bulmaPaginator = BulmaPaginator({
    initialPage: activePage,
    setInitialPage: setActivePage,
    numberOfRows,
    rowsPerPage,
    setRowsPerPage,
    maxButtons,
    paginationPlacement,
    useGotoField
  });

  const bulmaTable = BulmaTable({
    columns,
    data: currentData,
    tableState,
    setTableState,
    style,
    iconStyle
  });

  return (
    <>
      {bulmaTable}
      {bulmaPaginator}
    </>
  );
}
