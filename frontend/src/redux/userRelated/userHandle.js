import axios from 'axios';
import {
    authRequest,
    stuffAdded,
    authSuccess,
    authFailed,
    authError,
    authLogout,
    doneSuccess,
    getDeleteSuccess,
    getRequest,
    getFailed,
    getError,
} from './userSlice';
import { getAuthHeader } from '../../utils/authHeader';

const extractErrorMessage = (error) => {
    return (error && error.response && error.response.data && (error.response.data.message || error.response.data)) || error.message || 'Lỗi mạng';
}

export const loginUser = (fields, role) => async (dispatch) => {
    dispatch(authRequest());

    try {
        const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/${role}Login`, fields, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });
        const data = result.data || {};
        const user = data.user || data.admin || data.teacher || data.student || data;
        if (user && user.role) {
            dispatch(authSuccess(user));
        } else {
            dispatch(authFailed(data.message || 'Login failed'));
        }
    } catch (error) {
        dispatch(authError(extractErrorMessage(error)));
    }
};

export const getMe = () => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/Me`, {
            withCredentials: true
        });
        const data = result.data || {};
        const user = data.user;
        if (user && user.role) {
            dispatch(authSuccess(user));
        } else {
            dispatch(getFailed('Not authenticated'));
        }
    } catch (error) {
        dispatch(getError(extractErrorMessage(error)));
    }
};

export const registerUser = (fields, role) => async (dispatch) => {
    dispatch(authRequest());

    try {
        const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/${role}Reg`, fields, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });
        if (result.data.schoolName) {
            dispatch(authSuccess(result.data));
        }
        else if (result.data.school) {
            dispatch(stuffAdded());
        }
        else {
            dispatch(authFailed(result.data.message));
        }
    } catch (error) {
        dispatch(authError(extractErrorMessage(error)));
    }
};

export const logoutUser = () => async (dispatch) => {
    try {
        await axios.post(`${process.env.REACT_APP_BASE_URL}/Logout`, null, {
            withCredentials: true
        });
    } catch (error) {
        // ignore logout errors
    }
    dispatch(authLogout());
};

export const getUserDetails = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/${address}/${id}`, {
            withCredentials: true
        });
        if (result.data) {
            dispatch(doneSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(extractErrorMessage(error)));
    }
}

// export const deleteUser = (id, address) => async (dispatch) => {
//     dispatch(getRequest());

//     try {
//         const result = await axios.delete(`${process.env.REACT_APP_BASE_URL}/${address}/${id}`);
//         if (result.data.message) {
//             dispatch(getFailed(result.data.message));
//         } else {
//             dispatch(getDeleteSuccess());
//         }
//     } catch (error) {
//         dispatch(getError(error));
//     }
// }


export const deleteUser = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.delete(`${process.env.REACT_APP_BASE_URL}/${address}/${id}`, {
            headers: { ...getAuthHeader() },
            withCredentials: true
        });
        if (result.data && result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getDeleteSuccess());
        }
    } catch (error) {
        dispatch(getError(extractErrorMessage(error)));
    }
}

export const updateUser = (fields, id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.put(`${process.env.REACT_APP_BASE_URL}/${address}/${id}`, fields, {
            headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
            withCredentials: true
        });
        const updated = result.data;
        if (updated && updated.schoolName) {
            dispatch(authSuccess(updated));
        } else {
            dispatch(doneSuccess(updated));
        }
    } catch (error) {
        dispatch(getError(extractErrorMessage(error)));
    }
}

export const addStuff = (fields, address) => async (dispatch) => {
    dispatch(authRequest());

    try {
        const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/${address}Create`, fields, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });

        if (result.data.message) {
            dispatch(authFailed(result.data.message));
        } else {
            dispatch(stuffAdded(result.data));
        }
    } catch (error) {
        dispatch(authError(extractErrorMessage(error)));
    }
};
