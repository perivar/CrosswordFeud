// ducks/operations.ts
// Here, we define any logic surrounding our actions and side effects, including async logic. 
// If an action has no surrounding logic, then we simply forward them as is

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

function handleResponse(response: any) {
    return response.text().then((text: any) => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                window.location.reload(true);
            }

            // extract error message and convert to sring
            const error = (data && data.errors && data.errors.map((a: any) => a.description).join(' ')) || (data && data.title) || data || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}

function get() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    // return fetch("http://localhost:8000/api/crosswordguardian", requestOptions).then(handleResponse);    
    return fetch(`${config.apiUrl}/api/crosswordguardian`, requestOptions).then(handleResponse);
}

export const crosswordService = {
    get
};
