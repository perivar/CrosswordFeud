import React, { Component } from "react";
import { Route, Router } from "react-router-dom";
import { connect } from 'react-redux';

import { Counter } from "./components/counter/Counter";
import ForecastContainer from "./components/forecast/ForecastContainer";
// import { Home } from "./components/Home";
import { Layout } from "./components/shared/Layout";

import LoginContainer from './components/auth/LoginContainer';
import RegisterContainer from './components/auth/RegisterContainer';
import HomeContainer from './components/auth/HomeContainer';
import PrivateRoute from "./components/auth/PrivateRouteComponent";
import * as alertActions from './components/alert/ducks/actions';
import Crossword from './components/crossword/crosswords/crossword'

import { history } from './history';

class App extends Component<any, any> {

  constructor(props: any) {
    super(props);

    history.listen((location, action) => {
      // clear alert on location change
      this.props.clearAlerts();
    });
  }

  public render() {
    const { alert, loggedIn } = this.props;
    return (
      <div>
        {
          alert && alert.message &&
          <div className={`alert ${alert.className}`} role="alert">{alert.message}</div>
        }
        {
          loggedIn &&
          <div>
            <h1>Display when logged in</h1>
          </div>
        }
        <Router history={history} >
          <div>
            <Layout>
              {/* <Route exact={true} path="/" component={Home} /> */}
              <PrivateRoute exact path="/" component={HomeContainer} />
              <Route path="/counter" component={Counter} />
              <Route path="/forecast" component={ForecastContainer} />
              <Route path="/login" component={LoginContainer} />
              <Route path="/register" component={RegisterContainer} />
              <Route path="/crossword" component={Crossword} />
            </Layout>
          </div>
        </Router >

        <Crossword data={
          {
            id: 'simple/1',
            number: 1,
            name: 'Simple Crossword 1',
            date: 1542326400000,
            entries: [
              {
                id: '1-across',
                number: 1,
                humanNumber: '1',
                clue: 'Toy on a string (2-2)',
                direction: 'across',
                length: 4,
                group: ['1-across'],
                position: { x: 0, y: 0 },
                separatorLocations: {
                  '-': [2],
                },
                solution: 'YOYO',
              },
              {
                id: '2-across',
                number: 2,
                humanNumber: '2',
                clue: 'Have a rest (3,4)',
                direction: 'across',
                length: 7,
                group: ['2-across'],
                position: { x: 0, y: 2 },
                separatorLocations: {
                  ',': [3],
                },
                solution: 'LIEDOWN',
              },
              {
                id: '1-down',
                number: 1,
                humanNumber: '1',
                clue: 'Colour (6)',
                direction: 'down',
                length: 6,
                group: ['1-down'],
                position: { x: 0, y: 0 },
                separatorLocations: {},
                solution: 'YELLOW',
              },
              {
                id: '3-down',
                number: 3,
                humanNumber: '3',
                clue: 'Bits and bobs (4,3,4)',
                direction: 'down',
                length: 7,
                group: ['3-down', '4-down'],
                position: { x: 3, y: 0 },
                separatorLocations: {
                  ',': [4],
                },
                solution: 'ODDSAND',
              },
              {
                id: '4-down',
                number: 4,
                humanNumber: '4',
                clue: 'See 3 down',
                direction: 'down',
                length: 4,
                group: ['3-down', '4-down'],
                position: {
                  x: 6,
                  y: 1,
                },
                separatorLocations: {},
                solution: 'ENDS',
              },
            ],
            solutionAvailable: true,
            dateSolutionAvailable: 1542326400000,
            dimensions: {
              cols: 13,
              rows: 13,
            },
            crosswordType: 'quick',
          }
        }
        />
      </div>
    );
  }
}

function mapStateToProps(state: any) {
  const { alert } = state;
  return {
    alert
  };
}

// inject methods *and* dispatch
const mapDispatchToProps = (dispatch: any) => {
  return {
    // dispatch,
    clearAlerts: () => dispatch(alertActions.clear()),
  };
}

const connectedApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

export default connectedApp; 