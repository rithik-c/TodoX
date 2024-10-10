import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { Colours } from '../definitions';
import Navbar from './Navbar';
import { useSelector } from 'react-redux';

const PageLayout = ({className, title, children}) => {

    // Determining the colour scheme based on the global state
    const isDark = useSelector((state) => state.colourScheme.isDarkMode);

    return (
        <Container className={className} isDark={isDark}>
            <Head>
                <title>{`${title} - TodoX`}</title>
                <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" /> 
            </Head>
            <Navbar />
            <div className="contentContainer">
                {children}
            </div>
        </Container>
    );
};

export default PageLayout;

const Container = styled.div`
    align-items: center;
    background-color: ${({ isDark }) => (isDark ? Colours.BLACK_LIGHTER_2 : Colours.GRAY_LIGHT)};
    display: flex;
    justify-content: center;
    min-height: 100vh;
    width: 100%;
    transition: all 0.3s;

    .contentContainer {
        background-color: ${({ isDark }) => (isDark ? Colours.BLACK_LIGHT_2 : Colours.WHITE)};
        border-radius: 1.5rem;
        flex-grow: 1;
        margin: 5rem 1.25rem 3rem 1.25rem;
        max-width: 37.5rem;
        padding: 1.5rem;
        text-align: center;
        transition: all 0.3s;
    }
`;