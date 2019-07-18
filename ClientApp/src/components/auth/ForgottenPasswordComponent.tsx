import React, { useState, useCallback } from 'react';
import { useDataApi } from '../shared/hooks/data-api-hook';
import { BulmaInputField } from './BulmaInputField';
import { BulmaSubmitButton } from './BulmaSubmitButton';
import { Link } from 'react-router-dom';
import { ForgottenPasswordProps, ForgottenPasswordDispatchProps } from './ForgottenPasswordContainer';
import { history } from '../../history';

export default function ForgottenPasswordComponent(
  matchProps: ForgottenPasswordProps & ForgottenPasswordDispatchProps
) {
  const config = { apiUrl: process.env.REACT_APP_API };

  // read from props
  const { authentication } = matchProps;
  const hasTokenParameter = matchProps.match.params.token ? true : false;
  const hasUsernameParameter = matchProps.match.params.username ? true : false;

  let initialUsername = authentication.logonUserName;
  if (hasUsernameParameter) initialUsername = decodeURIComponent(matchProps.match.params.username);

  // define state
  const [username, setUsername] = useState(initialUsername);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [passwordsNotEqual, setPasswordsNotEqual] = useState(false);

  const receivedToken = useCallback(
    (token: string) => {
      let encodedToken = encodeURIComponent(token);
      let encodedUsername = encodeURIComponent(username);

      // instead of sending the token on email, we include it as a url parameter
      history.push(`/forgotten-password/${encodedUsername}/${encodedToken}`);

      console.log('encoded username: ' + encodedUsername);
      console.log('encoded token: ' + encodedToken);

      setSubmitted(false); // if the token is passed as an url parameter, we want a "clean" password form
    },
    [username]
  );

  const receivedResetConfirmation = useCallback((data: string) => {
    console.log('data: ' + data);
    setSubmitted(false); // if the token is passed as an url parameter, we want a "clean" password form
  }, []);

  const [token, isLoadingToken, isErrorToken, errorMessageToken, getResetToken] = useDataApi({
    initialUrl: '',
    autoLoad: false,
    callback: receivedToken
  });

  const [data, isLoadingReset, isErrorReset, errorMessageReset, resetPassword] = useDataApi({
    initialUrl: '',
    autoLoad: false,
    callback: receivedResetConfirmation
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasTokenParameter && username) {
      getResetToken(`${config.apiUrl}/api/Account/GenerateForgotPasswordToken?username=${username}`);
    } else if (hasTokenParameter && hasUsernameParameter && password && password === confirmPassword) {
      let encodedToken = encodeURIComponent(token);
      let encodedUsername = encodeURIComponent(username);
      let encodedPassword = encodeURIComponent(password);

      resetPassword(
        `${config.apiUrl}/api/Account/ResetPassword?username=${encodedUsername}&password=${encodedPassword}&token=${encodedToken}`
      );
    } else if (password && password !== confirmPassword) {
      setPasswordsNotEqual(true);
      setConfirmPassword('');
    } else {
      // all fields are empty?
    }
    setSubmitted(true);
  };

  const usernameJSX = (
    <>
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
    </>
  );

  const passwordJSX = (
    <>
      <div className="is-divider" data-content="Passord"></div>

      <BulmaInputField
        label="Nytt Passord"
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
    </>
  );

  return (
    <>
      {isErrorToken && (
        <div>
          Something went wrong: <pre className="has-text-left">{JSON.stringify(errorMessageToken || {}, null, 0)}</pre>
        </div>
      )}
      {isErrorReset && (
        <div>
          Something went wrong: <pre className="has-text-left">{JSON.stringify(errorMessageReset || {}, null, 0)}</pre>
        </div>
      )}
      {/* <pre className="has-text-left">{JSON.stringify(matchProps, null, 2)}</pre> */}
      {/* {isLoading ? <div>Loading ...</div> : <pre className="has-text-left">{JSON.stringify(token || {}, null, 0)}</pre>} */}

      <p className="subtitle has-text-grey">Glemt passord</p>
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-5-tablet is-5-desktop is-4-widescreen">
            <form className="box" onSubmit={handleSubmit}>
              <div className="field has-text-centered">
                <i className="fa fa-lock fa-3x"></i>
              </div>

              {usernameJSX}
              {hasTokenParameter ? passwordJSX : <></>}

              <BulmaSubmitButton text="Oppdater passord" loading={isLoadingToken} />
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
