import React, { useState, useCallback, useEffect } from 'react';
import { useDataApi } from '../shared/hooks/data-api-hook';
import { BulmaInputField } from './BulmaInputField';
import { BulmaSubmitButton } from './BulmaSubmitButton';
import { Link } from 'react-router-dom';
import { ForgottenPasswordProps, ForgottenPasswordDispatchProps } from './ForgottenPasswordContainer';
import { history } from '../../history';
import { ASPCoreIdentityErrors } from './types';

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
  const [passwordNotValid, setPasswordNotValid] = useState(false);
  const [passwordUpdatedSuccessfully, setPasswordUpdatedSuccessfully] = useState(false);

  const receivedToken = useCallback(
    (error: any, response: any) => {
      if (response && response.data) {
        let token = response.data;
        let encodedToken = encodeURIComponent(token);
        let encodedUsername = encodeURIComponent(username);

        // instead of sending the token on email, we include it as a url parameter
        history.push(`/forgotten-password/${encodedUsername}/${encodedToken}`);

        console.log('encoded username: ' + encodedUsername);
        console.log('encoded token: ' + encodedToken);

        setSubmitted(false); // if the token is passed as an url parameter, we want a "clean" password form
      }
    },
    [username]
  );

  const receivedResetConfirmation = useCallback((error: any, response: any) => {
    if (response) {
      setPasswordUpdatedSuccessfully(true);
      setSubmitted(false); // if the token is passed as an url parameter, we want a "clean" password form
    }
  }, []);

  const {
    response: responseToken,
    isLoading: isLoadingToken,
    isError: isErrorToken,
    error: errorToken,
    setUrl: getResetToken
  } = useDataApi({
    initialUrl: ''
    // callback: receivedToken
  });

  useEffect(() => {
    receivedToken(errorToken, responseToken);
  }, [responseToken, errorToken, receivedToken]);

  const {
    response: responseReset,
    // isLoading: isLoadingReset,
    isError: isErrorReset,
    error: errorReset,
    setUrl: resetPassword
  } = useDataApi({
    initialUrl: ''
    // callback: receivedResetConfirmation
  });

  useEffect(() => {
    receivedResetConfirmation(errorReset, responseReset);
  }, [responseReset, errorReset, receivedResetConfirmation]);

  const isValidASPCoreIdentityPassword = (password: string): boolean => {
    // https://stackoverflow.com/questions/48635152/regex-for-default-asp-net-core-identity-password
    // if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$/.test(password)) {
    //   return true;
    // }
    // return false;
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasTokenParameter && username) {
      getResetToken(`${config.apiUrl}/api/Account/GenerateForgotPasswordToken?username=${username}`);
    } else if (hasTokenParameter && hasUsernameParameter && password && !isValidASPCoreIdentityPassword(password)) {
      setPasswordNotValid(true);
      setPassword('');
      setConfirmPassword('');
    } else if (
      hasTokenParameter &&
      hasUsernameParameter &&
      password &&
      isValidASPCoreIdentityPassword(password) &&
      password === confirmPassword
    ) {
      if (responseToken && responseToken.data) {
        let token = responseToken.data;
        let encodedToken = encodeURIComponent(token);
        let encodedUsername = encodeURIComponent(username);
        let encodedPassword = encodeURIComponent(password);

        resetPassword(
          `${config.apiUrl}/api/Account/ResetPassword?username=${encodedUsername}&password=${encodedPassword}&token=${encodedToken}`
        );
      }
    } else if (password && password !== confirmPassword) {
      setPasswordsNotEqual(true);
      setConfirmPassword('');
    } else {
      // all fields are empty?
    }
    setSubmitted(true);
  };

  const usernameSegment = (
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

  const passwordSegment = (
    <>
      <div className="is-divider" data-content="Passord"></div>

      <BulmaInputField
        label="Nytt Passord"
        type="password"
        name="password"
        placeholder="*********"
        required={true}
        requiredMessage={passwordNotValid ? 'Passordet er ikke gyldig' : 'Gyldig passord er påkrevd'}
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

  const formSegment = (
    <>
      <form className="box" onSubmit={handleSubmit}>
        <div className="field has-text-centered">
          <i className="fa fa-lock fa-3x"></i>
        </div>

        {usernameSegment}
        {hasTokenParameter ? passwordSegment : <></>}

        <BulmaSubmitButton text="Oppdater passord" loading={isLoadingToken} />
      </form>
    </>
  );

  return (
    <>
      {/* <pre className="has-text-left">{JSON.stringify(matchProps, null, 2)}</pre> */}

      {isErrorToken && (
        <article className="message is-danger">
          <div className="message-body">
            {errorToken && errorToken.response && errorToken.response.data ? (
              errorToken.response.data.title
            ) : (
              <pre className="has-text-left">{JSON.stringify(errorToken.response.data || {}, null, 0)}</pre>
            )}
          </div>
        </article>
      )}

      {/*isErrorReset && (
        <div>
          Noe gikk galt!
          <pre className="has-text-left">{JSON.stringify(errorMessageReset || {}, null, 0)}</pre>
        </div>
			)} */}

      {isErrorReset ? (
        <article className="message is-danger">
          <div className="message-body">
            {errorReset &&
              errorReset.response &&
              errorReset.response.data &&
              errorReset.response.data.map((identityError: ASPCoreIdentityErrors, index: number) => (
                <div key={index} className="has-text-left">
                  {/* {identityError.code} */}
                  {identityError.description}
                </div>
              ))}
          </div>
        </article>
      ) : (
        ''
      )}

      {/* {isLoadingToken ? (
        <div>Loading ...</div>
      ) : (
        <pre className="has-text-left">{JSON.stringify(responseToken || {}, null, 0)}</pre>
      )}
      {isLoadingReset ? (
        <div>Loading ...</div>
      ) : (
        <pre className="has-text-left">{JSON.stringify(responseReset || {}, null, 0)}</pre>
      )} */}

      <p className="subtitle has-text-grey">Glemt passord</p>
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-5-tablet is-5-desktop is-4-widescreen">
            {passwordUpdatedSuccessfully ? (
              <h3 className="title is-3 has-text-success">Passordet ditt er oppdatert!</h3>
            ) : (
              formSegment
            )}
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
