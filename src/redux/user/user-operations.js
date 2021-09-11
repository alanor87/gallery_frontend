import axios from 'axios';
import {
    loginRequest,
    loginSuccess,
    loginError,
    logoutRequest,
    logoutSuccess,
    logoutError,
    registerRequest,
    registerSuccess,
    registerError,
    getCurrentUserRequest,
    getCurrentUserSuccess,
    getCurrentUserError,
} from './user-actions';

export const login = () => dispatch => {
    dispatch(loginRequest);
    axios.get()
        .then(response => response.data)
        .then(data => dispatch(loginSuccess(data)))
        .catch(error => dispatch(loginError(error.message)))
}

export const logout = () => dispatch => {
    dispatch(logoutRequest);
    axios.get()
        .then(response => response.data)
        .then(data => dispatch(logoutSuccess(data)))
        .catch(error => dispatch(logoutError(error.message)))
}

export const register = () => dispatch => {
    dispatch(registerRequest);
    axios.get()
        .then(response => response.data)
        .then(data => dispatch(registerSuccess(data)))
        .catch(error => dispatch(registerError(error.message)))
}

export const getCurrentUser = () => dispatch => {
    dispatch(getCurrentUserRequest);
    axios.get()
        .then(response => response.data)
        .then(data => dispatch(getCurrentUserSuccess(data)))
        .catch(error => dispatch(getCurrentUserError(error.message)))
}


