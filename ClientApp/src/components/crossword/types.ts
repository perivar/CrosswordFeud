// https://github.com/guardian/frontend/blob/master/static/src/javascripts/__flow__/types/crosswords.js

export type Direction = 'across' | 'down';

export type Separator = '-' | ',';

export type Axis = 'x' | 'y';

export type SeparatorLocations = {
  [separator in Separator]: number[]
}

export type IPosition = {
  [axis in Axis]: number
}

// export interface IPosition {
//   [index: string]: number,
//   x: number,
//   y: number
// }

export interface ISeparatorDescription {
  direction: Direction,
  separator: Separator
}

export interface ISeparatorMap {
  [index: string]: ISeparatorDescription
}

// type Cell = {
//   number: number | string,
//   isHighlighted: boolean,
//   isEditable: boolean,
//   isError: boolean,
//   isAnimating: boolean,
//   value: string,
// };

export interface ICell {
  isAnimating: boolean,
  isEditable: boolean,
  isError: boolean,
  isHighlighted: boolean,
  number: number,
  value: string
}

export type IGrid = ICell[][];

// type Clue = {
//   id: string,
//   number: number | string,
//   humanNumber: number | string,
//   group: Array<string>,
//   clue: string,
//   position: Position,
//   separatorLocations: SeparatorLocations,
//   direction: Direction,
//   length: number,
//   solution: string,
// };

export interface IClue {
  id: string,                                 // '1-across',
  number: number,                             // 1
  humanNumber: string,                        // '1'
  group: string[],                            // ['1-across']
  clue: string,                               // 'Toy on a string (2-2)'
  position: IPosition,                        // { x: 0, y: 0 }
  separatorLocations: SeparatorLocations | {} // { '-': [2] }
  direction: Direction,                       // 'across'
  length: number,                             // 4
  solution: string                            // YOYO
}

// type GroupClue = {
//   id: string,
//   number: ?number | ?string,
//   length: number,
//   separatorLocations: SeparatorLocations,
//   direction: '',
//   clue: ?string,
// }

export interface IGroupClue {
  id: string,
  number: string,
  length: number,
  separatorLocations: SeparatorLocations,
  direction: '',
  clue: string
}

export interface ICluesIntersect {
  across?: IClue,
  down?: IClue
}

export interface IClueMap {
  [index: string]: ICluesIntersect
}

export interface IDimensions {
  cols: number,
  rows: number
}