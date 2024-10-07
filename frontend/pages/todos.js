import React, { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import styled from "styled-components";
import { Colours, Typography } from "../definitions";
import Tabs from "../components/Tabs";
import Button from "../components/Button";
import Todo from "../components/Todo";
import Link from "next/link";
import apiFetch from '../functions/apiFetch';

// New page to view all todos of the current user
const Todos = () => {

    // API call to fetch todos of current user
    const [todos, setTodos] = useState([]); // State to hold the fetched todos
    const [loading, setLoading] = useState(true); // State to manage loading

    // API call to fetch todos of the current user
    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const response = await apiFetch("/todo", { method: "GET" }); // Fetch todos
                if (response.status === 200) {
                    setTodos(response.body.sort((a, b) => {
                        return new Date(b.created) - new Date(a.created);
                    })); // Sorting fetched todos by creation date
                    console.log("Fetched todos:", response.body);

                } else {
                    console.error("Failed to fetch todos:", response.body);
                }
            } catch (error) {
                console.error("Error fetching todos:", error);
            } finally {
                setLoading(false); // Set loading to false after fetching (use loading to show a loading spinner)
            }
        };
        fetchTodos();
    }, []); // Empty dependency array to run on mount


    // TODO: Will change to redux store later maybe?
    const [activeTab, setActiveTab] = useState("Incomplete");

    // Define the tabs
    const tabs = [
        {
            title: "Incomplete",
            content: (
                <TodoList todos={todos.filter(todo => !todo.completed)} />
            ),
            onClick: () => setActiveTab("Incomplete"),
        },
        {
            title: "All",
            content: (
                <TodoList todos={todos} />
            ),
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
                        {/* TODO: Add filter functionality */}
                        <Link className="noLinkStyling" href="/">
                            <Button className="backButton" text="Back" size="large" variant="secondary" isFullWidth/>
                        </Link>
                        <Link className="noLinkStyling" href="/">
                            <Button className="filterButton" text="Filter" size="large" variant="primary" isFullWidth/>
                        </Link>
                    </ButtonContainer>
                </div>
            </Container>
        </PageLayout>
    );
};

// Made a separate object for the TodoList component for easier readability
const TodoList = ({ todos }) => {
    return (
        <ul>
            {todos.map(todo => (
                <li key={todo.id}>
                    <Todo todo={todo}></Todo>
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
    width: 90%;
    margin-left: auto;
    margin-right: auto;

    .noLinkStyling {
        text-decoration: none;
        flex: 1;
    }
`;
