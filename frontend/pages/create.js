import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { Colours, Typography } from '../definitions';
import Button from '../components/Button';
import PageLayout from '../components/PageLayout';
import { clearTodoAlerts, clearTodoBody, updateTodoError, updateTodoName, updateTodoSuccess } from '../actions/todo';
import Form from '../components/Form';
import InputField from '../components/InputField';
import apiFetch from '../functions/apiFetch';
import { useDispatch, useSelector } from 'react-redux';
import Alert from '../components/Alert';
import Link from 'next/link';


const Create = () => {
    const [isSaving, setIsSaving] = useState(false);
    const todoState = useSelector((state) => state.todo);
    const isDark = useSelector((state) => state.colourScheme.isDarkMode);
    const inputRef = useRef(null);
    const dispatch = useDispatch();

    // Automatically Focused the input field when the component mounts (also updated inputField component to accept ref)
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    // Added useEffect to clear alerts when the component mounts (since the alert previously persisted when navigating away and back to create page)
    useEffect(() => {
        dispatch(clearTodoAlerts());
    }, [dispatch]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (todoState.body.name) {
            setIsSaving(true);
            dispatch(clearTodoAlerts());
            let response = await apiFetch("/todo", {
                body: todoState.body, 
                method: "POST"
            });
            setIsSaving(false);
            if (response.status === 201) {
                dispatch(updateTodoSuccess({ success: `Todo "${todoState.body.name}" saved successfully` }));
                dispatch(clearTodoBody());
            }
            else {
                dispatch(updateTodoError({ error: response.body.error }));
            }
        }
    };

    return (
        <PageLayout title="Create todo">
            <Container isDark={isDark}>
                <div className="content">
                    <h1>Create todo</h1>
                    <Alert message={todoState.alerts.error} onClose={() => dispatch(clearTodoAlerts())} />
                    <Alert message={todoState.alerts.success} onClose={() => dispatch(clearTodoAlerts())} variant="success" />
                    <Form onSubmit={handleSubmit}>
                        <InputField className="input" type="text" placeholder="Todo item name" required value={todoState.body.name} ref={inputRef} onChange={e => dispatch(updateTodoName({name: e.target.value}))} />
                        {/* Chose to use a styled div for ButtonContainer to match current coding style and modify the button css and placement */}
                        <ButtonContainer>
                            <Link className="maxWidthCenter" href="/">
                                <Button text="Back" size="large" variant={isDark? "light" : "secondary"} isFullWidth/>
                            </Link>
                            {/* Created a back button for easier navigation. */}
                            <Button className="maxWidthCenter" type="submit" text="Save" size="large" variant="primary" disabled={isSaving || !todoState.body.name} isFullWidth />
                        </ButtonContainer>
                    </Form>
                </div>
            </Container>
        </PageLayout>
    );
};

export default Create;

const Container = styled.div`
    width: 100%;

    .content {
        h1 {
            color: ${({ isDark }) => (isDark ? Colours.WHITE : Colours.BLACK)};
            font-size: ${Typography.HEADING_SIZES.M};
            font-weight: ${Typography.WEIGHTS.LIGHT};
            line-height: 2.625rem;
            margin-bottom: 2rem;
            margin-top: 1rem;
            transition: all 0.3s;
        }
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 1.5rem;
    gap: 1rem;
    width: 90%;
    margin-left: auto;
    margin-right: auto;

    .maxWidthCenter {
        text-decoration: none;
        flex: 1;
    }
`;
