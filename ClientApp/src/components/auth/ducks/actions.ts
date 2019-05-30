import { userTypes } from './types';
import { userService } from './operations';
import { IUser } from '../types';
import * as alertActions from '../../alert/ducks/actions';
import { history } from '../../../history';

function login(username: string, password: string) {
    function request(user: any) { return { type: userTypes.LOGIN_REQUEST, user } }
    function success(user: any) { return { type: userTypes.LOGIN_SUCCESS, user } }
    function failure(error: any) { return { type: userTypes.LOGIN_FAILURE, error } }

    return (dispatch: any) => {
        dispatch(request({ username }));

        userService.login(username, password)
            .then(
                user => {
                    dispatch(success(user));
                    history.push('/');
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };
}

function logout() {
    userService.logout();
    return { type: userTypes.LOGOUT };
}

function register(user: IUser) {
    function request(user: any) { return { type: userTypes.REGISTER_REQUEST, user } }
    function success(user: any) { return { type: userTypes.REGISTER_SUCCESS, user } }
    function failure(error: any) { return { type: userTypes.REGISTER_FAILURE, error } }

    return (dispatch: any) => {
        dispatch(request(user));

        userService.register(user)
            .then(
                user => {
                    dispatch(success(user));
                    history.push('/login');
                    dispatch(alertActions.success('Registration successful'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };
}

function getAll() {
    function request() { return { type: userTypes.GETALL_REQUEST } }
    function success(users: any) { return { type: userTypes.GETALL_SUCCESS, users } }
    function failure(error: any) { return { type: userTypes.GETALL_FAILURE, error } }

    return (dispatch: any) => {
        dispatch(request());

        userService.getAll()
            .then(
                (users: any) => dispatch(success(users)),
                (error: any) => dispatch(failure(error.toString()))
            );
    };
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id: number) {
    function request(id: number) { return { type: userTypes.DELETE_REQUEST, id } }
    function success(id: number) { return { type: userTypes.DELETE_SUCCESS, id } }
    function failure(id: number, error: any) { return { type: userTypes.DELETE_FAILURE, id, error } }

    return (dispatch: any) => {
        dispatch(request(id));

        userService.delete(id)
            .then(
                (user: any) => dispatch(success(id)),
                (error: any) => dispatch(failure(id, error.toString()))
            );
    };
}

export const userActions = {
    login,
    logout,
    register,
    getAll,
    delete: _delete
};