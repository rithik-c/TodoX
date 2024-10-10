import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { Colours, Typography } from '../definitions';
import { useSelector } from 'react-redux';

// Custom styled input fields, use the "type" prop to control which HTML input type is rendered
const InputField = forwardRef(({className, type, value, label, placeholder, size="medium", variant="neutral", disabled=false, icon, ...otherProps}, ref) => {

    const isDark = useSelector((state) => state.colourScheme.isDarkMode);

    return (
        <Container className={className} type={type} size={size} variant={variant} disabled={disabled} isDark={isDark}>
            <label className="formLabel">
                {
                    label &&
                    <div className="labelContainer">{label && <span className="labelText">{label}</span>}</div>
                }
                <div className="inputContainer">
                    {
                        (type === "textarea" &&
                        <textarea className="formField" value={value} disabled={disabled} placeholder={placeholder} ref={ref} {...otherProps} />)
                        ||
                        (<input className={`formField`} type={type} value={value} disabled={disabled} placeholder={placeholder} ref={ref} {...otherProps} />)
                    }
                    {icon && <div className="iconContainer">{icon}</div>}
                </div>
            </label>
        </Container>
    );
});

export default InputField;

const Container = styled.div`
    .formField {
        background-color: ${Colours.TRANSPARENT};
        border: none;
        box-sizing: border-box;
        flex-grow: 1;
        font-family: ${Typography.FONTS.BODY};
        font-size: ${Typography.BODY_SIZES.L};
        font-weight: ${Typography.WEIGHTS.MEDIUM};
        padding: 0;
        width: 100%;
        transition: all 0.3s;
        ${(props) => {
            if (props.type !== "textarea") {
                if (props.size === "large") {
                    return `
                        height: 2rem;
                    `;
                }
                else if (props.size === "medium" || props.size === "small") {
                    return `
                        height: 1.5rem;
                    `;
                }
            }
            else {
                return `
                    padding: 0.625rem 1rem;
                `;
            }
        }}
        ${(props) => {
            if (props.variant === "neutral-dark") {
                return `color: ${Colours.WHITE_LIGHT};`;
            }
            else if (props.variant === "translucent") {
                return `
                    color: ${Colours.WHITE};
                `;
            }
            else {
                return `color: ${props.isDark ? Colours.GRAY_DARK : Colours.BLACK};`;
            }
        }}
    }
    .formField:focus-visible {
        outline: none;
    }
    ${(props) => {
        return `
            .formField::placeholder {
                color: ${props.isDark ? Colours.GRAY_DARKER : Colours.BLACK_LIGHTEST_2};
                opacity: 1;
            }
            .formField:-ms-input-placeholder {
                color: ${props.isDark ? Colours.GRAY_DARKER : Colours.BLACK_LIGHTEST_2};
            }
            .formField::-ms-input-placeholder {
                color: ${props.isDark ? Colours.GRAY_DARKER : Colours.BLACK_LIGHTEST_2};          
            }
        `;
    }}
    
    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    /* Firefox */
    input[type=number] {
        -moz-appearance: textfield;
    }
    .formLabel {
        font-size: ${Typography.BODY_SIZES.XS};
        font-weight: ${Typography.WEIGHTS.MEDIUM};

        ${(props) => {
            if (props.variant === "neutral-dark") {
                return `color: ${Colours.WHITE_LIGHTEST_2};`;
            }
            else {
                return `color: ${Colours.BLACK_LIGHTEST_2};`;
            }
        }}
    }
    .labelText {
        color: ${Colours.BLACK_LIGHT};
        font-size: ${Typography.BODY_SIZES.L};
        font-weight: ${Typography.WEIGHTS.BOLD};
        line-height: 1.25rem;
    }
    .labelContainer {
        align-items: center;
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.75rem;
    }
    .inputContainer {
        align-items: center;
        border-radius: 0.75rem;
        display: flex;
        overflow: hidden;
        ${(props) => {
            if (props.type !== "textarea") {
                if (props.size === "large" || props.size === "medium") {
                    return `
                        padding: 0.625rem 1rem;
                    `;
                }
                else if (props.size === "small") {
                    return `
                        padding: 0.375rem 1rem;
                    `;
                }
            }
        }}
        ${(props) => {
            // If disabled
            if (props.disabled) {
                return `
                    background-color: ${props.isDark ? Colours.GRAY_DARKEST : Colours.GRAY_LIGHTER};
                    border: 1px solid ${props.isDark ? Colours.GRAY_DARKEST : Colours.GRAY_LIGHT};
                    color: ${props.isDark ? Colours.BLACK_LIGHTEST_2 : Colours.BLACK_LIGHTEST_2};
                    transition: all 0.3s;
                `;
            }
            else {
                return `
                    background-color: ${props.isDark ? Colours.BLACK_LIGHTER_2 : Colours.BLACK_LIGHTEST_0};
                    border: none;
                    transition: all 0.3s;
                `;
            }
        
        }}
    }

    .iconContainer {
        position: relative;
        cursor: pointer;
    }
`;