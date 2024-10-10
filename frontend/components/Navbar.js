import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Colours } from '../definitions';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { clearSignIn } from '../actions/signIn';
import { toggleColourScheme } from '../actions/colourScheme';
import apiFetch from '../functions/apiFetch';
import Button from './Button';
import Toggle from './Toggle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Navbar = ({className}) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const isLoggedIn = useSelector((state) => (state.signIn.isSignedIn === true || state.signUp.isSignedIn === true));
    const [isClient, setIsClient] = useState(false); // State to track whether we're rendering on the client-side

    useEffect(() => {
        setIsClient(true);  // Setting render state true once the component is mounted on the client
    }, []);

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
                <ActionContainer>
                    {isClient && (
                        <>
                            <FontAwesomeIcon className="sun-icon" icon={"fa-sun"} />
                            <Toggle onToggle={() => dispatch(toggleColourScheme())} />
                            <FontAwesomeIcon className="moon-icon" icon={"fa-moon"} />
                        </>
                    )}
                    {isLoggedIn && (
                        <LogoutButton text="Sign Out" variant="sec" size="small" onClick={handleLogout}></LogoutButton>
                    )}
                </ActionContainer>
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

const ActionContainer = styled.div`
    margin-left: auto;
    display: flex;
    align-items: center;

    .sun-icon {
        color: ${Colours.PRIMARY_DARK};
        margin-right: 0.5rem;
        font-size: 1rem;
        width: 1.25rem;
    }

    .moon-icon {
        color: ${Colours.ACCENT_2};
        margin-left: 0.5rem;
        font-size: 1.25rem;
        width: 1.25rem;
    }
`;

const LogoutButton = styled(Button)`
    margin-left: 2rem;
`;
