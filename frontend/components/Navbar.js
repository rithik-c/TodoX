import React from 'react';
import styled from 'styled-components';
import { Colours } from '../definitions';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { clearSignIn } from '../actions/signIn';
import apiFetch from '../functions/apiFetch';
import Button from './Button';

const Navbar = ({className}) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const isLoggedIn = useSelector((state) => (state.signIn.isSignedIn === true || state.signUp.isSignedIn === true));

    const handleLogout = async () => {
        try {
            await apiFetch('/user/session', { method: 'DELETE' });
            dispatch(clearSignIn());
            router.push('/signin');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <Header className={className}>
            <div className="headerContents">
                <Link href="/">
                    <img className="headerLogo" src="/img/todox-logo-white.svg" />
                </Link>
                {isLoggedIn && (
                    <LogoutButton text="Sign Out" variant="sec" size="small" onClick={handleLogout}></LogoutButton>
                )}
            </div>
        </Header>
    );
}

export default Navbar;

const Header = styled.header`
    align-items: center;
    background: ${Colours.NAVIGATION_BAR};
    box-sizing: border-box;
    display: flex;
    height: 4rem;
    padding: 1rem 2.25rem;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;

    .headerContents {
        display: flex;
        flex-grow: 1;
        align-items: center;
    }

    .headerLogo {
        height: 4.6875rem;
        width: 8.4375rem;
    }
`;

const LogoutButton = styled(Button)` // Extends the Button component for reusability
    margin-left: auto;
`;
