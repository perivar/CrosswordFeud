import React, { useEffect } from 'react';
import { usePagination } from '../hooks/react-pagination-hook';
import { useWhyDidYouUpdate } from '../hooks/why-did-you-update-hook';

export type PaginationPlacement = 'inline' | 'centered' | 'left' | 'right';

export interface IBulmaPaginatorProps {
  initialPage: number;
  setInitialPage?: Function;
  numberOfRows: number;
  rowsPerPage?: number;
  setRowsPerPage?: Function;
  maxButtons?: number;
  paginationPlacement?: PaginationPlacement;
  useGotoField?: boolean;
}

const getPaginationClassName = (paginationPlacement: string) => {
  switch (paginationPlacement) {
    case 'right':
      return 'is-right';
    case 'centered':
    case 'inline':
      return 'is-centered';
    case 'left':
    default:
      return '';
  }
};

const BulmaPaginator = (props: IBulmaPaginatorProps) => {
  useWhyDidYouUpdate('BulmaPaginator', props);
  const {
    initialPage = 1,
    setInitialPage = () => {},
    numberOfRows,
    rowsPerPage = 10,
    setRowsPerPage = () => {},
    maxButtons = 5,
    paginationPlacement = 'inline',
    useGotoField = false
  } = props;
  const numberOfPages = Math.ceil(numberOfRows / rowsPerPage);
  const { activePage, visiblePieces, goToPage } = usePagination({ initialPage, numberOfPages, maxButtons });

  const gotoFieldInput: React.RefObject<HTMLInputElement> = React.createRef();

  // subscribe to any changes to initialPage
  useEffect(() => {
    goToPage(initialPage);
  }, [goToPage, initialPage]);

  const handleClick = (pageNumber: number, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setInitialPage(pageNumber);
  };

  const handleRowsPerPageChange = (e: React.FocusEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
  };

  const handleGotoKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const keyCode = e.keyCode || e.which;

    if (keyCode === 13) {
      e.preventDefault();
      handleGotoNewpage();
    } else {
      const isNumber = /^[0-9\b]+$/.test(e.key);
      if (!isNumber) e.preventDefault();
    }
  };

  const handleGotoSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleGotoNewpage();
  };

  const handleGotoNewpage = () => {
    if (gotoFieldInput && gotoFieldInput.current) {
      let pageNumber = Number(gotoFieldInput.current.value);
      if (pageNumber > numberOfPages) pageNumber = numberOfPages;
      if (pageNumber <= 0) pageNumber = 1;
      gotoFieldInput.current.value = '';
      setInitialPage(pageNumber);
    }
  };

  const previousButton = (visiblePiece: any) => {
    if (visiblePiece) {
      const { pageNumber } = visiblePiece;
      return (
        <button
          type="button"
          className="pagination-previous pagination-button"
          aria-label="Previous"
          onClick={event => handleClick(pageNumber, event)}
          disabled={visiblePiece.isDisabled}>
          &laquo; Previous
        </button>
      );
    }
    return '';
  };

  const nextButton = (visiblePiece: any) => {
    if (visiblePiece) {
      const { pageNumber } = visiblePiece;
      return (
        <button
          type="button"
          className="pagination-next pagination-button"
          aria-label="Next"
          onClick={event => handleClick(pageNumber, event)}
          disabled={visiblePiece.isDisabled}>
          Next &raquo;
        </button>
      );
    }
    return '';
  };

  const previous = visiblePieces.find(e => e.type === 'previous');
  const next = visiblePieces.find(e => e.type === 'next');

  const paginationClassName = getPaginationClassName(paginationPlacement);

  // calculate showing from x to y of total
  const fromRow = (activePage - 1) * rowsPerPage + 1;
  const toRow = Math.min(activePage * rowsPerPage, numberOfRows);

  return (
    <>
      <nav className={`pagination ${paginationClassName}`} role="navigation" aria-label="pagination">
        {paginationPlacement !== 'inline' ? previousButton(previous) : ''}
        {paginationPlacement !== 'inline' ? nextButton(next) : ''}
        <ul className="pagination-list">
          {visiblePieces.map((visiblePiece, index) => {
            const key = `${visiblePiece.type}-${index}`;

            if (visiblePiece.type === 'ellipsis') {
              return (
                <li key={key}>
                  <span className="pagination-ellipsis">&hellip;</span>
                </li>
              );
            }

            const { pageNumber } = visiblePiece;
            if (visiblePiece.type === 'page-number') {
              const iActive = pageNumber === activePage;
              const className = iActive ? 'is-current' : '';

              if (iActive && useGotoField) {
                const goToFieldWidth = Math.max(4.5, pageNumber.toString().length + 2);
                return (
                  <li key={key}>
                    <form onSubmit={handleGotoSubmit}>
                      <div className="field">
                        <p className="control has-icons-right">
                          <input
                            ref={gotoFieldInput}
                            className="input is-focused"
                            type="text"
                            placeholder={`${pageNumber}`}
                            style={{ width: `${goToFieldWidth}rem` }}
                            onKeyPress={handleGotoKeyPress}
                          />
                          <button type="submit" className="icon is-small is-right is-icon-button">
                            <i className="fas fa-search" />
                          </button>
                        </p>
                      </div>
                    </form>
                  </li>
                );
              }
              return (
                <li key={key}>
                  <button
                    type="button"
                    className={`pagination-link pagination-button ${className}`}
                    aria-label={`Goto page ${pageNumber}`}
                    onClick={event => handleClick(pageNumber, event)}>
                    {pageNumber}
                  </button>
                </li>
              );
            }

            if (paginationPlacement === 'inline') {
              if (visiblePiece.type === 'previous') {
                return <li key={key}>{previousButton(visiblePiece)}</li>;
              }
              if (visiblePiece.type === 'next') {
                return <li key={key}>{nextButton(visiblePiece)}</li>;
              }
            }

            return ''; // have to return empty string not <></> since this will trigger a warning due to missing key
          })}
        </ul>
      </nav>
      <br />
      <div className="level">
        <div className="level-left">
          <div className="level-item">
            Showing {fromRow} to {toRow} of {numberOfRows} rows
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            <div className="select">
              <select
                name="rowsPerPage"
                id="rowsPerPage"
                aria-label="Rows per page"
                onBlur={handleRowsPerPageChange}
                onChange={handleRowsPerPageChange}
                value={rowsPerPage}>
                <option key="10" value="10">
                  10
                </option>
                <option key="15" value="15">
                  15
                </option>
                <option key="20" value="20">
                  20
                </option>
                <option key="50" value="50">
                  50
                </option>
                <option key="100" value="100">
                  100
                </option>
              </select>
            </div>
          </div>
          <div className="level-item">rows per page</div>
        </div>
      </div>
    </>
  );
};

export default BulmaPaginator;
