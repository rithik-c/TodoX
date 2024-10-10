// COLOUR-SCHEME/TOGGLE
export const toggleColourScheme = () => ({
    type: 'COLOUR-SCHEME/TOGGLE'
});

// COLOUR-SCHEME/SET
export const setColourScheme = ({isDark = false}) => ({
    type: 'COLOUR-SCHEME/SET',
    isDark
});