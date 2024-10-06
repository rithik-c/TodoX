import React from 'react'
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Colours } from '../definitions';

const Todo = ({todo}) => {
  return (
    <Container completed={todo.completed} onClick={() => {console.log("hii")}}>
        <p>{todo.name}</p>
        <IconContainer>
            <FontAwesomeIcon className="edit-icon" icon={faPenToSquare} onClick={() => {}} />
            <FontAwesomeIcon className="delete-icon" icon={faTrash} onClick={() => {}} />
        </IconContainer>
    </Container>
  )
}

export default Todo

const Container = styled.div`
    display: flex; /* Flexbox layout */
    justify-content: space-between; /* Pushes icons to the right */
    align-items: center; /* Centers items vertically */
    background: ${props => (props.completed ? `${Colours.ACCENT_1_LIGHT}` : `${Colours.ACCENT_1}`)};
    color: ${Colours.WHITE};
    padding: 0.9rem 1rem;
    border-radius: 15px;
    margin-bottom: 0.75rem;
    cursor: pointer;

    p {
        margin: 0; /* Remove default margin */
        color: ${props => (props.completed ? `${Colours.GRAY_DARK_2}` : `${Colours.WHITE}`)};
        text-decoration: ${props => (props.completed ? 'line-through' : 'none')};
    }
`;

const IconContainer = styled.div`
    display: inline-block; /* Use inline-block for the icon container */
    
    .edit-icon,
    .delete-icon {
        cursor: pointer;
        margin-left: 0.75rem; /* Space between icons */
        color: ${Colours.WHITE}; /* Ensure the icons are visible */
    }
    
    .edit-icon:hover,
    .delete-icon:hover {
        color: ${Colours.ACCENT_1_LIGHTER}; /* Ensure the icons are visible */
    }
`;
