import React from 'react';
import { Link } from 'react-router-dom';
import { ILoginProps, ILoginState } from './types';
import { BulmaInputField } from './BulmaInputField';
import { BulmaSubmitButton } from './BulmaSubmitButton';

export default class LoginComponent extends React.Component<ILoginProps, ILoginState> {
  constructor(props: ILoginProps) {
    super(props);

    // reset login status
    this.props.logout();

    this.state = {
      username: '',
      password: '',
      submitted: false,
      remember: false
    };
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  handleCheckboxChange = () => {
    this.setState(prevState => ({
      ...prevState,
      remember: !prevState.remember
    }));
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    this.setState({ submitted: true });
    const { username, password } = this.state;
    if (username && password) {
      this.props.login(username, password);
    }
  };

  render() {
    const { loggingIn } = this.props;
    const { username, password, submitted, remember } = this.state;
    return (
      <>
        <p className="subtitle has-text-grey">Logg inn</p>
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-5-tablet is-5-desktop is-4-widescreen">
              <form className="box" onSubmit={this.handleSubmit}>
                <div className="field has-text-centered">
                  <i className="fas fa-sign-in-alt fa-3x"></i>
                </div>
                <BulmaInputField
                  label="Brukernavn"
                  type="text"
                  name="username"
                  placeholder="feks. ola@nordmann.no"
                  required={true}
                  requiredMessage="Gyldig brukernavn (e-post adresse) er påkrevd"
                  value={username}
                  submitted={submitted}
                  handleChange={this.handleChange}
                  icon={<i className="fas fa-user"></i>}
                />
                <BulmaInputField
                  label="Passord"
                  type="password"
                  name="password"
                  placeholder="*********"
                  required={true}
                  requiredMessage="Gyldig passord er påkrevd"
                  value={password}
                  submitted={submitted}
                  handleChange={this.handleChange}
                  icon={<i className="fa fa-lock"></i>}
                />
                <div className="field">
                  <div className="control">
                    <label className="checkbox">
                      <input type="checkbox" name="remember" onChange={this.handleCheckboxChange} checked={remember} />
                      Remember me
                    </label>
                  </div>
                </div>
                <BulmaSubmitButton text="Log inn" loading={loggingIn} />
              </form>
              <p className="has-text-grey">
                <Link to="/register">
                  <i className="fas fa-user-plus"></i>&nbsp; Er du ikke bruker? Register deg nå!
                </Link>
              </p>
              <p className="has-text-grey">
                <Link to="/forgottenpassword">
                  <i className="fa fa-lock"></i>&nbsp; Glemt passord?
                </Link>
              </p>
              <p className="has-text-grey">
                <Link to="/help">
                  <i className="fas fa-question"></i>&nbsp; Trenger du hjelp?
                </Link>
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }
}
