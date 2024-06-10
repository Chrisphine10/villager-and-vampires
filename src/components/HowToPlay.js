// HowToPlayPage.js
import React, { useState } from 'react';
import { Container, Typography, Button, Box, Tab, Tabs } from '@mui/material';
import { Link } from 'react-router-dom';

const HowToPlayPage = ({ setPage }) => {
    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h2" align="center" gutterBottom>
                How to Play Vampires and Villages
            </Typography>
            <Tabs value={selectedTab} onChange={handleTabChange} centered>
                <Tab label="General Gameplay" />
                <Tab label="Host Rules" />
                <Tab label="Player Rules" />
                <Tab label="FAQs" />
            </Tabs>
            <TabPanel value={selectedTab} index={0}>
                <Typography variant="h3" gutterBottom>
                    General Gameplay:
                </Typography>
                {/* General gameplay content goes here */}
            </TabPanel>
            <TabPanel value={selectedTab} index={1}>
                <Typography variant="h3" gutterBottom>
                    Host Rules:
                </Typography>
                {/* Host rules content goes here */}
            </TabPanel>
            <TabPanel value={selectedTab} index={2}>
                <Typography variant="h3" gutterBottom>
                    Player Rules:
                </Typography>
                {/* Player rules content goes here */}
            </TabPanel>
            <TabPanel value={selectedTab} index={3}>
                <Typography variant="h3" gutterBottom>
                    FAQs:
                </Typography>
                {/* FAQs content goes here */}
            </TabPanel>

        </Container>
    );
};

const TabPanel = ({ children, value, index }) => {
    return (
        <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`}>
            {value === index && (
                <Box mt={2}>
                    {children}
                </Box>
            )}
        </div>
    );
};

export default HowToPlayPage;
