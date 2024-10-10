import React from "react";
import styled from "styled-components";
import Colours from "../definitions/Colours";
import Typography from "../definitions/Typography";
import { useSelector } from "react-redux";

// tabs prop format
// [
//     {
//         title: "My Tab Name",
//         content: <p></p>
//         onClick: (tabTitle) => {setActiveTab(tabTitle)}
//     }
// ]

export default function Tabs({
    className,
    tabsClassName,
    ref,
    activeTab,
    tabs = [],
}) {

    const isDark = useSelector((state) => state.colourScheme.isDarkMode);
    const tabCode = [];
    const contentCode = [];

    for (const tab of tabs) {
        tabCode.push(
            <Tab
                key={tab.title}
                isActive={activeTab === tab.title}
                onClick={tab.onClick}
                isDark={isDark}
            >
                <span className="tabTitle">{tab.title}</span>
            </Tab>
        );
        contentCode.push(
            activeTab === tab.title ? (
                <Screen key={tab.title} isActive={activeTab === tab.title}>
                    {tab.content}
                </Screen>
            ) : null
        );
    }

    return (
        <Container className={className} ref={ref}>
            <TabList className={tabsClassName} isDark={isDark}>{tabCode}</TabList>
                <div className="content">{contentCode}</div>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    height: 100%;
    width: 100%;
    
    .content {
        margin-TOP: 0.5rem;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        height: 100%;
    }
`;

const TabList = styled.ul`
    border-bottom: 1px solid ${({ isDark }) => (isDark ? Colours.GRAY_LIGHT : Colours.GRAY_DARKER)};
    box-sizing: border-box;
    display: flex;
    flex-shrink: 0;
    justify-content: flex-start;
    list-style: none;
    overflow-x: auto;
    width: 100%;
    transition: all 0.3s;
`;

const Tab = styled.li`
    align-items: center;
    cursor: pointer;
    display: flex;
    padding: 0.25rem 0.75rem 0.5rem 0.75rem;
    transition: font-size 0.25s, font-weight 0.25s, line-height 0.25s;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    white-space: nowrap;
    transition: all 0.3s;

    ${(props) => {
        if (props.isActive) {
            return `
                border-bottom: 2px solid ${props.isDark ? Colours.BLACK : Colours.WHITE};
                color: ${props.isDark ? Colours.BLACK : Colours.WHITE};
            `;
        }
        return `
            color: ${props.isDark ? Colours.BLACK_LIGHTEST_2 : Colours.WHITE_LIGHTEST_2};
        `;
    }}

    .tabTitle {
        font-size: ${Typography.BODY_SIZES.XL};
        font-weight: ${Typography.WEIGHTS.BOLD};
        line-height: 1.875rem;
    }
`;

const Screen = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    height: 100%;
    padding: 0.5rem 0;
    width: 100%;

    ${(props) => {
        if (!props.isActive) {
            return `
                display: none;
            `;
        }
        return `
            display: flex;
            flex-direction: column;
        `;
    }}
`;
