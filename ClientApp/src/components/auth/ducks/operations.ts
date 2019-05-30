import { IUser } from "../types";

const config = { apiUrl: process.env.REACT_APP_API };

function authHeader(): Headers {
    // return authorization header with jwt token
    let user = JSON.parse(localStorage.getItem('user') || '{}');

    if (user && user.token) {
        return { 'Authorization': 'Bearer ' + user.token } as any;
    } else {
        return {} as any;
    }
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

            const error = (data && data.message) || response.statusText;
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

    return fetch(`${config.apiUrl}/api/states`, requestOptions).then(handleResponse);
}

function getById(id: number) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/users/${id}`, requestOptions).then(handleResponse);
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

    return fetch(`${config.apiUrl}/users/${user.id}`, requestOptions).then(handleResponse);;
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id: number) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/users/${id}`, requestOptions).then(handleResponse);
}

export const userService = {
    login,
    logout,
    register,
    getAll,
    getById,
    update,
    delete: _delete
};
