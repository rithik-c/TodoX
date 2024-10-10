const defaultState = {
    body: {
        username: "",
        password: ""
    },
    alerts: {
        error: "",
        success: ""
    },
    isSignedIn: false
};


export default (state = defaultState, action) => {
    switch(action.type) {
        case 'SIGN-IN/UPDATE-USERNAME':
            return {
                ...state,
                body: {
                    ...state.body,
                    username: action.username
                }
            };
        case 'SIGN-IN/UPDATE-PASSWORD':
            return {
                ...state,
                body: {
                    ...state.body,
                    password: action.password
                }
            };
        case 'SIGN-IN/ERROR':
            return {
                ...state,
                alerts: {
                    ...defaultState.alerts,
                    error: action.error
                }
            };
        case 'SIGN-IN/SUCCESS':
            localStorage.setItem('isSignedIn', true);  // Store signed-in status in local storage for session persistence across page reloads
            return {
                ...state,
                alerts: {
                    ...defaultState.alerts,
                    success: action.success
                },
                isSignedIn: true
            };
        case 'SIGN-IN/CLEAR-ALERTS':
            return {
                ...state,
                alerts: {
                    ...defaultState.alerts
                }
            };
        case 'SIGN-IN/CLEAR':
            localStorage.removeItem('isSignedIn');  // Remove signed-in status on clear
            return {
                ...defaultState
            };
        default:
            return state;
    }
};