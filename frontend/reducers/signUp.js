const defaultState = {
    body: {
        username: "",
        password: "",
        confirmPassword: ""
    },
    alerts: {
        error: "",
        success: ""
    },
    isSignedIn: false
};

export default (state = defaultState, action) => {
    switch(action.type) {
        case 'SIGN-UP/UPDATE-USERNAME':
            return {
                ...state,
                body: {
                    ...state.body,
                    username: action.username
                }
            };
        case 'SIGN-UP/UPDATE-PASSWORD':
            return {
                ...state,
                body: {
                    ...state.body,
                    password: action.password
                }
            };
        case 'SIGN-UP/UPDATE-CONFIRM-PASSWORD':
            return {
                ...state,
                body: {
                    ...state.body,
                    confirmPassword: action.confirmPassword
                }
            };
        case 'SIGN-UP/ERROR':
            return {
                ...state,
                alerts: {
                    ...defaultState.alerts,
                    error: action.error
                }
            };
        case 'SIGN-UP/SUCCESS':
            localStorage.setItem('isSignedIn', true);  // Store signed-in status in local storage for session persistence across page reloads
            return {
                ...state,
                alerts: {
                    ...defaultState.alerts,
                    success: action.success
                },
                isSignedIn: true
            };
        case 'SIGN-UP/CLEAR-ALERTS':
            return {
                ...state,
                alerts: {
                    ...defaultState.alerts
                }
            };
        case 'SIGN-UP/CLEAR':
            localStorage.removeItem('isSignedIn');  // Remove signed-in status on clear
            return {
                ...defaultState
            };
        default:
            return state;
    }
};