const defaultState = {
    isDarkMode: false,
}

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'COLOUR-SCHEME/TOGGLE':
            return {
                ...state,
                isDarkMode: !state.isDarkMode,
            };

        default:
            return state;
    }
};