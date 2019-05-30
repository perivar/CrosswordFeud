export interface IHomeProps {
    users: IUserState,
    user: IUser,
    getUsers: () => void,
    delete: (id: number) => void
}

export interface ILoginProps {
    username: string,
    password: string,
    submitted: boolean,
    loggingIn: boolean,
    login: (username: string, password: string) => void,
    logout: () => void
}

export interface IRegisterProps {
    register: (user: IUser) => void,
    registering: boolean
}

export interface IRootState {
    users: IUserState,
    authentication: IAuthState
}

export interface IUserState {
    items: IUser[],
    loading: boolean
}

export interface IAuthState {
    loggingIn: boolean,
    loggedIn: boolean,
    user: IUser
}

export interface IUser {
    id: number,
    firstName: string,
    lastName: string,
    error: boolean,
    deleting: boolean,
    deleteError: string
}
