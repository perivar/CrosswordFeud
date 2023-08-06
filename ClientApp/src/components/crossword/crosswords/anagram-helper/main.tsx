import React, { Component } from 'react';
import shuffle from 'lodash/shuffle';
import { ReactComponent as Close } from '../../svgs/close.svg';

import { cellsForClue, getAnagramClueData } from '../helpers';
import { ClueInput } from './clue-input';
import { CluePreview, ICluePreview } from './clue-preview';
import { Ring } from './ring';
import Crossword from '../crossword';
import { IClue, IGrid, IPosition } from '../../types';

// function shuffle(array: any) {
//   for (let i = array.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [array[i], array[j]] = [array[j], array[i]];
//   }
// }

export interface IAnagramHelperProps {
  entries: IClue[];
  crossword?: Crossword; // make sure it can be undefined
  grid: IGrid;
  focusedEntry: any;
  close: any;
}

export interface IAnagramHelperState {
  letters: any;
  clueInput: string;
  showInput: boolean;
}

class AnagramHelper extends Component<IAnagramHelperProps, IAnagramHelperState> {
  constructor(props: IAnagramHelperProps) {
    super(props);

    this.state = {
      letters: [],
      clueInput: '',
      showInput: true
    };
  }

  onClueInput(text: string) {
    if (!/\s|\d/g.test(text)) {
      this.setState({
        clueInput: text
      });
    }
  }

  /**
   * Shuffle the letters in the user's input.
   *
   * First, create an array of input characters that have already been entered
   * into the grid. Then build a new collection of letters, using the first
   * array to flag letters that are already entered in the puzzle, and
   * shuffle it.
   *
   */
  shuffleWord(word: string, entries: any) {
    const wordEntries = entries
      .map((entry: any) => entry.value.toLowerCase())
      .filter((entry: any) => word.includes(entry))
      .filter(Boolean)
      .sort();

    return shuffle(
      word
        .trim()
        .split('')
        .sort()
        .reduce(
          (acc: any, letter: any) => {
            const [head, ...tail] = acc.entries;
            const entered = head === letter.toLowerCase();

            return {
              letters: acc.letters.concat({
                value: letter,
                entered
              }),
              entries: entered ? tail : acc.entries
            };
          },
          {
            letters: [],
            entries: wordEntries
          }
        ).letters
    );
  }

  shuffle() {
    if (this.canShuffle()) {
      this.setState((prevState) => ({
        letters: this.shuffleWord(prevState.clueInput, this.entries()),
        showInput: false
      }));
    }
  }

  reset() {
    if (this.state.clueInput) {
      this.setState({
        clueInput: '',
        showInput: true
      });
    }
  }

  canShuffle() {
    return !!this.state.clueInput && this.state.clueInput.length > 0;
  }

  entries(): ICluePreview[] {
    const cells = cellsForClue(this.props.entries, this.props.focusedEntry);

    return cells.map((coords: IPosition) => ({
      ...this.props.grid[coords.x][coords.y],
      key: `${coords.x},${coords.y}`,
      solved: false
    }));
  }

  render() {
    const clue = getAnagramClueData(this.props.entries, this.props.focusedEntry) as IClue;

    const inner = this.state.showInput ? (
      <ClueInput
        value={this.state.clueInput}
        clue={clue}
        onChange={this.onClueInput.bind(this)}
        onEnter={this.shuffle.bind(this)}
      />
    ) : (
      <Ring letters={this.state.letters} />
    );

    return (
      <div className="crossword__anagram-helper-outer" data-link-name="Anagram Helper">
        <div className="crossword__anagram-helper-inner">{inner}</div>
        <button
          type="button"
          className="button--crossword button--large button--tertiary crossword__anagram-helper-close"
          onClick={this.props.close.bind(this.props.crossword)}
          data-link-name="Close">
          <Close />
        </button>
        <CluePreview
          clue={clue}
          entries={this.entries()}
          letters={this.state.letters}
          hasShuffled={!this.state.showInput}
        />
        <button
          type="button"
          className={`button--crossword button--large ${!this.state.clueInput ? 'button--tertiary' : ''}`}
          onClick={this.reset.bind(this)}
          data-link-name="Start Again">
          Restart
        </button>
        <button
          type="button"
          className={`button--crossword button--large ${this.canShuffle() ? '' : 'button--tertiary'}`}
          onClick={this.shuffle.bind(this)}
          data-link-name="Shuffle">
          Shuffle
        </button>
      </div>
    );
  }
}

export { AnagramHelper };
