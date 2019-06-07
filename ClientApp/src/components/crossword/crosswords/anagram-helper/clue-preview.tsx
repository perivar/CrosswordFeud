import React, { Component } from 'react';
import { IClue } from '../clues';

// Checks a object in the form{",":[4,7]}
const checkIfLetterHasSeparator = (locations: any, letterIndex: number) => {
  const spaces = locations[','];
  const letterHasBoundary = (separators: any) => separators.includes(letterIndex);

  if (spaces && letterHasBoundary(spaces)) {
    return 'crossword__anagram-helper__cell crossword__anagram-helper__cell--with-space';
  }

  const dashes = locations['-'];
  if (dashes && letterHasBoundary(dashes)) {
    return 'crossword__anagram-helper__cell crossword__anagram-helper__cell--with-hyphen';
  }

  return 'crossword__anagram-helper__cell';
};

export interface ICluePreviewProps {
  letters: any,
  entries: IClue[],
  hasShuffled: boolean,
  clue: IClue
}


class CluePreview extends Component<ICluePreviewProps> {

  /**
     * Get the entries for the preview cells: first filter the user's input to
     * remove anything anything that's already been entered into the grid.
     *
     * With that, we map over the entries, and wherever there's an empty space
     * we insert one of the shuffled input characters.
     *
     * If the user hasn't yet clicked 'shuffle' (this.props.hasShuffled) just
     * display the entries as they are, preserving any blank spaces.
     */
  getEntries(): IClue[] {
    const unsolved = this.props.letters.filter((l: any) => !l.entered);

    return this.props.entries.map((entry: any) => {
      entry.solved = !!entry.value;

      const returnVal = this.props.hasShuffled
        ? (entry.value && entry) || unsolved.shift()
        : entry;

      return Object.assign({}, { key: entry.key }, returnVal);
    });
  }

  render() {
    const entries = this.getEntries();

    return (
      <div
        className={`crossword__anagram-helper__clue-preview ${
          entries.length >= 9 ? 'long' : ''
          }`}
      >
        <div>
          <strong>
            {this.props.clue.number}
            {' '}
            <span className="crossword__anagram-helper__direction">
              {this.props.clue.direction}
            </span>
          </strong>
          {' '}
          {this.props.clue.clue}
        </div>
        {entries.map((entry: any, i: number) => {
          const classNames = checkIfLetterHasSeparator(
            this.props.clue.separatorLocations,
            i + 1,
          ); // Separators are one indexed in CAPI, annoyingly

          return (
            <span
              className={
                classNames + (entry.solved ? ' has-value' : '')
              }
              key={entry.key}
            >
              {entry.value || ''}
            </span>
          );
        })}
      </div>
    );
  }
}

export { CluePreview };
