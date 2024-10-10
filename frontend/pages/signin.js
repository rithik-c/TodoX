import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import { Colours, Typography } from '../definitions';
import { updateSignInUsername, updateSignInPassword, updateSignInError, updateSignInSuccess, clearSignInAlerts, clearSignIn } from '../actions/signIn';
import apiFetch from '../functions/apiFetch';
import Form from '../components/Form';
import InputField from '../components/InputField';
import Button from '../components/Button';
import PageLayout from '../components/PageLayout';
import Alert from '../components/Alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const SignIn = () => {
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const signInState = useSelector((state) => state.signIn);
    const isDark = useSelector((state) => state.colourScheme.isDarkMode);
    const dispatch = useDispatch();
    const router = useRouter();

    // Ensuring the component is fully mounted before rendering dynamic content (password toggle icon) 
    // This avoids server-side rendering mismatch issues, especially with Next.js, where the initial render occurs on the server
    useEffect(() => {
        setIsMounted(true);
        dispatch(clearSignIn());
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (signInState.body.username && signInState.body.password) {
            setIsSigningIn(true);
            dispatch(clearSignInAlerts());
            let response = await apiFetch("/user/session", {
                body: signInState.body, 
                method: "POST"
            });
            if (response.status === 200) {
                dispatch(clearSignIn());
                dispatch(updateSignInSuccess({ success: "Sign in successful, redirecting..." }));
                router.push("/");
            }
            else {
                dispatch(updateSignInError({ error: response.body.error }));
                setIsSigningIn(false);
            }
        }
    };

    return (
        <PageLayout title="Sign in">
            <Container isDark={isDark}>
                <div className="content">
                    <h1>Sign In</h1>
                    <Alert message={signInState.alerts.error} onClose={() => dispatch(clearSignInAlerts())} />
                    <Alert message={signInState.alerts.success} onClose={() => dispatch(clearSignInAlerts())} variant="success" />
                    <Form onSubmit={handleSubmit}>
                        <InputField className="input" type="text" placeholder="Username" required value={signInState.body.username} onChange={e => dispatch(updateSignInUsername({username: e.target.value}))} />
                        <InputField className="input" type={showPassword ? "text" : "password"} placeholder="Password" required value={signInState.body.password} onChange={e => dispatch(updateSignInPassword({password: e.target.value}))} 
                                    icon={isMounted && signInState.body.password !== "" && <FontAwesomeIcon className="passwordToggle" icon={showPassword ? "fa-eye-slash" : "fa-eye"} style={{ width: (showPassword? '1.5rem' : '1.25rem')}} onClick={() => setShowPassword(prev => !prev)} /> }/>
                        <Button className="loginButton" type="submit" text="Sign in" size="large" variant="primary" disabled={isSigningIn} isFullWidth />
                    </Form>
                </div>
                <Footer isDark={isDark}>
                    <p>Don't have an account?  <Link className="highlightedLink" href="/signup">Sign up</Link></p>
                </Footer>
            </Container>
        </PageLayout>
    );
};

export default SignIn;

const Container = styled.div`
    width: 100%;

    h1 {
        color: ${({ isDark }) => (isDark ? Colours.BLACK : Colours.WHITE)};
        font-size: ${Typography.HEADING_SIZES.M};
        font-weight: ${Typography.WEIGHTS.LIGHT};
        line-height: 2.625rem;
        margin-bottom: 2rem;
        margin-top: 1rem;
        transition: all 0.3s;
    }

    .input {
        margin-bottom: 0.5rem;
    }

    .loginButton {
        margin-top: 1.5rem;
        margin-bottom: 0.25rem;
    }

    .signUpOptions {
        margin-bottom: 2rem;

        .signUpOption {
            margin-bottom: 0.5rem;
        }
    }

    .passwordToggle {
        position: relative;
        cursor: pointer;
        color: ${Colours.GRAY_DARKER};
    }
`;

const Footer = styled.div`
    padding: 1rem 0rem;
    text-align: center;

    p {
        font-size: ${Typography.BODY_SIZES.L};
        font-weight: ${Typography.WEIGHTS.MEDIUM};
        color: ${({ isDark }) => (isDark ? Colours.BLACK : Colours.GRAY_DARK)};
        transition: all 0.3s;

        .highlightedLink {
            color: ${Colours.ACCENT_1};
        }
    }
`;