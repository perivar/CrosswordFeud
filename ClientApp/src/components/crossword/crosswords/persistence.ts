import { local as localStorage } from '../lib/storage';
import { IGrid } from './grid';

const localStorageKey = (id: string) => `crosswords.${id}`;

const saveGridState = (id: string, grid: IGrid[][]) => {
  // Take only the entries from the grid. Other state information like what
  // cells are highlighted ought not to be persisted.
  try {
    return localStorage.setItem(localStorageKey(id), grid);
  } catch (e) {
    return false;
  }
};

const loadGridState = (id: string) : IGrid[][] => localStorage.getItem(localStorageKey(id));

export { saveGridState, loadGridState };
