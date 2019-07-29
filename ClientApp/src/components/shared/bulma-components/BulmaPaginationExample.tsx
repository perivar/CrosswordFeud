import React, { useEffect, useState } from 'react';
import BulmaPaginator, { PaginationPlacement } from './BulmaPagination';
import useRadioButtons from '../hooks/radio-buttons-hook';
import './bulma-table.scss';

const range = (from: number, to: number, step = 1) => {
  let i = from;
  const pool = [];

  while (i <= to) {
    pool.push(i);
    i += step;
  }

  return pool;
};

export default function BulmaPaginationExample() {
  const [activePage, setActivePage] = useState(1);
  const [numberOfRows, setNumberOfRows] = useState(35);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [maxButtons, setMaxButtons] = useState(5);
  const [useGotoField, setUseGotoField] = useState<boolean>(false);

  // use radio button hook
  const { value: paginationPlacement, inputProps: paginationPlacementProps } = useRadioButtons<PaginationPlacement>(
    'paginationPlacement',
    'left'
  );

  // data state
  const [data, setData] = useState<number[]>([]);
  const [currentData, setCurrentData] = useState<number[]>([]);

  const numberOfPages = Math.ceil(numberOfRows / rowsPerPage);

  useEffect(() => {
    const pages: number[] = range(1, numberOfRows);
    setData(pages);
  }, [numberOfRows]);

  useEffect(() => {
    setCurrentData(data.slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage));
  }, [data, activePage, rowsPerPage]);

  useEffect(() => {
    if (activePage > numberOfPages) {
      setActivePage(numberOfPages);
    }
  }, [activePage, numberOfPages]);

  useEffect(() => {
    if (maxButtons > numberOfPages) {
      setMaxButtons(numberOfPages);
    }
  }, [maxButtons, numberOfPages]);

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

  return (
    <>
      <div className="container box">
        <h1>BulmaPagination and react-pagination-hook demo</h1>
        <div>
          <div>Active page:</div>
          <div>
            <input
              type="range"
              value={activePage}
              min={1}
              max={numberOfPages}
              onChange={event => setActivePage(Number(event.target.value))}
            />
            {activePage}
          </div>
        </div>
        <div>
          <div>Number of rows:</div>
          <div>
            <input
              type="range"
              value={numberOfRows}
              min={1}
              max={200}
              onChange={event => setNumberOfRows(Number(event.target.value))}
            />
            {numberOfRows}
          </div>
        </div>
        <div>
          <div>Rows per page:</div>
          <div>
            <input
              type="range"
              value={rowsPerPage}
              min={1}
              max={100}
              onChange={event => setRowsPerPage(Number(event.target.value))}
            />
            {rowsPerPage}
          </div>
        </div>
        <div>
          <div>Max buttons:</div>
          <div>
            <input
              type="range"
              value={maxButtons}
              min={1}
              max={10}
              onChange={event => setMaxButtons(Number(event.target.value))}
            />
            {maxButtons}
          </div>
        </div>
        <div>
          <div>Use Goto-field:</div>
          <div>
            <input type="checkbox" checked={useGotoField} onChange={() => setUseGotoField(!useGotoField)} />
            {useGotoField}
          </div>
        </div>
        <div>
          <div>Pagination placement:</div>
          <div>
            <input value="left" checked={paginationPlacement === 'left'} {...paginationPlacementProps} />
            Left
            <input value="right" checked={paginationPlacement === 'right'} {...paginationPlacementProps} />
            Right
            <input value="centered" checked={paginationPlacement === 'centered'} {...paginationPlacementProps} />
            Centered
            <input value="inline" checked={paginationPlacement === 'inline'} {...paginationPlacementProps} />
            Inline
          </div>
        </div>
      </div>
      <div>
        <ul>
          {currentData.map(dataEntry => (
            <li key={dataEntry.toString()}>{dataEntry}</li>
          ))}
        </ul>
      </div>
      {bulmaPaginator}
    </>
  );
}
