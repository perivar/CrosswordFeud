import React, { useState } from 'react';
import { useDataApi } from '../shared/hooks/data-api-hook';
import { BulmaInputField } from './BulmaInputField';
import { BulmaSubmitButton } from './BulmaSubmitButton';
import { Link } from 'react-router-dom';

export default function ForgottenPasswordComponent() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [passwordsNotEqual, setPasswordsNotEqual] = useState(false);

  const initialUrl = ''; // `http://116.203.83.168:8000/api/Account/GenerateForgotPasswordToken?username=${username}`;
  const { data, isLoading, isError, errorMessage, setUrl } = useDataApi({ initialUrl, autoLoad: false });

  return (
    <>
      <p className="subtitle has-text-grey">Glemt passord</p>
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-5-tablet is-5-desktop is-4-widescreen">
            <form
              className="box"
              onSubmit={event => {
                event.preventDefault();
                if (username && password && password === confirmPassword) {
                  setUrl(`http://116.203.83.168:8000/api/Account/GenerateForgotPasswordToken?username=${username}`);
                } else if (password && password !== confirmPassword) {
                  setPasswordsNotEqual(true);
                  setConfirmPassword('');
                } else {
                  // all fields are empty?
                }
                setSubmitted(true);
              }}>
              <div className="field has-text-centered">
                <i className="fa fa-lock fa-3x"></i>
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
                handleChange={event => setUsername(event.target.value)}
                icon={<i className="fas fa-user"></i>}
              />
              <div className="is-divider" data-content="Passord"></div>

              <BulmaInputField
                label="Passord"
                type="password"
                name="password"
                placeholder="*********"
                required={true}
                requiredMessage="Gyldig passord er påkrevd"
                value={password}
                submitted={submitted}
                handleChange={event => setPassword(event.target.value)}
                icon={<i className="fa fa-lock"></i>}
              />

              <BulmaInputField
                label="Bekreft Passord"
                type="password"
                name="confirmPassword"
                placeholder="*********"
                required={true}
                requiredMessage={passwordsNotEqual ? 'Passordene er ulike' : 'Gyldig passord er påkrevd'}
                value={confirmPassword}
                submitted={submitted}
                handleChange={event => setConfirmPassword(event.target.value)}
                icon={<i className="fa fa-lock"></i>}
              />

              <BulmaSubmitButton text="Send meg nytt passord" loading={isLoading} />
            </form>
            <p className="has-text-grey">
              <Link to="/login">
                <i className="fas fa-user"></i>&nbsp; Har du allerede bruker? Logg inn!
              </Link>
            </p>
            <p className="has-text-grey">
              <Link to="/register">
                <i className="fas fa-user-plus"></i>&nbsp; Er du ikke bruker? Register deg nå!
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

      {isError && <div>Something went wrong: {errorMessage}</div>}
      {isLoading ? <div>Loading ...</div> : <p>{JSON.stringify(data || {}, null, 0)}</p>}
    </>
  );
}

/*
export default class ForgottenPasswordComponent extends React.Component<any, any> {
  username = 'perivar@nerseth.com';
  render() {
    return (
      <>
        <ResetPasswordToken username={this.username} />
      </>
    );
  }
}
*/
