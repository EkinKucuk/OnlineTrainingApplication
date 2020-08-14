import config from '../config';

import axios from 'axios'
import setAuthToken  from '../helpers/setAuthToken';
export const userService = {
    logout,
};


function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('jwtToken');
    setAuthToken(false);
}

