// ducks/reducers.ts
// The reducer deals with updating the state.

import { UserActionTypes, UserActions } from './types';
import { IAuthState, IUserState, ILogon, IRegisterState, IUser } from "../types";
// import { Action } from 'redux';

let user = JSON.parse(localStorage.getItem('user') || '{}') as ILogon;

const initialAuthState: IAuthState = user ? { loggingIn: false, loggedIn: true, logon: user, logonUserName: '' } : { loggingIn: false, loggedIn: false, logon: user, logonUserName: '' };

const authenticationReducer = function authentication(state = initialAuthState, action: UserActions): IAuthState {
    switch (action.type) {
        case UserActionTypes.LOGIN_REQUEST:
            return {
                ...state,
                loggingIn: true,
                logonUserName: action.username
            };
        case UserActionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                loggedIn: true,
                logon: action.user
            };
        case UserActionTypes.LOGIN_FAILURE:
            return {
                ...state,
                loggingIn: false
            };
        case UserActionTypes.LOGOUT:
            return {
                ...state,
                loggingIn: false
            };
        default:
            return state
    }
}

const initialRegisterState: IRegisterState = { user: user.user, submitted: false };

const registrationReducer = function registration(state = initialRegisterState, action: UserActions): IRegisterState {
    switch (action.type) {
        case UserActionTypes.REGISTER_REQUEST:
            return {
                ...state,
                registering: true
            };
        case UserActionTypes.REGISTER_SUCCESS:
            return {
                ...state,
                registering: false
            };
        case UserActionTypes.REGISTER_FAILURE:
            return {
                ...state,
                registering: false
            };
        default:
            return state
    }
}


const initialUserState: IUserState = { loading: false, items: [], error: '' };

const usersReducer = function users(state = initialUserState, action: UserActions): IUserState {
    switch (action.type) {
        case UserActionTypes.GETALL_REQUEST:
            return {
                ...state,
                loading: true
            };
        case UserActionTypes.GETALL_SUCCESS:
            return {
                ...state,
                loading: false,
                items: action.users
            };
        case UserActionTypes.GETALL_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case UserActionTypes.DELETE_REQUEST:
            // add 'deleting:true' property to user being deleted
            return {
                ...state,
                items: state.items.map((user: IUser) =>
                    user.id === action.id
                        ? { ...user, deleting: true }
                        : user
                )
            };
        case UserActionTypes.DELETE_SUCCESS:
            // remove deleted user from state
            return {
                ...state,
                items: state.items.filter((user: IUser) => user.id !== action.id)
            };
        case UserActionTypes.DELETE_FAILURE:
            // remove 'deleting:true' property and add 'deleteError:[error]' property to user 
            return {
                ...state,
                items: state.items.map((user: IUser) => {
                    if (user.id === action.id) {
                        // make copy of user without 'deleting:true' property
                        const { deleting, ...userCopy } = user;
                        // return copy of user with 'deleteError:[error]' property
                        return { ...userCopy, deleteError: action.error };
                    }

                    return user;
                })
            };
        default:
            return state
    }
}

export default {
    authentication: authenticationReducer,
    registration: registrationReducer,
    users: usersReducer
};
