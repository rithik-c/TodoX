const defaultState = {
    body: {
        name: "",
        completed: false 
        /**
         * Added default value for new todos completion status for consistency but chose not to create new actions or reducer case to modify it.
         * This is because this todo state stored in redux is only used to track state of a newly created todo.
         * Thus, the completion status will never be anything but false in this stage.
         */
    },
    alerts: {
        error: "",
        success: ""
    }
};


export default (state = defaultState, action) => {
    switch(action.type) {
        case 'TODO/UPDATE-NAME':
            return {
                ...state,
                body: {
                    ...state.body,
                    name: action.name
                }
            };
        case 'TODO/ERROR':
            return {
                ...state,
                alerts: {
                    ...defaultState.alerts,
                    error: action.error
                }
            };
        case 'TODO/SUCCESS':
            return {
                ...state,
                alerts: {
                    ...defaultState.alerts,
                    success: action.success
                }
            };
        case 'TODO/CLEAR-ALERTS':
            return {
                ...state,
                alerts: {
                    ...defaultState.alerts
                }
            };
        case 'TODO/CLEAR-BODY':
            return {
                ...state,
                body: {
                    ...defaultState.body
                }
            };
        case 'TODO/CLEAR':
            return {
                ...defaultState
            };
        default:
            return state;
    }
};