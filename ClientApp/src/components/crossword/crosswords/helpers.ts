import { constants } from './constants';
import flattenDeep from 'lodash/flattenDeep';
import range from 'lodash/range';
import uniqBy from 'lodash/uniqBy';

import { IClue } from './clues';
import { IPosition } from './crossword';
import { IGrid } from './grid';

// const flattenDeep = (arr: any): any => Array.isArray(arr)
//   ? arr.reduce((a, b) => a.concat(flattenDeep(b)), [])
//   : [arr];

/**
 * @param <_p> Return a list integers of zero until <_p> value.
 * @param <_t> Return a list integers of <_t> until <_p> value.
 * @param <_s> Return a list integers of <_t> until <_p> with steps <_s> value.
 * @return Return a array list
 */
// function range(_p: number, _t?: number, _s?: number): number[] {
//   let start: number = (_t) ? _p : 0;
//   let stop: number = (_t) ? _t : _p;
//   let step: number = (_s) ? _s : 1;

//   let t: number[] = [];
//   for (let i = start; i < stop; i = i + step) {
//     t.push(i);
//   }

//   return t;
// }

// function uniqBy(array: any, keyToBeUnique: any) {
//   return Object.values(array.reduce((tmp: any, x: any) => {
//     // You already get a value
//     if (tmp[x[keyToBeUnique]]) return tmp;

//     // You never envcountered this key
//     tmp[x[keyToBeUnique]] = x;

//     return tmp;
//   }, {}));
// }

const isAcross = (clue: IClue): boolean => clue.direction === 'across';

const getLastCellInClue = (clue: IClue): IPosition => {

  const ax: any = {
    true: 'x',
    false: 'y',
  };

  const axis = ax[String(isAcross(clue))];
  const otherAxis = ax[String(!isAcross(clue))];

  const cell = {
    [axis]: clue.position[axis] + (clue.length - 1),
    [otherAxis]: clue.position[otherAxis],
  } as IPosition;

  return cell;
};

const isFirstCellInClue = (cell: IPosition, clue: IClue): boolean => {
  const axis = isAcross(clue) ? 'x' : 'y';

  return cell[axis] === clue.position[axis];
};

const isLastCellInClue = (cell: IPosition, clue: IClue): boolean => {
  const axis = isAcross(clue) ? 'x' : 'y';

  return cell[axis] === clue.position[axis] + (clue.length - 1);
};

const getNextClueInGroup = (entries: IClue[], clue: IClue): IClue => {
  const newClueId = clue.group[clue.group.findIndex((id: string) => id === clue.id) + 1];

  return entries.find(entry => entry.id === newClueId) as IClue;
};

const getPreviousClueInGroup = (entries: IClue[], clue: IClue) => {
  const newClueId = clue.group[clue.group.findIndex((id: string) => id === clue.id) - 1];

  return entries.find(entry => entry.id === newClueId);
};

const getGroupEntriesForClue = (entries: IClue[], group: any) => group.reduce((acc: IClue[], clueId: string) => {

  const entry = entries.find(e => e.id === clueId) as IClue;

  if (entry) {
    acc.push(entry);
  }

  return acc;
}, []);

const clueIsInGroup = (clue: IClue): boolean => clue.group.length !== 1;

const getAllSeparatorsForGroup = (clues: IClue[]): any => {

  const k: any = {};

  [',', '-'].forEach((separator: string) => {
    let cnt = 0;
    const flattenedSeparators = flattenDeep(
      clues.map((clue: IClue) => {
        const separatorLocations = clue.separatorLocations[separator] || [];
        const seps = separatorLocations.map((s: number) => s + cnt);

        cnt += clue.length;

        return seps;
      }),
    );

    k[separator] = flattenedSeparators;
  });

  return k;
};

const getClueForGroupedEntries = (clueGroup: IClue[]): any => clueGroup[0].clue;

const getNumbersForGroupedEntries = (clueGroup: IClue[]): any => clueGroup[0].humanNumber;

const getTotalLengthOfGroup = (clueGroup: IClue[]) => clueGroup.reduce((total: number, clue: IClue): number => total + clue.length, 0);

const getAnagramClueData = (entries: IClue[], clue: IClue): any => {

  if (clueIsInGroup(clue)) {
    const groupEnts = getGroupEntriesForClue(entries, clue.group);
    const groupClue = {
      id: clue.id,
      number: getNumbersForGroupedEntries(groupEnts),
      length: getTotalLengthOfGroup(groupEnts),
      separatorLocations: getAllSeparatorsForGroup(groupEnts),
      direction: '',
      clue: getClueForGroupedEntries(groupEnts),
    };

    return groupClue;
  }

  return clue;
};

const cluesAreInGroup = (clue: IClue, otherClue: IClue): boolean => otherClue.group.includes(clue.id);

const cellsForEntry = (entry: IClue): any => (isAcross(entry)
  ? range(entry.position.x, entry.position.x + entry.length).map((x: number) => ({
    x,
    y: entry.position.y,
  }))
  : range(entry.position.y, entry.position.y + entry.length).map((y: number) => ({
    x: entry.position.x,
    y,
  })));

const checkClueHasBeenAnswered = (grid: IGrid[][], entry: IClue): any => cellsForEntry(entry).every((position: IPosition) => /^.$/.test(grid[position.x][position.y].value));

const otherDirection = (direction: string): string => (direction === 'across' ? 'down' : 'across');

const cellsForClue = (entries: IClue[], clue: IClue): any => {
  if (clueIsInGroup(clue)) {
    const entriesForClue = getGroupEntriesForClue(entries, clue.group);

    return flattenDeep(entriesForClue.map((entry: IClue) => cellsForEntry(entry)));
  }

  return cellsForEntry(clue);
};

/** Hash key for the cell at x, y in the clue map */
const clueMapKey = (x: number, y: number): string => `${x}_${y}`;

const cluesFor = (clueMap: any, x: number, y: number): any => clueMap[clueMapKey(x, y)];

const getClearableCellsForEntry = (grid: IGrid[][], clueMap: any, entries: IClue[], entry: IClue): any => {
  const direction = otherDirection(entry.direction);

  return cellsForEntry(entry).filter((cell: IPosition) => {
    const clues = cluesFor(clueMap, cell.x, cell.y);
    const otherClue = clues[direction];

    if (otherClue) {
      return (
        cluesAreInGroup(entry, otherClue)
        || !checkClueHasBeenAnswered(grid, otherClue)
      );
    }

    return true;
  });
};

const getClearableCellsForClue = (grid: IGrid[][], clueMap: any, entries: IClue[], clue: IClue): any => {

  if (clueIsInGroup(clue)) {
    const entriesForClue = getGroupEntriesForClue(entries, clue.group);

    return uniqBy(
      flattenDeep(
        entriesForClue.map((entry: IClue) => getClearableCellsForEntry(grid, clueMap, entries, entry)),
      ),
      (cell: any) => [cell.x, cell.y].join(),
    );
  }

  return getClearableCellsForEntry(grid, clueMap, entries, clue);
};

/**
 * Builds the initial state of the grid given the number of rows, columns, and a list of clues.
 */
const buildGrid = (rows: number, columns: number, entries: IClue[], savedState: any): IGrid[][] => {

  const grid = range(columns).map(x => range(rows).map(y => ({
    isHighlighted: false,
    isEditable: false,
    isError: false,
    isAnimating: false,
    value:
      savedState && savedState[x] && savedState[x][y]
        ? savedState[x][y]
        : '',
  }))) as IGrid[][];

  entries.forEach((entry: IClue) => {
    const { x, y } = entry.position as IPosition;

    grid[x][y].number = entry.number;

    cellsForEntry(entry).forEach((cell: IPosition) => {
      grid[cell.x][cell.y].isEditable = true;
    });
  });

  // $FlowFixMe
  return grid;
};

/** A map for looking up clues that a given cell relates to */
const buildClueMap = (clues: IClue[]): any => {

  type ClueMapType = Record<string, any>;
  const map: ClueMapType = {};

  clues.forEach((clue) => {
    cellsForEntry(clue).forEach((cell: IPosition) => {
      const key = clueMapKey(cell.x, cell.y);

      if (map[key] === undefined) {
        map[key] = {};
      }

      if (isAcross(clue)) {
        map[key].across = clue;
      } else {
        map[key].down = clue;
      }
    });
  });

  return map;
};

/** A map for looking up separators (i.e word or hyphen) that a given cell relates to */
const buildSeparatorMap = (clues: IClue[]): any => {
  const flattenReducer = (acc: any, curr: any) => {
    let flattened = curr;

    if (Array.isArray(flattened) && flattened.length) {
      flattened = flattened.reduce(flattenReducer, []);
    }

    return acc.concat(flattened);
  };

  return clues
    .map(clue => Object.keys(clue.separatorLocations).map((separatorStr) => {
      const separator = separatorStr;
      const locations = clue.separatorLocations[separator];

      return locations.map((location: any) => {
        const key = isAcross(clue)
          ? clueMapKey(
            clue.position.x + location,
            clue.position.y,
          )
          : clueMapKey(
            clue.position.x,
            clue.position.y + location,
          );

        return {
          key,
          direction: clue.direction,
          separator,
        };
      });
    }))
    .reduce(flattenReducer, [])
    .reduce((map: any, d: any) => {
      if (!d) {
        return map;
      }

      if (map[d.key] === undefined) {
        map[d.key] = {};
      }

      map[d.key] = d;

      return map;
    }, {});
};

const entryHasCell = (entry: IClue, x: number, y: number): boolean => cellsForEntry(entry).some((cell: IPosition) => cell.x === x && cell.y === y);

/** Can be used for width or height, as the cell height == cell width */
const gridSize = (cells: number): number => cells * (constants.cellSize + constants.borderSize) + constants.borderSize;

const mapGrid = (grid: IGrid[][], f: any): any => grid.map((col, x: number) => col.map((cell: any, y: number) => f(cell, x, y)));

export {
  isAcross,
  otherDirection,
  buildGrid,
  clueMapKey,
  cluesFor,
  buildClueMap,
  buildSeparatorMap,
  cellsForEntry,
  cellsForClue,
  entryHasCell,
  gridSize,
  mapGrid,
  getAnagramClueData,
  getLastCellInClue,
  isFirstCellInClue,
  isLastCellInClue,
  getNextClueInGroup,
  getPreviousClueInGroup,
  clueIsInGroup,
  getGroupEntriesForClue,
  getNumbersForGroupedEntries,
  getClueForGroupedEntries,
  getAllSeparatorsForGroup,
  getTotalLengthOfGroup as getTtotalLengthOfGroup,
  cluesAreInGroup,
  checkClueHasBeenAnswered,
  getClearableCellsForClue,
};
