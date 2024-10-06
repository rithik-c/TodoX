import React, { useState } from "react";
import PageLayout from "../components/PageLayout";
import styled from "styled-components";
import { Colours, Typography } from "../definitions";

const Todos = () => {

    return (
        <PageLayout title="View Todos">
            <Container>
                <div className="content">
                    <h1>My Todos</h1>
                    <p>Todos will be placed here!</p>
                </div>
            </Container>
        </PageLayout>
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
