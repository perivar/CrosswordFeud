import React, { useState, useEffect, useMemo } from 'react';
import SortableTable from './sortable-table';
import { getUniqueData, Data } from './TableExampleData';
import BulmaPaginator from '../shared/bulma-components/BulmaPagination';
import '../shared/bulma-components/bulma-table.scss';

export default function TableExample2() {
  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // data state
  const data = useMemo(() => getUniqueData(), []);
  const numberOfRows = data.length;
  const [currentData, setCurrentData] = useState<Data[]>(
    data.slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage)
  );

  const maxButtons = 3;
  const useGotoField = true;
  const paginationPlacement = 'left';

  useEffect(() => {
    setCurrentData(data.slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage));
  }, [data, activePage, rowsPerPage]);

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

  const columns = [
    {
      header: 'Id',
      key: 'id',
      defaultSorting: 'ASC'
      // headerStyle: { fontSize: '15px', backgroundColor: '#FFDAB9', width: '100px' },
      // dataStyle: { fontSize: '15px', backgroundColor: '#FFDAB9' },
      // dataProps: { className: 'align-right' },
      // render: (id: string) => {
      // return <a href={'user/' + id}>{id}</a>;
      // }
    },
    {
      header: 'Age',
      key: 'age',
      // headerStyle: { fontSize: '15px' },
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
    paddingLeft: '5px',
    paddingRight: '5px'
  };

  return (
    <>
      <SortableTable data={currentData} columns={columns} style={style} iconStyle={iconStyle} />
      {bulmaPaginator}
    </>
  );
}
