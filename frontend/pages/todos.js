import React, { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import styled from "styled-components";
import { Colours, Typography } from "../definitions";
import Tabs from "../components/Tabs";
import Button from "../components/Button";
import Todo from "../components/Todo";
import Link from "next/link";
import apiFetch from '../functions/apiFetch';
import { useDispatch, useSelector } from "react-redux";
import { setTodos } from "../actions/todoList";

// New page to view all todos of the current user
const Todos = () => {

    // API call to fetch todos of current user
    const todoListState = useSelector((state) => state.todoList); // State to hold the fetched todos
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState("Incomplete"); // Chose to not store in redux since it's only used in this component
    const [loading, setLoading] = useState(true); // TODO: Unused but implemented for futureproofing for scaling purposes (State to manage loading)

    // API call to fetch todos of the current user
    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const response = await apiFetch("/todo", { method: "GET" }); // Fetch todos
                if (response.status === 200) {
                    dispatch(setTodos(response.body.sort((a, b) => {
                        return new Date(b.created) - new Date(a.created);
                    }))); // Sorting fetched todos by creation date
                    console.log("Fetched todos:", response.body);

                } else {
                    console.error("Failed to fetch todos:", response.body);
                }
            } catch (error) {
                console.error("Error fetching todos:", error);
            } finally {
                setLoading(false); // TODO: Set loading to false after fetching (can use loading to show a loading spinner)
            }
        };
        fetchTodos();
    }, []); // Empty dependency array to run on mount


    // Defining the tabs
    const tabs = [
        {
            title: "Incomplete",
            content: (() => {
                const incompleteTodos = todoListState.todos.filter(todo => !todo.completed);
    
                if (todoListState.todos.length === 0) {
                    return <h2>You haven't made any Todos yet!</h2>;
                } else if (incompleteTodos.length === 0) {
                    return <h2>You're all caught up!</h2>;
                } else {
                    return <TodoList todos={incompleteTodos} activeTab={activeTab} />;
                }
            })(),
            onClick: () => setActiveTab("Incomplete"),
        },
        {
            title: "All",
            content: todoListState.todos.length === 0
            ? <h2>You haven't made any Todos yet!</h2>
            : <TodoList todos={todoListState.todos} activeTab={activeTab} />,
            onClick: () => setActiveTab("All"),
        },
    ];

    return (
        <PageLayout title="View Todos">
            <Container>
                <div className="content">
                    <h1>My Todos</h1>
                    <Tabs tabs={tabs} activeTab={activeTab} />
                    <ButtonContainer>
                        <Link className="noLinkStyling" href="/">
                            <Button className="backButton" text="Back" size="large" variant="secondary" isFullWidth/>
                        </Link>
                        {/* TODO: Can add filter functionality in the future */}
                        {/* <Link className="noLinkStyling" href="/">
                            <Button className="filterButton" text="Filter" size="large" variant="primary" isFullWidth/>
                        </Link> */}
                    </ButtonContainer>
                </div>
            </Container>
        </PageLayout>
    );
};

// Made a separate object for the TodoList component for easier readability
const TodoList = ({ todos, activeTab }) => {
    return (
        <ul>
            {todos.map(todo => (
                <li key={todo.todoID}>
                    <Todo todo={todo} activeTab={activeTab}></Todo>
                </li>
            ))}
        </ul>
    );
};

export default Todos;


// Chose to continue the pre-existing coding style of utilizing styled components
const Container = styled.div`
    width: 100%;

    .content {
        h1 {
            color: ${Colours.BLACK};
            font-size: ${Typography.HEADING_SIZES.M};
            font-weight: ${Typography.WEIGHTS.LIGHT};
            line-height: 2.625rem;
            margin-bottom: 2rem;
            margin-top: 1rem;
        }
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 1.5rem;
    gap: 1rem;
    width: 35%;
    margin-left: auto;
    margin-right: auto;

    .noLinkStyling {
        text-decoration: none;
        flex: 1;
    }
`;
