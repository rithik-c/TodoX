import { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Colours, Typography } from '../definitions';
import apiFetch from '../functions/apiFetch';
import { useDispatch } from "react-redux";
import { toggleTodoCompletion, renameTodo, deleteTodo } from "../actions/todoList";
import Button from './Button';

// Created a new Todo component (and added some new colours to Colours definitions) to enhance UI for Tabs component (rather than using a plain list item)
const Todo = ({todo, activeTab}) => {

    // Chose to use react-modal since I noticed it was already installed in the project so the previous developer was probably planning to use it
    const [modalIsOpen, toggleModal] = useState(false);
    const [inputValue, setInputValue] = useState(todo.name); // Local state for rename modal input field
    const [isVisible, setIsVisible] = useState(true); // Manage visibility for todo (for smooth animations)
    const [completionStyle, setCompletionStyle] = useState(todo.completed); // State to manage completion css styling (separate from redux global completion state, for local UI changes and easier implementation of css transitions)
    const inputRef = useRef(null); // Using ref to track current input field value
    const dispatch = useDispatch();

    useEffect(() => {
        if (modalIsOpen) {
            // Delay focusing the input to ensure inputRef component is rendered first
            const timer = setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }, 0); // Delay of 0 ms will push the focus to the end of the call stack
    
            // Cleanup function to clear the timeout if modal is closed before the timer runs
            return () => clearTimeout(timer);
        }
    }, [modalIsOpen]);

    // I initially had two separate API-callback/state-change functions for toggling completion and editing name for readability, but I combined them to reduce code redundancy and encourage reusability
    const updateTodo = async (updates) => {
        try {
            // I chose to use the PATCH method over PUT since I'm only partially updating the resource.
            const response = await apiFetch(`/todo/${todo.todoID}`, {
                method: "PATCH",
                body: updates
            });

            if (response.status === 200) {
                // Dispatch appropriate action based on which updates were made
                if (updates.completed !== undefined) {

                    setCompletionStyle(updates.completed); // Set completion style to true for smooth transition purposes

                    if (activeTab === "Incomplete") {
                        
                        setTimeout(() => {
                            setIsVisible(false); // Hide the todo after 1 second so there's enough time for transitions to run
                            setTimeout(() => {
                                // I Chose to code this in terms of toggling rather than a one-way 'completed' update so it can satisfy a second user story/purpose
                                dispatch(toggleTodoCompletion(todo.todoID)); // Update completion status in Redux store
                            }, 500);
                        }, 500);
                    } else {
                        dispatch(toggleTodoCompletion(todo.todoID));
                    }
                        
                    console.log("Updated completion status of todo:", todo.name);
                }
                if (updates.name !== undefined) {
                    dispatch(renameTodo(todo.todoID, updates.name)); // Dispatch action for name update
                    setInputValue(updates.name); // Setting default rename modal input field text only if API call was successful so state isnt out of sync if API call fails
                    console.log("Updated name of todo:", updates.name);
                }
            } else {
                console.error("Failed to update todo:", response.body);
            }
        } catch (error) {
            console.error("Error updating todo:", error);
        }
    };

    const removeTodo = async () => {
        try {
            const response = await apiFetch(`/todo/${todo.todoID}`, {
                method: "DELETE"
            });

            if (response.status === 204) {
                console.log("Deleted todo:", todo.name);
                setIsVisible(false); // Hide the todo after 1 second so there's enough time for fade out transition
                setTimeout(() => {
                    dispatch(deleteTodo(todo.todoID)); // Delete todo from Redux store
                }, 500);
            } else {
                console.error("Failed to delete todo:", response.body);
            }
        } catch (error) {
            console.error("Error deleting todo:", error);
        }
    };

    const handleSave = () => {
        const newName = inputRef.current.value; // Grab the current value of the input field through ref
        
        // I chose to update the todo only if the input value is different to prevent unnecessary API calls
        if (newName !== todo.name) updateTodo({name: newName});
        toggleModal(currentState => !currentState);
    };

    return (
        <Container completed={completionStyle} isVisible={isVisible}>
            <DeleteIcon onClick={removeTodo}>
                <FontAwesomeIcon className="delete-icon" icon={"fa-circle-xmark"} />
            </DeleteIcon>

            <p className="todoTitle">{todo.name}</p>
            <RightContainer>
                <Tag completed={completionStyle}>
                    <p className="tagText">{completionStyle ? "done" : "not done"}</p>
                </Tag>
                {/* Added icons for edit and delete to clean up UI */}
                <Icons>
                    {/* Chose to use shorthand method style for onClick rather than create two unnecessary functions for openModal and closeModal */}
                    {/* Also using a functional approach over direct to avoid stale states and prevent asynchronous syncing issues */}
                    <FontAwesomeIcon className="edit-icon" icon={"fa-pen-to-square"} onClick={() => toggleModal(currentState => !currentState)} />
                    <FontAwesomeIcon className="checkbox-icon" icon={completionStyle ? "fa-square-check" : "fa-square"} onClick={() => updateTodo({ completed: !todo.completed })} />
                </Icons>
            </RightContainer>

            <Modal isOpen={modalIsOpen} shouldCloseOnOverlayClick={true} onRequestClose={() => toggleModal(currentState => !currentState)} contentLabel="Edit Todo"
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'  // Dark overlay to help create focus
                },
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: `${Colours.ACCENT_2_LIGHT}`,
                    border: 'none',
                    borderRadius: '15px',
                    padding: '2rem',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                    width: '400px'
                }
            }}>
                <ModalContent>
                    <h2>Edit Todo</h2>
                    <StyledInput type="text" defaultValue={inputValue} ref={inputRef} placeholder="Enter new todo name" onKeyDown={(e) => {if (e.key === 'Enter') handleSave()}}/>
                    <ButtonContainer>
                        <Button text="Close" onClick={() => toggleModal(currentState => !currentState)} variant="neutral-light" size="large"/>
                        <Button text="Save" onClick={handleSave} variant="accent" size="large"/>
                    </ButtonContainer>
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default Todo;

const DeleteIcon = styled.div`
    position: absolute;
    top: -0.75rem;
    right: -0.75rem;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.1s ease;

    .delete-icon {
        color: ${Colours.ERROR_LIGHT_2};
        width: 1.5rem;
    }

    .delete-icon:hover {
        color: ${Colours.ERROR};
    }
`;

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: ${props => (props.completed ? `${Colours.ACCENT_1_LIGHT}` : `${Colours.ACCENT_1}`)};
    color: ${Colours.WHITE};
    padding: 0.9rem 1rem;
    border-radius: 15px;
    margin-bottom: 0.75rem;
    transition: background 0.5s ease, opacity 0.5s ease;
    opacity: ${props => (props.isVisible ? 1 : 0)};
    position: relative;

    &:hover ${DeleteIcon} {
        opacity: 1;
    }

    .todoTitle {
        margin: 0;
        color: ${props => (props.completed ? `${Colours.GRAY_DARK}` : `${Colours.WHITE}`)};
        
        position: relative;
        display: inline-block;

        &::after {
            content: '';
            position: absolute;
            left: 0;
            bottom: 0.45em;
            width: ${props => (props.completed ? '100%' : '0')};
            height: 2px;
            background-color: ${Colours.GRAY_DARK};
            transition: width 0.5s ease;
        }

    }
`;

const RightContainer = styled.div`
    display: flex;
    align-items: center;
`;

const Tag = styled.div`
    display: inline-block;
    padding: 0.3rem 0.75rem;
    border-radius: 12px;
    border: 1px solid ${props => (props.completed ? `${Colours.SUCCESS}` : `${Colours.ERROR}`)};
    background-color: ${props => (props.completed ? `${Colours.SUCCESS_LIGHTEST_2}` : `${Colours.ERROR_LIGHT}`)}; /* Background color based on completion */
    margin-right: 1rem;

    .tagText {
        color: ${props => (props.completed ? `${Colours.SUCCESS_NEON_2}` : `${Colours.ERROR_NEON}`)}; /* Text color based on completion */
    }
`;


const Icons = styled.div`
    display: flex;
    align-items: center;
    width: 3.5rem;
    
    .edit-icon,
    .checkbox-icon {
        cursor: pointer;
        margin-left: 0.5rem;
        color: ${Colours.WHITE};
    }
    
    .edit-icon:hover,
    .checkbox-icon:hover {
        color: ${Colours.ACCENT_1_LIGHTER};
    }
`;

const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    h2 {
        color: ${Colours.BLACK};
        font-size: ${Typography.HEADING_SIZES.XS};
        font-weight: ${Typography.WEIGHTS.SEMIBOLD};
    }
`;

const StyledInput = styled.input`
    padding: 0.75rem 1rem;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
    width: 100%;
    border: 1px solid ${Colours.GRAY};
    border-radius: 8px;
    font-size: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.2s ease;

    &:focus {
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
        outline: none;
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 2rem;

    Button {
        padding: 0rem 3rem;
    }
`;
