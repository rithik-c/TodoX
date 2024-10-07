import React from 'react'
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Colours } from '../definitions';

// Created a new Todo component (and added some new colours to Colours definitions) to enhance UI for Tabs component (rather than using a plain list item)
const Todo = ({todo}) => {
  return (
    <Container completed={todo.completed} onClick={() => {console.log("hii")}}>
        <p>{todo.name}</p>
        <IconContainer>
            {/* Added icons for edit and delete to clean up UI */}
            <FontAwesomeIcon className="edit-icon" icon={faPenToSquare} onClick={() => {}} />
            <FontAwesomeIcon className="delete-icon" icon={faTrash} onClick={() => {}} />
        </IconContainer>
    </Container>
  )
}

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
    cursor: pointer;

    p {
        margin: 0;
        color: ${props => (props.completed ? `${Colours.GRAY_DARK_2}` : `${Colours.WHITE}`)};
        text-decoration: ${props => (props.completed ? 'line-through' : 'none')};
    }
`;

const IconContainer = styled.div`
    display: inline-block;
    
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
