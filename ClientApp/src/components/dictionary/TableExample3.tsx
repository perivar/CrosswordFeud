import React, { useState, useMemo } from 'react';
import { getUniqueData, Data } from './TableExampleData';
import BulmaPaginator from '../shared/bulma-components/BulmaPagination';
import '../shared/bulma-components/bulma-table.scss';
import SortableTable, { SortableTableState, SortableTableData } from '../shared/bulma-components/BulmaTable';

// render methods must have displayName
const renderIdUrl = (id: string) => {
  return <a href={'user/' + id}>{id}</a>;
};
renderIdUrl.displayName = 'RenderIdUrl';

const columns = [
  {
    header: 'Id',
    key: 'id'
    // defaultSorting: 'ASC'
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
    key: 'firstName',
    defaultSorting: 'ASC'
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

// initial table state
const intialState: SortableTableState = {
  sortings: [],
  isAllSelected: false,
  checkboxes: {}
};

export default function TableExample3() {
  // paging state
  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // data state
  // have to memoize data to avoid triggering the effect all the time since the data object is changing every render
  // const data = useMemo(() => getUniqueData(), []);
  const [data, setData] = useState<Data[]>(() => getUniqueData());
  const numberOfRows = data.length;

  const [tableState, setTableState] = useState<SortableTableState>(intialState);

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

  const bulmaTable = SortableTable({
    columns,
    data,
    activePage,
    rowsPerPage,
    tableState,
    setTableState,
    style,
    iconStyle
  });

  const searchFieldInput: React.RefObject<HTMLInputElement> = React.createRef();

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const keyCode = e.keyCode || e.which;

    if (keyCode === 13) {
      e.preventDefault();
      doSearch();
    }
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    doSearch();
  };

  const handleClickDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {};
  const handleClickDisconnect = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {};

  const doSearch = () => {
    if (searchFieldInput && searchFieldInput.current) {
      const searchQuery = searchFieldInput.current.value;

      // https://dev.to/iam_timsmith/lets-build-a-search-bar-in-react-120j
      // Variable to hold the original version of the list
      let currentList = [];

      // Variable to hold the filtered list before putting into state
      let newList = [];

      // If the search bar isn't empty
      if (searchQuery !== '') {
        // Assign the original list to currentList
        currentList = data;

        // Use .filter() to determine which items should be displayed
        // based on the search terms
        newList = currentList.filter(item => {
          // change current item to lowercase
          const lc = item.lastName.toLowerCase();

          // change search term to lowercase
          const filter = searchQuery.toLowerCase();

          // check to see if the current list item includes the search term
          // If it does, it will be added to newList. Using lowercase eliminates
          // issues with capitalization in search terms and search content
          return lc.includes(filter);
        });
      } else {
        // If the search bar is empty, set newList to original task list
        newList = getUniqueData();
      }

      // Set the filtered state based on what our rules added to newList
      setData(newList);
    }
  };

  return (
    <>
      <nav className="level">
        <div className="level-left">
          <p className="level-item">
            <button type="button" className="button is-danger" disabled aria-label="Delete" onClick={handleClickDelete}>
              Delete
            </button>
          </p>
          <p className="level-item">
            <button
              type="button"
              className="button is-warning"
              disabled
              aria-label="Disconnect"
              onClick={handleClickDisconnect}>
              Disconnect
            </button>
          </p>
        </div>

        <div className="level-right">
          <div className="level-item">
            <p className="subtitle is-6">
              <strong>{numberOfRows}</strong> elements
            </p>
          </div>
          <div className="level-item">
            <form onSubmit={handleSearchSubmit}>
              <div className="field has-addons">
                <p className="control">
                  <input
                    ref={searchFieldInput}
                    className="input"
                    type="text"
                    placeholder="Find in table"
                    onKeyPress={handleSearchKeyPress}
                  />
                </p>
                <p className="control">
                  <button type="submit" className="button">
                    Search
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </nav>

      {bulmaTable}
      {bulmaPaginator}
    </>
  );
}
