// ducks/operations.ts
// Here, we define any logic surrounding our actions and side effects, including async logic.
// If an action has no surrounding logic, then we simply forward them as is

import { IUser, ILogon } from '../types';
import { store } from '../../../index';

const config = { apiUrl: process.env.REACT_APP_API };

function authHeader(): Headers {
  // return authorization header with jwt token
  const user = JSON.parse(localStorage.getItem('user') || '{}') as ILogon;

  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` } as any;
  }
  return {} as any;
}

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem('user');
}

function handleResponse(response: any) {
  return response.text().then((text: any) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      const authenticate = response.headers.get('WWW-Authenticate');
      console.log(authenticate);

      // parse the error and error descrition
      const regex = /(error|error_description)="(.+?)"/g;
      let matches;
      while ((matches = regex.exec(authenticate)) !== null) {
        matches.forEach((match, groupIndex) => {
          if (groupIndex === 1) console.log(`Param: ${match}`);
          if (groupIndex === 2) console.log(`Value: ${match}`);
        });
      }

      const tokenExpired = response.headers.get('Token-Expired');
      const refreshExpired = response.headers.get('Refresh-Token-Expired');
      const invalidToken = response.headers.get('Invalid-Token');
      const invalidRefreshToken = response.headers.get('Invalid-Refresh-Token');

      if ((tokenExpired && tokenExpired === 'true') || (invalidToken && invalidToken === 'true')) {
        store.dispatch({ type: 'INVALID_TOKEN' });
      } else if (
        (refreshExpired && refreshExpired === 'true') ||
        (invalidRefreshToken && invalidRefreshToken === 'true')
      ) {
        store.dispatch({ type: 'REFRESH_EXPIRED' });
        // } else if (response.status === 401) {
        // auto logout if 401 response returned from api
        // logout();
        // window.location.reload(true);
      } else {
        // extract error message and convert to string
        const error =
          (data && data.errors && data.errors.map((a: any) => a.description).join(' ')) ||
          (data && data.title) ||
          data ||
          response.statusText;
        return Promise.reject(error);
      }
    }

    return data;
  });
}

function login(username: string, password: string) {
  const requestOptions: RequestInit = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  };

  return fetch(`${config.apiUrl}/api/Account/Login`, requestOptions)
    .then(handleResponse)
    .then(user => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    });
}

function getAll() {
  const requestOptions: RequestInit = {
    method: 'GET',
    headers: authHeader()
  };

  return fetch(`${config.apiUrl}/api/Account/GetAll`, requestOptions).then(handleResponse);
}

function getByName(username: string) {
  const requestOptions: RequestInit = {
    method: 'GET',
    headers: authHeader()
  };

  return fetch(`${config.apiUrl}/api/Account/GetByName/${username}`, requestOptions).then(handleResponse);
}

function register(user: IUser) {
  const requestOptions: RequestInit = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  };

  return fetch(`${config.apiUrl}/api/Account/Register`, requestOptions).then(handleResponse);
}

function update(user: IUser) {
  const requestOptions: RequestInit = {
    method: 'PUT',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  };

  return fetch(`${config.apiUrl}/api/Account/Update/${user.username}`, requestOptions).then(handleResponse);
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(username: string) {
  const requestOptions: RequestInit = {
    method: 'DELETE',
    headers: authHeader()
  };

  return fetch(`${config.apiUrl}/api/Account/Delete/${username}`, requestOptions).then(handleResponse);
}

function refreshToken(token: string, refreshToken: string) {
  const encodedToken = encodeURIComponent(token);
  const encodedRefreshToken = encodeURIComponent(refreshToken);

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
    // body: JSON.stringify({ token: encodedToken, refreshToken: encodedRefreshToken })
  };

  // note the refresh is a POST call but with query parameters
  return fetch(
    `${config.apiUrl}/api/Account/Refresh?token=${encodedToken}&refreshToken=${encodedRefreshToken}`,
    requestOptions
  )
    .then(handleResponse)
    .then(tokens => {
      const user = JSON.parse(localStorage.getItem('user') || '{}') as ILogon;
      user.token = tokens.token;
      user.refreshToken = tokens.refreshToken;
      localStorage.setItem('user', JSON.stringify(user));
      return tokens;
    });
}

export const userService = {
  login,
  logout,
  register,
  getAll,
  getByName,
  update,
  delete: _delete,
  refreshToken
};
