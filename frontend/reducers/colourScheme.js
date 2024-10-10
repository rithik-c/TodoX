const defaultState = {
    isDarkMode: false,
}

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'COLOUR-SCHEME/TOGGLE':
            localStorage.setItem('isDarkMode', !state.isDarkMode);  // Store dark mode status in local storage to keep preference across page reloads
            return {
                ...state,
                isDarkMode: !state.isDarkMode,
            };
        
        case 'COLOUR-SCHEME/SET':
            return {
                ...state,
                isDarkMode: action.isDark,
            };

        default:
            return state;
    }
};