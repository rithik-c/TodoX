import { useState, useRef } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faSquare, faSquareCheck } from '@fortawesome/free-solid-svg-icons'
import { Colours, Typography } from '../definitions';
import apiFetch from '../functions/apiFetch';
import { useDispatch } from "react-redux";
import { toggleTodoCompletion, renameTodo } from "../actions/todoList";

// Created a new Todo component (and added some new colours to Colours definitions) to enhance UI for Tabs component (rather than using a plain list item)
const Todo = ({todo}) => {

    // Chose to use react-modal since I noticed it was already installed in the project so the previous developer was probably planning to use it
    const [modalIsOpen, toggleModal] = useState(false);
    const [inputValue, setInputValue] = useState(todo.name); // Local state for rename modal input field
    const inputRef = useRef(null); // Use ref to track current input field value
    const dispatch = useDispatch();

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
                    // I Chose to code this in terms of toggling rather than a one-way 'completed' update so it can satisfy a second user story/purpose
                    dispatch(toggleTodoCompletion(todo.todoID)); // Update completion status in Redux store
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

    const handleSave = () => {
        const newName = inputRef.current.value; // Grab the current value of the input field through ref
        
        // I chose to update the todo only if the input value is different to prevent unnecessary API calls
        if (newName !== todo.name) updateTodo({name: newName});
        toggleModal(currentState => !currentState);
    };
    

    return (
        <Container completed={todo.completed}>
            <p className="todoTitle">{todo.name}</p>
            <RightContainer>
                <Tag completed={todo.completed}>
                    <p className="tagText">{todo.completed ? "done" : "not done"}</p>
                </Tag>
                {/* Added icons for edit and delete to clean up UI */}
                <Icons>
                    {/* Chose to use shorthand method style for onClick rather than create two unnecessary functions for openModal and closeModal */}
                    {/* Also using a functional approach over direct to avoid stale states and prevent asynchronous syncing issues */}
                    <FontAwesomeIcon className="edit-icon" icon={faPenToSquare} onClick={() => toggleModal(currentState => !currentState)} />
                    <FontAwesomeIcon className="delete-icon" icon={todo.completed ? faSquareCheck : faSquare} onClick={() => updateTodo({ completed: !todo.completed })} />
                </Icons>
            </RightContainer>

            <Modal 
                isOpen={modalIsOpen} 
                onRequestClose={() => toggleModal(currentState => !currentState)} 
                contentLabel="Edit Todo"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'  // Dark overlay to create focus
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
                        width: '400px',  // Adjust width for better visual fit
                    }
                }}
            >
                <ModalContent>
                    <h2>Edit Todo</h2>
                    <StyledInput 
                        type="text" 
                        defaultValue={inputValue} 
                        ref={inputRef} 
                        placeholder="Enter new todo name"
                    />
                    <ButtonContainer>
                        <StyledButton onClick={() => toggleModal(currentState => !currentState)}>Close</StyledButton>
                        <StyledButton primary onClick={handleSave}>Save</StyledButton>
                    </ButtonContainer>
                </ModalContent>
            </Modal>


        </Container>
    );
};

export default Todo

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: ${props => (props.completed ? `${Colours.ACCENT_1_LIGHT}` : `${Colours.ACCENT_1}`)};
    color: ${Colours.WHITE};
    padding: 0.9rem 1rem;
    border-radius: 15px;
    margin-bottom: 0.75rem;

    .todoTitle {
        margin: 0;
        color: ${props => (props.completed ? `${Colours.GRAY_DARK_2}` : `${Colours.WHITE}`)};
        text-decoration: ${props => (props.completed ? 'line-through' : 'none')};
    }
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Tag = styled.div`
    display: inline-block; /* Ensures the tag is the size of its content */
    padding: 0.3rem 0.75rem; /* Adds space around the text */
    border-radius: 12px; /* Rounds the corners */
    border: 1px solid ${props => (props.completed ? `${Colours.SUCCESS}` : `${Colours.ERROR}`)}; /* Adds an outline */
    background-color: ${props => (props.completed ? `${Colours.SUCCESS_LIGHTEST_2}` : `${Colours.ERROR_LIGHT}`)}; /* Background color based on completion */
    margin-right: 1rem; /* Space between the tag and icons */

    .tagText {
        color: ${props => (props.completed ? `${Colours.SUCCESS_NEON_2}` : `${Colours.ERROR_NEON}`)}; /* Text color based on completion */
    }
`;


const Icons = styled.div`
    align-items: center;
    
    .edit-icon,
    .delete-icon {
        cursor: pointer;
        margin-left: 0.75rem;
        color: ${Colours.WHITE};
    }
    
    .edit-icon:hover,
    .delete-icon:hover {
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
    justify-content: space-between;
    width: 80%;
`;

const StyledButton = styled.button`
    padding: 0.75rem 3rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    background-color: ${props => props.primary ? Colours.ACCENT_1 : Colours.GRAY_LIGHT};
    color: ${props => props.primary ? Colours.WHITE : Colours.BLACK};
    transition: background-color 0.2s ease, color 0.2s ease;

    &:hover {
        background-color: ${props => props.primary ? Colours.ACCENT_1_LIGHT_2 : Colours.GRAY};
    }
`;
