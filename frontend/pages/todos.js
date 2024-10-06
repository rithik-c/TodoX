import React, { useState } from "react";
import PageLayout from "../components/PageLayout";
import styled from "styled-components";
import { Colours, Typography } from "../definitions";
import Tabs from "../components/Tabs";
import Button from "../components/Button";
import Link from "next/link";

const Todos = () => {

    // Temporary hardcoded todo data (DB connection goes here)
    const todos = [
        { id: 1, name: "Watch Blue Lock anime", completed: false },
        { id: 2, name: "Finish Kinton leftovers", completed: false },
        { id: 3, name: "Touch grass (optional)", completed: true },
        { id: 4, name: "Pre-order Ghost of Yotei", completed: true },
    ];

    // Will change to redux store later
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

const TodoList = ({ todos }) => {
    return (
        <ul>
            {todos.map(todo => (
                // TODO: Create Todo Component
                <li key={todo.id}>
                    {todo.name}
                </li>
            ))}
        </ul>
    );
};

export default Todos;

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
