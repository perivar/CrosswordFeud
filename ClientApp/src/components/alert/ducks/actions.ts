import { alertTypes } from './types';

const success = (message: string) => ({
    type: alertTypes.SUCCESS,
    message
});

const error = (message: string) => ({
    type: alertTypes.ERROR,
    message
});

const clear = () => ({
    type: alertTypes.CLEAR
});

export {
    success,
    error,
    clear
};
