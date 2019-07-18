import React from 'react';
import { Link } from 'react-router-dom';

export default class HelpComponent extends React.Component<any, any> {
  render() {
    return (
      <>
        <p className="subtitle has-text-grey">Hjelp?</p>
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-5-tablet is-5-desktop is-4-widescreen">
              <div className="box">
                <div className="field has-text-centered">
                  <i className="fas fa-question fa-3x"></i>
                </div>
                <p className="has-text-grey">
                  <Link to="/register">
                    <i className="fas fa-user-plus"></i>&nbsp; Er du ikke bruker? Register deg nå!
                  </Link>
                </p>
                <p className="has-text-grey">
                  <Link to="/login">
                    <i className="fas fa-user"></i>&nbsp; Har du allerede bruker? Logg inn!
                  </Link>
                </p>
                <p className="has-text-grey">
                  <Link to="/forgottenpassword">
                    <i className="fa fa-lock"></i>&nbsp; Glemt passord?
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
