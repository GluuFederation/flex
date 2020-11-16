/**
 * Auth Reducers
 */
import {
    GET_OAUTH2_CONFIG,
    GET_OAUTH2_CONFIG_RESPONSE,
} from '../actions/types';

/**
 * initial auth user
 */
const INIT_STATE = {
    loading: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {

        case GET_OAUTH2_CONFIG:
            return { ...state, loading: true };
        case GET_OAUTH2_CONFIG_RESPONSE:
            return { ...state, loading: false, config: action.payload.config };

        default: return { ...state };
    }
}
