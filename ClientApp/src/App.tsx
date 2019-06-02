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
            </Layout>
          </div>
        </Router >
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