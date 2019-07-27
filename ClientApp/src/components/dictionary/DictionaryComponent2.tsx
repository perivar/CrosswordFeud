import React, { useEffect, useState, useMemo } from 'react';
// import usePagination from '../shared/hooks/pagination-hook';
// import Pagination from '../shared/hooks/paginator';

import './bulma-table.scss';
import BulmaPaginator, { PaginationPlacement } from './BulmaPagination';

const range = (from: number, to: number, step = 1) => {
  let i = from;
  const pool = [];

  while (i <= to) {
    pool.push(i);
    i += step;
  }

  return pool;
};

export default function DictionaryComponent2() {
  const [initialPage, setInitialPage] = useState(1);
  const [maxButtons, setMaxButtons] = useState(5);
  const [numberOfRows, setNumberOfRows] = useState(1000);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const numberOfPages = Math.ceil(numberOfRows / rowsPerPage);

  const [data, setData] = useState<number[]>([]);
  const [currentData, setCurrentData] = useState<number[]>([]);

  useEffect(() => {
    let pages: number[] = range(1, numberOfRows);
    setData(pages);
  }, [numberOfRows]);

  useEffect(() => {
    setCurrentData(data.slice(initialPage * rowsPerPage, initialPage * rowsPerPage + rowsPerPage));
  }, [data, initialPage, rowsPerPage]);

  useEffect(() => {
    if (initialPage > numberOfPages) {
      setInitialPage(numberOfPages);
    }
  }, [initialPage, numberOfPages]);

  useEffect(() => {
    if (maxButtons > numberOfPages) {
      setMaxButtons(numberOfPages);
    }
  }, [maxButtons, numberOfPages]);

  const paginationPlacement: PaginationPlacement = 'left';
  const useGotoField = true;
  const bulmaPaginator = BulmaPaginator({
    initialPage,
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
        <h1>react-pagination-hook demo</h1>
        <div>
          <div>Initial page:</div>
          <div>
            <input
              type="range"
              value={initialPage}
              min={1}
              max={numberOfPages}
              onChange={event => setInitialPage(Number(event.target.value))}
            />
            {initialPage}
          </div>
        </div>
        <div>
          <div>Number of rows:</div>
          <div>
            <input
              type="range"
              value={numberOfRows}
              min={1}
              max={10000}
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
      </div>
      <div>
        <ul>
          {currentData.map((data, index) => (
            <li key={index}>{data}</li>
          ))}
        </ul>
      </div>
      {bulmaPaginator}
    </>
  );
  // const pageLimit = 10;

  // const [offset, setOffset] = useState(0);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [data, setData] = useState<number[]>([]);
  // const [currentData, setCurrentData] = useState<number[]>([]);

  // useEffect(() => {
  //   setData(pages);
  // }, [pages]);

  // useEffect(() => {
  //   setCurrentData(data.slice(offset, offset + pageLimit));
  // }, [data, offset]);

  // return (
  //   <div>
  //     <ul>
  //       {currentData.map((data, index) => (
  //         <li key={index}>{data}</li>
  //       ))}
  //     </ul>
  //     <Pagination
  //       totalRecords={data.length}
  //       pageLimit={pageLimit}
  //       pageNeighbours={2}
  //       setOffset={setOffset}
  //       currentPage={currentPage}
  //       setCurrentPage={setCurrentPage}
  //     />
  //   </div>
  // );

  // const pagination = usePagination({
  //   items: pages,
  //   itemsPerPage: 20
  // });

  // const {
  //   onNextPage,
  //   onPreviousPage,
  //   onResetPage,
  //   setCurrentPage,
  //   dispatch,
  //   currentItems,
  //   currentPage,
  //   hasNextPage,
  //   hasPreviousPage,
  //   items,
  //   itemsPerPage,
  //   maxPages,
  //   nextPage,
  //   previousPage
  // } = pagination;

  // const handleOnKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === 'Enter') {
  //     setCurrentPage(e.currentTarget.value);
  //   }
  // };

  // const handleOnBlur = (e: ChangeEvent<HTMLInputElement>) => {
  //   // event.persist(); // this stores parameters like id and value inside the event.target
  //   setCurrentPage(e.target.value);
  // };

  // return (
  //   <>
  //     <pre>{JSON.stringify(currentItems, null, 2)}</pre>
  //     <button onClick={onResetPage}>Reset</button>

  //     <div className="level">
  //       <div className="level-left">
  //         <div className="level-item">Showing 661621 to 661640 of 661767 rows.</div>
  //       </div>
  //       <div className="level-right">
  //         <nav className="pagination" role="navigation" aria-label="pagination">
  //           <ul className="pagination-list">
  //             <li>
  //               <button
  //                 className="pagination-previous pagination-button"
  //                 aria-label="Previous"
  //                 onClick={onPreviousPage}
  //                 disabled={hasPreviousPage ? false : true}>
  //                 &laquo; Previous
  //               </button>
  //             </li>
  //             <li>
  //               <button className="pagination-link pagination-button" aria-label="Goto page 1">
  //                 1
  //               </button>
  //             </li>
  //             <li>
  //               <span className="pagination-ellipsis">&hellip;</span>
  //             </li>
  //             <li>
  //               <button className="pagination-link pagination-button" aria-label="Goto page 33081">
  //                 33081
  //               </button>
  //             </li>
  //             <li>
  //               {/* <button
  //                 className="pagination-link pagination-button is-current"
  //                 aria-label="Page 33082"
  //                 aria-current="page">
  //                 33082
  //               </button> */}

  //               <div className="field">
  //                 <p className="control has-icons-right">
  //                   <input
  //                     className="input is-focused"
  //                     type="text"
  //                     placeholder="33082"
  //                     style={{ width: '6rem' }}
  //                     onBlur={handleOnBlur}
  //                     onKeyPress={handleOnKeyPress}
  //                   />
  //                   <span className="icon is-small is-right">
  //                     <i className="fas fa-search"></i>
  //                   </span>
  //                 </p>
  //               </div>
  //             </li>
  //             <li>
  //               <button className="pagination-link pagination-button" aria-label="Goto page 33083">
  //                 33083
  //               </button>
  //             </li>
  //             <li>
  //               <span className="pagination-ellipsis">&hellip;</span>
  //             </li>
  //             <li>
  //               <button className="pagination-link pagination-button" aria-label="Goto page 33089">
  //                 33089
  //               </button>
  //             </li>
  //             <li>
  //               <button
  //                 className="pagination-next pagination-button"
  //                 aria-label="Next"
  //                 onClick={onNextPage}
  //                 disabled={hasNextPage ? false : true}>
  //                 Next &raquo;
  //               </button>
  //             </li>
  //           </ul>
  //         </nav>
  //       </div>
  //     </div>
  //     <div className="level">
  //       <div className="level-left">
  //         <div className="level-item">
  //           <div className="select">
  //             <select name="rowsPerPage" id="rowsPerPage" aria-label="Rows per page">
  //               <option value="10">10</option>
  //               <option value="15">15</option>
  //               <option value="20">20</option>
  //             </select>
  //           </div>
  //         </div>
  //         <div className="level-item">rows per page</div>
  //       </div>
  //     </div>
  //   </>
  // );
}
