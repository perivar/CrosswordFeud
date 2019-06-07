import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
// import bean from 'bean';
import fastdom from 'fastdom';
import { classNames } from '../crosswords/classNames';
import { isBreakpoint } from '../lib/detect';
import { scrollTo } from '../lib/scroller';
import { IPosition } from './crossword';

export interface IClueProps {
  id: string,
  number: number,
  humanNumber: string,
  clue: string,
  hasAnswered: boolean,
  isSelected: boolean,
  setReturnPosition: (position: number) => void,
  focusFirstCellInClueById: (id: string) => void
}

export interface IClue {
  id: string,
  number: number,
  humanNumber: string,
  group: string[],
  clue: string,
  position: IPosition,
  separatorLocations: any // ',': [3, 9]
  direction: string,
  length: number,
  solution: string
}

export interface IClueEntry {
  entry: IClue,
  hasAnswered: boolean,
  isSelected: boolean
}

export interface ICluesProps {
  focused: IClue,
  clues: any,
  setReturnPosition: (position: number) => void,
  focusFirstCellInClueById: (id: string) => void
}

export interface ICluesState {
  showGradient: boolean
}


class Clue extends Component<IClueProps> {

  onClick(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    e.preventDefault();
    this.props.setReturnPosition(0);
    this.props.focusFirstCellInClueById(this.props.id);
  }

  render() {
    return (
      <li>
        <a
          href={`#${this.props.id}`}
          onClick={this.onClick.bind(this)}
          className={classNames({
            'crossword__clue': true,
            'crossword__clue--answered': this.props.hasAnswered,
            'crossword__clue--selected': this.props.isSelected,
            'crossword__clue--display-group-order':
              JSON.stringify(this.props.number)
              !== this.props.humanNumber,
          })}
        >
          <div className="crossword__clue__number">
            {this.props.humanNumber}
          </div>
          <div
            className="crossword__clue__text"
            dangerouslySetInnerHTML={{ __html: this.props.clue }}
          />
        </a>
      </li>
    );
  }
}


class Clues extends Component<ICluesProps, ICluesState> {

  private clues: React.RefObject<HTMLDivElement>;
  private '$cluesNode': HTMLDivElement;

  constructor(props: ICluesProps) {
    super(props);
    this.state = {
      showGradient: true,
    };

    this.clues = React.createRef();
  }

  componentDidMount() {

    this.$cluesNode = findDOMNode(this.clues.current) as HTMLDivElement;

    const height = this.$cluesNode.scrollHeight - this.$cluesNode.clientHeight;

    // bean.on(this.$cluesNode, 'scroll', (e: any) => {

    //   const showGradient = height - e.currentTarget.scrollTop > 25;

    //   if (this.state.showGradient !== showGradient) {
    //     this.setState({
    //       showGradient,
    //     });
    //   }
    // });
  }

  /**
     * Scroll clues into view when they're activated (i.e. clicked in the grid)
     */
  componentDidUpdate(prev: ICluesProps) {
    if (
      isBreakpoint({
        min: 'tablet',
        max: 'leftCol',
      })
      && (this.props.focused
        && (!prev.focused || prev.focused.id !== this.props.focused.id))
    ) {
      fastdom.measure(() => {
        this.scrollIntoView(this.props.focused);
      });
    }
  }

  scrollIntoView(clue: IClue) {
    const buffer = 100;
    const node = findDOMNode(this.refs[clue.id]) as HTMLInputElement;
    const visible = node.offsetTop - buffer > this.$cluesNode.scrollTop
      && node.offsetTop + buffer
      < this.$cluesNode.scrollTop + this.$cluesNode.clientHeight;

    if (!visible) {
      const offset = node.offsetTop - this.$cluesNode.clientHeight / 2;      
      scrollTo(offset, 250, 'easeOutQuad', this.$cluesNode);
    }
  }

  render() {
    const headerClass = 'crossword__clues-header';
    const cluesByDirection = (direction: string) => this.props.clues
      .filter((clue: IClueEntry) => clue.entry.direction === direction)
      .map((clue: IClueEntry) => (
        <Clue
          ref={clue.entry.id}
          id={clue.entry.id}
          key={clue.entry.id}
          number={clue.entry.number}
          humanNumber={clue.entry.humanNumber}
          clue={clue.entry.clue}
          hasAnswered={clue.hasAnswered}
          isSelected={clue.isSelected}
          focusFirstCellInClueById={
            this.props.focusFirstCellInClueById
          }
          setReturnPosition={() => {
            this.props.setReturnPosition(window.scrollY);
          }}
        />
      ));

    return (
      <div
        className={`crossword__clues--wrapper ${
          this.state.showGradient ? '' : 'hide-gradient'
          }`}
      >
        <div
          className="crossword__clues"
          ref={this.clues}
        >
          <div className="crossword__clues--across">
            <h3 className={headerClass}>Across</h3>
            <ol className="crossword__clues-list">
              {cluesByDirection('across')}
            </ol>
          </div>
          <div className="crossword__clues--down">
            <h3 className={headerClass}>Down</h3>
            <ol className="crossword__clues-list">
              {cluesByDirection('down')}
            </ol>
          </div>
        </div>
        <div className="crossword__clues__gradient" />
      </div>
    );
  }
}

export { Clues };
