import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import Head from 'next/head';
import configureStore from '../store/configureStore';
import Modal from 'react-modal';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPenToSquare, faSquare, faSquareCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

// Setting up icons for use in the app
library.add(faPenToSquare, faSquare, faSquareCheck, faCircleXmark);

// This default export is required in a new `pages/_app.js` file.
export default function App({ Component, pageProps }) {
    const store = configureStore();

    // Set the modal's app element to the Next.js root div for accessibility purposes (so screenreaders don't read the rest of the page)
    useEffect(() => {
        Modal.setAppElement('#__next');
    }, []);

    return (
        <Provider store={store}>
            <Head>
                <link rel="apple-touch-icon" sizes="76x76" href="/img/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/img/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/img/favicon-16x16.png" />
                <link rel="shortcut icon" href="/img/favicon.ico" />
                <meta name="theme-color" content="#000000" />
            </Head>
            <Component {...pageProps} />
        </Provider>
    );
};