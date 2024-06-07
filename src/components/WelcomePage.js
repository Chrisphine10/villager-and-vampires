// src/components/WelcomePage.js
import React from 'react';
import { Button, Typography, Box } from '@mui/material';
import { auth } from '../firebase';

const WelcomePage = ({ setPage }) => {
    return (
        <Box textAlign="center">
            <Typography variant="h2" gutterBottom>
                Welcome to the Game
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => setPage('choices')}
                sx={{ m: 2 }}
            >
                Start Game
            </Button>
            <Button
                variant="contained"
                color="secondary"
                onClick={() => setPage('howtoplay')}
                sx={{ m: 2 }}
            >
                How to Play
            </Button>
            <Button
                variant="outlined"
                color="primary"
                onClick={() => auth.signOut()}
                sx={{ m: 2 }}
            >
                Sign Out
            </Button>
        </Box>
    );
};

export default WelcomePage;
