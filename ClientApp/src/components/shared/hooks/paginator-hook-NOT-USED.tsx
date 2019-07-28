import React, { useState, useCallback, useEffect, useRef } from 'react';
// import PropTypes from 'prop-types';
// import './style/main.scss';

const LEFT_PAGE = 'LEFT';
const RIGHT_PAGE = 'RIGHT';

/**
 * Helper method for creating a range of numbers
 * range(1, 5) => [1, 2, 3, 4, 5]
 */
const range = (from: number, to: number, step = 1) => {
  let i = from;
  const pool = [];

  while (i <= to) {
    pool.push(i);
    i += step;
  }

  return pool;
};

interface IPaginatorProps {
  totalRecords: number;
  pageLimit: number;
  pageNeighbours: number;
  setOffset: Function;
  currentPage: number;
  setCurrentPage: Function;

  pageActiveClass?: string;
  pageNextText?: string | object;
  pagePrevText?: string | object;
  pageContainerClass?: string;
  pageItemClass?: string;
  pageLinkClass?: string;
}

function Paginator({
  totalRecords = 0,
  pageLimit = 20,
  pageNeighbours = 0,
  setOffset,
  currentPage,
  setCurrentPage,
  pageContainerClass = 'pagination-list',
  pageActiveClass = 'is-current',
  pageItemClass = 'empty',
  pageLinkClass = 'pagination-link pagination-button',
  pageNextText = 'Next »',
  pagePrevText = '« Prev'
}: IPaginatorProps) {
  const init = () => {
    pageLimit = typeof pageLimit === 'number' ? pageLimit : 20;
    totalRecords = typeof totalRecords === 'number' ? totalRecords : 0;

    // pageNeighbours can be: 0, 1 or 2
    pageNeighbours = typeof pageNeighbours === 'number' ? Math.max(0, Math.min(pageNeighbours, 2)) : 0;

    const totalPages = Math.ceil(totalRecords / pageLimit);

    return {
      pageLimit,
      totalRecords,
      pageNeighbours,
      totalPages
    };
  };

  const [state, setState] = useState(() => init());
  const firstRun = useRef(true);

  const gotoPage = useCallback(
    page => {
      const currentPage = Math.max(1, Math.min(page, state.totalPages));
      setCurrentPage(currentPage);
    },
    [setCurrentPage, state.totalPages]
  );

  useEffect(() => {
    gotoPage(1);
  }, [gotoPage]);

  useEffect(() => {
    setOffset((currentPage - 1) * pageLimit);
  }, [currentPage, pageLimit, setOffset]);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const totalPages = Math.ceil(totalRecords! / state.pageLimit);

    // setState({ ...state, totalRecords, totalPages });
    setState(prevState => {
      return { ...prevState, totalRecords, totalPages };
    });
  }, [state.pageLimit, totalRecords]);

  const handleClick = (page: string | number, evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    evt.preventDefault();
    gotoPage(page);
  };

  const handleMoveLeft = useCallback(
    evt => {
      evt.preventDefault();
      gotoPage(currentPage - state.pageNeighbours * 2 - 1);
    },
    [currentPage, gotoPage, state.pageNeighbours]
  );

  const handleMoveRight = useCallback(
    evt => {
      evt.preventDefault();
      gotoPage(currentPage + state.pageNeighbours * 2 + 1);
    },
    [currentPage, gotoPage, state.pageNeighbours]
  );

  /**
   * Let's say we have 10 pages and we set pageNeighbours to 2
   * Given that the current page is 6
   * The pagination control will look like the following:
   *
   * (1) < {4 5} [6] {7 8} > (10)
   *
   * (x) => terminal pages: first and last page(always visible)
   * [x] => represents current page
   * {...x} => represents page neighbours
   */
  const fetchPageNumbers = useCallback(() => {
    const totalPages = state.totalPages;
    const pageNeighbours = state.pageNeighbours; // Pages between first and middle block

    /**
     * totalNumbers: the total page numbers to show on the control
     * totalBlocks: totalNumbers + 2 to cover for the left(<) and right(>) controls
     */
    const totalNumbers = state.pageNeighbours * 2 + 3; // Neigbours on both sides including first, middle and last
    const totalBlocks = totalNumbers + 2; // including left and right buttons

    if (totalPages > totalBlocks) {
      let pages = [];

      const leftBound = currentPage - pageNeighbours;
      const rightBound = currentPage + pageNeighbours;
      const beforeLastPage = totalPages - 1;

      const startPage = leftBound > 2 ? leftBound : 2;
      const endPage = rightBound < beforeLastPage ? rightBound : beforeLastPage;

      pages = range(startPage, endPage);

      /**
       * hasLeftSpill: has hidden pages to the left
       * hasRightSpill: has hidden pages to the right
       * spillOffset: number of hidden pages either to the left or to the right
       */
      const hasLeftSpill = startPage > 2;
      const hasRightSpill = endPage < beforeLastPage;
      const pagesCount = pages.length;
      const singleSpillOffset = totalNumbers - pagesCount - 1;

      // handle: (1) < {5 6} [7] {8 9} (10)
      if (hasLeftSpill && !hasRightSpill) {
        const extraPages = range(startPage - singleSpillOffset, startPage - 1);
        pages = [LEFT_PAGE, ...extraPages, ...pages];

        // handle: (1) {2 3} [4] {5 6} > (10)
      } else if (!hasLeftSpill && hasRightSpill) {
        const extraPages = range(endPage + 1, endPage + singleSpillOffset);
        pages = [...pages, ...extraPages, RIGHT_PAGE];

        // handle: (1) < {4 5} [6] {7 8} > (10)
      } else if (hasLeftSpill && hasRightSpill) {
        pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
      }

      return [1, ...pages, totalPages];
    }

    return range(1, totalPages);
  }, [currentPage, state.pageNeighbours, state.totalPages]);

  if (!state.totalRecords || state.totalPages === 1) return null;

  const pages = fetchPageNumbers();

  return (
    <nav className="pagination" role="navigation" aria-label="pagination">
      <ul className={pageContainerClass}>
        {pages.map((page, index) => {
          if (page === LEFT_PAGE)
            return (
              <li className={pageItemClass} key={index}>
                <button type="button" className={pageLinkClass} onClick={handleMoveLeft}>
                  {pagePrevText}
                </button>
              </li>
            );

          if (page === RIGHT_PAGE)
            return (
              <li className={pageItemClass} key={index}>
                <button type="button" className={pageLinkClass} onClick={handleMoveRight}>
                  {pageNextText}
                </button>
              </li>
            );

          return (
            <li className={`${pageItemClass}`} key={index}>
              <button
                type="button"
                className={`${pageLinkClass} ${currentPage === page ? pageActiveClass : null}`}
                onClick={e => handleClick(page, e)}>
                {page}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// Paginator.defaultProps = {
//   pageContainerClass: 'pagination',
//   pageActiveClass: 'active',
//   pageItemClass: 'page-item',
//   pageLinkClass: 'page-link',
//   pageNextText: 'Next »',
//   pagePrevText: '« Prev'
// };

// Paginator.propTypes = {
//   currentPage: PropTypes.number,
//   pageActiveClass: PropTypes.string,
//   pageNextText: PropTypes.oneOf([PropTypes.string, PropTypes.node]),
//   pagePrevText: PropTypes.oneOf([PropTypes.string, PropTypes.node]),
//   pageContainerClass: PropTypes.string,
//   pageItemClass: PropTypes.string,
//   pageLimit: PropTypes.number,
//   pageLinkClass: PropTypes.string,
//   pageNeighbours: PropTypes.number,
//   setCurrentPage: PropTypes.func,
//   setOffset: PropTypes.func,
//   totalRecords: PropTypes.number.isRequired
// };

export default Paginator;
