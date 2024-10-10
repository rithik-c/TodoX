import React, { useState } from 'react';
import styled from 'styled-components';
import { Colours } from '../definitions';

const Toggle = ({onToggle, defaultState}) => {
    const [isOn, setIsOn] = useState(defaultState || false);

    const handleToggle = () => {
        setIsOn((prevState) => !prevState);
        
        if(onToggle) {
            onToggle(); // Allows parent component to overrride the default toggle behaviour
        }
    };

    return (
        <ToggleContainer isOn={isOn} onClick={handleToggle}>
            <Slider isOn={isOn} />
        </ToggleContainer>
    );
};

export default Toggle;

const ToggleContainer = styled.div`
    width: 50px;
    height: 25px;
    background-color: ${({ isOn }) => (isOn ? `${Colours.ACCENT_2}` : `${Colours.PRIMARY_DARK}`)};
    border-radius: 25px;
    position: relative;
    cursor: pointer;
    transition: all 0.3s;
`;

const Slider = styled.div`
    position: absolute;
    top: 2px;
    left: ${({ isOn }) => (isOn ? '26px' : '2px')};
    width: 21px;
    height: 21px;
    background-color: white;
    border-radius: 50%;
    transition: all 0.3s;
`;
