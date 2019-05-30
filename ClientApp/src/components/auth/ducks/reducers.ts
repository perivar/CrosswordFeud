import { userTypes } from './types';
import { IAuthState, IUserState, IUser } from "../types";

let user = JSON.parse(localStorage.getItem('user') || '{}') as IUser;

const initialAuthState: IAuthState = user ? { loggingIn: false, loggedIn: true, user: user } : { loggingIn: false, loggedIn: false, user: user };

const authenticationReducer = function authentication(state = initialAuthState, action: any) {
    switch (action.type) {
        case userTypes.LOGIN_REQUEST:
            return {
                loggingIn: true,
                user: action.user
            };
        case userTypes.LOGIN_SUCCESS:
            return {
                loggedIn: true,
                user: action.user
            };
        case userTypes.LOGIN_FAILURE:
            return {};
        case userTypes.LOGOUT:
            return {};
        default:
            return state
    }
}

const registrationReducer = function registration(state = {}, action: any) {
    switch (action.type) {
        case userTypes.REGISTER_REQUEST:
            return { registering: true };
        case userTypes.REGISTER_SUCCESS:
            return {};
        case userTypes.REGISTER_FAILURE:
            return {};
        default:
            return state
    }
}


const initialUserState: IUserState = { loading: false, items: [] };

const usersReducer = function users(state = initialUserState, action: any) {
    switch (action.type) {
        case userTypes.GETALL_REQUEST:
            return {
                loading: true
            };
        case userTypes.GETALL_SUCCESS:
            return {
                items: action.users
            };
        case userTypes.GETALL_FAILURE:
            return {
                error: action.error
            };
        case userTypes.DELETE_REQUEST:
            // add 'deleting:true' property to user being deleted
            return {
                ...state,
                items: state.items.map((user: any) =>
                    user.id === action.id
                        ? { ...user, deleting: true }
                        : user
                )
            };
        case userTypes.DELETE_SUCCESS:
            // remove deleted user from state
            return {
                items: state.items.filter((user: any) => user.id !== action.id)
            };
        case userTypes.DELETE_FAILURE:
            // remove 'deleting:true' property and add 'deleteError:[error]' property to user 
            return {
                ...state,
                items: state.items.map((user: any) => {
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
