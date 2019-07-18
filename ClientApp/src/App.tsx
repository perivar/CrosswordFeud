import React, { Component } from 'react';
import { Route, Router } from 'react-router-dom';
import { connect } from 'react-redux';

import { Counter } from './components/counter/Counter';
import ForecastContainer from './components/forecast/ForecastContainer';
// import { Home } from "./components/Home";
import { Layout } from './components/shared/Layout';

import LoginContainer from './components/auth/LoginContainer';
import RegisterContainer from './components/auth/RegisterContainer';
import ForgottenPasswordContainer from './components/auth/ForgottenPasswordContainer';
import HelpContainer from './components/auth/HelpContainer';

import HomeContainer from './components/auth/HomeContainer';
import PrivateRoute from './components/auth/PrivateRouteComponent';
import CrosswordContainer from './components/crossword/CrosswordContainer';
import DictionaryContainer from './components/dictionary/DictionaryContainer';
import * as alertActions from './components/alert/ducks/actions';

import { history } from './history';

import './components/shared/bulma.scss';

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
      <>
        {alert && alert.message && <div className="notification is-warning">{alert.message}</div>}
        {loggedIn && (
          <div className="notification is-primary">
            <h2 className="subtitle">Display when logged in</h2>
          </div>
        )}
        <Router history={history}>
          <Layout>
            {/* <Route exact={true} path="/" component={Home} /> */}
            <PrivateRoute exact path="/" component={HomeContainer} />
            <Route path="/dictionary" component={DictionaryContainer} />
            <Route path="/counter" component={Counter} />
            <Route path="/forecast" component={ForecastContainer} />
            <Route path="/login" component={LoginContainer} />
            <Route path="/register" component={RegisterContainer} />
            <Route path="/forgottenpassword" component={ForgottenPasswordContainer} />
            <Route path="/help" component={HelpContainer} />
            <Route path="/crossword" component={CrosswordContainer} />
          </Layout>
        </Router>
      </>
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
    clearAlerts: () => dispatch(alertActions.clear())
  };
};

const connectedApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

export default connectedApp;
