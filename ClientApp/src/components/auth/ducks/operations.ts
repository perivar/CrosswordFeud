// ducks/operations.ts
// Here, we define any logic surrounding our actions and side effects, including async logic.
// If an action has no surrounding logic, then we simply forward them as is

import { IUser } from '../types';

const config = { apiUrl: process.env.REACT_APP_API };

function authHeader(): Headers {
  // return authorization header with jwt token
  const user = JSON.parse(localStorage.getItem('user') || '{}');

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
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        logout();
        window.location.reload(true);
      }

      // extract error message and convert to sring
      const error =
        (data && data.errors && data.errors.map((a: any) => a.description).join(' ')) ||
        (data && data.title) ||
        data ||
        response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}

function login(username: string, password: string) {
  const requestOptions = {
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
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };

  return fetch(`${config.apiUrl}/api/Account/GetAll`, requestOptions).then(handleResponse);
}

function getByName(username: string) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };

  return fetch(`${config.apiUrl}/api/Account/GetByName/${username}`, requestOptions).then(handleResponse);
}

function register(user: IUser) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  };

  return fetch(`${config.apiUrl}/api/Account/Register`, requestOptions).then(handleResponse);
}

function update(user: IUser) {
  const requestOptions = {
    method: 'PUT',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  };

  return fetch(`${config.apiUrl}/api/Account/Update/${user.username}`, requestOptions).then(handleResponse);
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(username: string) {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader()
  };

  return fetch(`${config.apiUrl}/api/Account/Delete/${username}`, requestOptions).then(handleResponse);
}

export const userService = {
  login,
  logout,
  register,
  getAll,
  getByName,
  update,
  delete: _delete
};
