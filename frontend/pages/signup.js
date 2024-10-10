import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import { Colours, Typography } from '../definitions';
import { clearSignUp, clearSignUpAlerts, updateSignUpConfirmPassword, updateSignUpError, updateSignUpPassword, updateSignUpSuccess, updateSignUpUsername } from '../actions/signUp';
import apiFetch from '../functions/apiFetch';
import Form from '../components/Form';
import InputField from '../components/InputField';
import Button from '../components/Button';
import PageLayout from '../components/PageLayout';
import Alert from '../components/Alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const SignUp = () => {
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const signUpState = useSelector((state) => state.signUp);
    const isDark = useSelector((state) => state.colourScheme.isDarkMode);
    const dispatch = useDispatch();
    const router = useRouter();

    // Ensuring the component is fully mounted before rendering dynamic content (password toggle icon) 
    // This avoids server-side rendering mismatch issues, especially with Next.js, where the initial render occurs on the server
    useEffect(() => {
        setIsMounted(true);
        dispatch(clearSignUp());
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!signUpState.body.username) {
            dispatch(updateSignUpError({ error: "You must choose a username" }));
        }
        else if (signUpState.body.password.length < 6) {
            dispatch(updateSignUpError({ error: "Your password must be at least 6 characters long" }));
        }
        else if (signUpState.body.confirmPassword !== signUpState.body.password) {
            dispatch(updateSignUpError({ error: "The passwords must match!" }));
        }
        else {
            setIsSigningUp(true);
            dispatch(clearSignUpAlerts());
            let response = await apiFetch("/user", {
                body: {
                    ...signUpState.body
                }, 
                method: "POST",
                includeCredentials: false
            });
            
            if (response.status === 201) {
                dispatch(clearSignUp());
                dispatch(updateSignUpSuccess({ success: "Account creation successful, redirecting..." })); // Corrected starter code typo

                router.replace("/");
            }
            else {
                setIsSigningUp(false);
                dispatch(updateSignUpError({ error: response.body.error }));
            }
        }
    };

    return (
        <PageLayout title="Sign up">
            <Container isDark={isDark}>
                <div className="content">
                    <h1>Sign up</h1>
                    <Alert message={signUpState.alerts.error} onClose={() => dispatch(clearSignUpAlerts())} />
                    <Alert message={signUpState.alerts.success} onClose={() => dispatch(clearSignUpAlerts())} variant="success" />
                    <Form onSubmit={handleSubmit}>
                        <InputField className="input" type="text" placeholder="Username" required value={signUpState.body.username} onChange={e => dispatch(updateSignUpUsername({username: e.target.value}))} />
                        <InputField className="input" type={showPassword ? "text" : "password"} placeholder="Password" required value={signUpState.body.password} onChange={e => dispatch(updateSignUpPassword({password: e.target.value}))} 
                                    icon={isMounted && signUpState.body.password !== "" && <FontAwesomeIcon className="passwordToggle" icon={showPassword ? "fa-eye-slash" : "fa-eye"} style={{ width: (showPassword? '1.5rem' : '1.25rem')}} onClick={() => setShowPassword(prev => !prev)} /> }/>
                        <InputField className="input" type={showPassword ? "text" : "password"} placeholder="Confirm password" required value={signUpState.body.confirmPassword} onChange={e => dispatch(updateSignUpConfirmPassword({confirmPassword: e.target.value}))} 
                                    icon={isMounted && signUpState.body.confirmPassword !== "" && <FontAwesomeIcon className="passwordToggle" icon={showPassword ? "fa-eye-slash" : "fa-eye"} style={{ width: (showPassword? '1.5rem' : '1.25rem')}} onClick={() => setShowPassword(prev => !prev)} /> }/>
                        <Button className="loginButton" type="submit" text="Sign up" size="large" variant="primary" disabled={isSigningUp} isFullWidth />
                    </Form>
                </div>
                <Footer isDark={isDark}>
                    <p>Already have an account?  <Link className="highlightedLink" href="/signin">Sign in</Link></p>
                </Footer>
            </Container>
        </PageLayout>
    );
};

export default SignUp;

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
        margin-bottom: 2.0625rem;
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
    padding: 1.5rem 0rem;
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