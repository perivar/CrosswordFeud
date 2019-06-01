export interface IHomeProps {
    users: IUserState,
    logon: ILogon,
    getAll: () => void,
    delete: (id: string) => void
}

export interface ILoginProps {
    username: string,
    password: string,
    submitted: boolean,
    loggingIn: boolean,
    login: (username: string, password: string) => void,
    logout: () => void
}

export interface ILoginState {
    username: string,
    password: string,
    submitted: boolean
}

export interface IRegisterProps {
    register: (user: IUser) => void,
    registering: boolean,
    submitted: boolean
}

export interface IRegisterState {
    user: IUser,
    submitted: boolean
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
    logon: ILogon
}

export interface IUser {
    id: string,
    userName: string,
    password: string,
    email: string,
    phoneNumber: string,
    error?: boolean,
    deleting?: boolean,
    deleteError?: string
}

export interface IClaim {
    issuer: string,
    originalIssuer: string,
    properties: any,
    subject: string,
    type: string,
    value: string,
    valueType: string
}

export interface ILogon {
    user: IUser,
    claims: IClaim[],
    token: string
}

