import React, { useState, useMemo } from 'react';
import { getUniqueData } from './TableExampleData';
import BulmaPaginator from '../shared/bulma-components/BulmaPagination';
import '../shared/bulma-components/bulma-table.scss';
import SortableTable, { SortableTableState } from '../shared/bulma-components/BulmaTable';

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
  const data = useMemo(() => getUniqueData(), []);
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
