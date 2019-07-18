import React from 'react';
import { Link } from 'react-router-dom';
import { IRegisterProps, IRegisterState } from './types';
import { BulmaInputField } from './BulmaInputField';
import { BulmaSubmitButton } from './BulmaSubmitButton';

export default class RegisterComponent extends React.Component<IRegisterProps, IRegisterState> {
  constructor(props: IRegisterProps) {
    super(props);

    this.state = {
      user: {
        id: '',
        userName: '',
        password: '',
        confirmPassword: '',
        email: '',
        confirmEmail: '',
        phoneNumber: ''
      },
      submitted: false,
      passwordsNotEqual: false,
      emailsNotEqual: false
    };
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const { user } = this.state;
    this.setState({
      user: {
        ...user,
        [name]: value
      }
    });
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // perform all neccassary validations
    const { user } = this.state;
    const { password, confirmPassword, email, confirmEmail } = user;
    if (password !== confirmPassword) {
      this.setState({
        user: {
          ...user,
          confirmPassword: ''
        },
        passwordsNotEqual: true,
        submitted: true
      });
    } else if (email !== confirmEmail) {
      this.setState({
        user: {
          ...user,
          confirmEmail: ''
        },
        emailsNotEqual: true,
        submitted: true
      });
    } else {
      // make API call
      if (user.userName && user.password && user.email) {
        this.props.register(user);
      }
      this.setState({ submitted: true });
    }
  };

  render() {
    const { registering } = this.props;
    const { user, submitted, passwordsNotEqual, emailsNotEqual } = this.state;
    return (
      <>
        <p className="subtitle has-text-grey">Registrer deg som ny bruker</p>
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-5-tablet is-5-desktop is-4-widescreen">
              <form className="box" onSubmit={this.handleSubmit}>
                <div className="field has-text-centered">
                  <i className="fas fa-user-plus fa-3x"></i>
                </div>
                <BulmaInputField
                  label="Brukernavn"
                  type="text"
                  name="userName"
                  placeholder="feks. ola@nordmann.no"
                  required={true}
                  requiredMessage="Gyldig brukernavn (e-post adresse) er påkrevd"
                  value={user.userName}
                  submitted={submitted}
                  handleChange={this.handleChange}
                  icon={<i className="fas fa-user"></i>}
                />
                <BulmaInputField
                  label="E-post adresse"
                  type="email"
                  name="email"
                  placeholder="feks. ola@nordmann.no"
                  required={true}
                  requiredMessage="Gyldig e-post adresse er påkrevd"
                  value={user.email}
                  submitted={submitted}
                  handleChange={this.handleChange}
                  icon={<i className="fa fa-envelope"></i>}
                />
                <BulmaInputField
                  label="Bekreft e-post adresse"
                  type="email"
                  name="confirmEmail"
                  placeholder="feks. ola@nordmann.no"
                  required={true}
                  requiredMessage={emailsNotEqual ? 'E-post adressene er ulike' : 'Gyldig e-post adresse er påkrevd'}
                  value={user.confirmEmail}
                  submitted={submitted}
                  handleChange={this.handleChange}
                  icon={<i className="fa fa-envelope"></i>}
                />
                <BulmaInputField
                  label="Telefon nummer"
                  type="text"
                  name="phoneNumber"
                  placeholder="feks. +47 40506070"
                  required={false}
                  requiredMessage="Gyldig telefon nummer er påkrevd"
                  value={user.phoneNumber}
                  submitted={submitted}
                  handleChange={this.handleChange}
                  icon={<i className="fa fa-phone"></i>}
                />

                <div className="is-divider" data-content="Passord"></div>

                <BulmaInputField
                  label="Passord"
                  type="password"
                  name="password"
                  placeholder="*********"
                  required={true}
                  requiredMessage="Gyldig passord er påkrevd"
                  value={user.password}
                  submitted={submitted}
                  handleChange={this.handleChange}
                  icon={<i className="fa fa-lock"></i>}
                />

                <BulmaInputField
                  label="Bekreft Passord"
                  type="password"
                  name="confirmPassword"
                  placeholder="*********"
                  required={true}
                  requiredMessage={passwordsNotEqual ? 'Passordene er ulike' : 'Gyldig passord er påkrevd'}
                  value={user.confirmPassword}
                  submitted={submitted}
                  handleChange={this.handleChange}
                  icon={<i className="fa fa-lock"></i>}
                />
                <BulmaSubmitButton text="Register ny bruker" loading={registering!} />
              </form>
              <p className="has-text-grey">
                <Link to="/login">
                  <i className="fas fa-user"></i>&nbsp; Har du allerede bruker? Logg inn!
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
