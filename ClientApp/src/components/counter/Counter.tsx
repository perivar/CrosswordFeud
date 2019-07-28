import React, { Component } from 'react';

interface ILocalState {
  currentCount: number;
}

export class Counter extends Component<{}, ILocalState> {
  static displayName = Counter.name;

  constructor(props: any) {
    super(props);
    this.state = { currentCount: 0 };
    this.incrementCounter = this.incrementCounter.bind(this);
  }

  incrementCounter() {
    this.setState(prevState => ({
      currentCount: prevState.currentCount + 1
    }));
  }

  render() {
    return (
      <div>
        <h1>Counter - Test</h1>

        <p>This is a simple example of a React component.</p>

        <p>
          Current count: <strong>{this.state.currentCount}</strong>
        </p>

        <button type="button" className="btn btn-primary" onClick={this.incrementCounter}>
          Increment
        </button>
      </div>
    );
  }
}
