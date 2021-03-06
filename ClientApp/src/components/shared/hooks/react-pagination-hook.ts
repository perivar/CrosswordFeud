import { useCallback, useState } from 'react';

export type ConfigArg = {
  numberOfPages: number;
  initialPage: number;
  maxButtons?: number;
  alwaysUsePreviousNextButtons?: boolean;
};

type Config = ConfigArg & {
  maxButtons: number;
  alwaysUsePreviousNextButtons: boolean;
};

export type PaginatorPiece =
  | {
      type: 'previous' | 'next';
      pageNumber: number;
      isDisabled: boolean;
    }
  | {
      pageNumber: number;
      type: 'page-number';
    }
  | {
      type: 'ellipsis';
    };

export interface State {
  activePage: number;
  isFirst: boolean;
  isLast: boolean;
  hasPrevious: boolean;
  hasNext: boolean;
  visiblePieces: PaginatorPiece[];
  goToPage: (pageNumber: number) => void;
}

function computeVisiblePieces(activePage: number, config: Config): PaginatorPiece[] {
  const { numberOfPages, maxButtons, alwaysUsePreviousNextButtons } = config;
  const visiblePieces: PaginatorPiece[] = [];

  if (numberOfPages <= maxButtons) {
    for (let page = 1; page <= numberOfPages; page++) {
      visiblePieces.push({ type: 'page-number', pageNumber: page });
    }

    if (alwaysUsePreviousNextButtons) {
      visiblePieces.push({
        type: 'previous',
        pageNumber: Math.max(1, activePage - 1),
        // the button is disabled if the number of pages is zero
        isDisabled: activePage === 1 || numberOfPages === 0
      });

      visiblePieces.push({
        type: 'next',
        pageNumber: Math.min(numberOfPages, activePage + 1),
        // the button is disabled if the number of pages is zero
        isDisabled: activePage === numberOfPages || numberOfPages === 0
      });
    }

    return visiblePieces;
  }

  let lowerLimit = activePage;
  let upperLimit = activePage;

  visiblePieces.push({
    type: 'previous',
    pageNumber: Math.max(1, activePage - 1),
    isDisabled: activePage === 1
  });

  // From https://gist.github.com/keon/5380f81393ad98ec19e6
  for (let i = 1; i < maxButtons && i < numberOfPages; ) {
    if (lowerLimit > 1) {
      lowerLimit -= 1;
      i += 1;
    }

    if (i < maxButtons && upperLimit < numberOfPages) {
      upperLimit += 1;
      i += 1;
    }
  }

  if (lowerLimit > 1) {
    visiblePieces.push({ type: 'page-number', pageNumber: 1 });
    visiblePieces.push({ type: 'ellipsis' });
  }

  for (let i = lowerLimit; i <= upperLimit; i++) {
    visiblePieces.push({ type: 'page-number', pageNumber: i });
  }

  if (activePage < numberOfPages - 2) {
    visiblePieces.push({ type: 'ellipsis' });
    visiblePieces.push({ type: 'page-number', pageNumber: numberOfPages });
  }

  visiblePieces.push({
    type: 'next',
    pageNumber: Math.min(numberOfPages, activePage + 1),
    isDisabled: activePage === numberOfPages
  });

  return visiblePieces;
}

export function usePagination(_config: ConfigArg): any {
  if (typeof _config !== 'object') {
    throw new TypeError(`usePagination(config): config must be an object. Go ${typeof _config} instead`);
  }

  const config: Config = { maxButtons: 5, alwaysUsePreviousNextButtons: false, ..._config };

  if (config.initialPage > config.numberOfPages) {
    config.initialPage = config.numberOfPages;
  }

  if (config.maxButtons > config.numberOfPages) {
    config.maxButtons = config.numberOfPages;
  }

  const [activePage, setActivePage] = useState(config.initialPage);
  const { numberOfPages } = config;
  const isFirst = activePage === 1;
  const isLast = activePage === numberOfPages;
  const hasPrevious = numberOfPages > 1 && activePage > 1;
  const hasNext = activePage < numberOfPages;
  const visiblePieces = computeVisiblePieces(activePage, config);
  const goToPage = useCallback<State['goToPage']>((pageNumber) => {
    setActivePage(pageNumber);
  }, []);

  return {
    activePage,
    isFirst,
    isLast,
    hasPrevious,
    hasNext,
    visiblePieces,
    goToPage
  };
}
