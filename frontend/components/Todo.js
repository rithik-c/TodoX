import { useState } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Colours } from '../definitions';
import apiFetch from '../functions/apiFetch';
import { useDispatch } from "react-redux";
import { toggleTodoCompletion } from "../actions/todoList";

// Created a new Todo component (and added some new colours to Colours definitions) to enhance UI for Tabs component (rather than using a plain list item)
const Todo = ({todo}) => {

    // Chose to use react-modal since I noticed it was already installed in the project so the previous developer was probably planning to use it
    const [modalIsOpen, toggleModal] = useState(false);
    const dispatch = useDispatch();

    // I chose to use the PATCH method over PUT since I'm only partially updating the resource.
    // I also chose to code it in terms of toggling rather than a one-way 'completed' update so it can satisfy a second user story/purpose
    const toggleCompletion = async () => {

        try {
            const response = await apiFetch(`/todo/${todo.todoID}`, {
                method: "PATCH",
                body: {
                    completed: !todo.completed
                }                 
            }); 
        
            if (response.status === 200) {
                dispatch(toggleTodoCompletion(todo.todoID)); // Updating todo completion status in the redux store to match DB
                console.log("Updated completion status of todo:", todo.name);
            } else {
                console.error("Failed to update todo:", response.body);
            }
        } catch (error) {
            console.error("Error updating todo:", error);
        }
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
                    <FontAwesomeIcon className="edit-icon" icon={faPenToSquare} onClick={() => toggleModal(currentState => !currentState)} />
                    <FontAwesomeIcon className="delete-icon" icon={faTrash} onClick={toggleCompletion} />
                </Icons>
            </RightContainer>

            <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => toggleModal(currentState => !currentState)}
            contentLabel="Edit Todo"
            style={{
                content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)',
                },
            }}
            >
            <h2>Edit Todo</h2>
            <button onClick={() => toggleModal(currentState => !currentState)}>Close</button>
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
