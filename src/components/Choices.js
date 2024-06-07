// src/components/Choices.js
import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { createGame } from '../apis/firebase';

const Choices = ({ setPage }) => {
    const handleHostGame = async () => {
        localStorage.setItem('role', 'host');
        const gameId = await createGame();
        console.log(gameId);
        if (gameId !== null) {
            localStorage.setItem('gameId', gameId);
            setPage('iddisplay');
        } else {
            setPage('hostgameplay');
        }
    };

    const handleJoinGame = () => {
        localStorage.setItem('role', 'player');
        setPage('joingame');
    };
    return (
        <Container maxWidth="md">
            <Typography variant="h2" align="center" gutterBottom>
                Choose Your Role
            </Typography>
            <Box display="flex" justifyContent="center" mt={4} mb={2}>
                <Button variant="contained" color="primary" component={Link}
                    onClick={handleHostGame}>
                    Host Game
                </Button>
                <Box mx={2}></Box> {/* Add spacing between buttons */}
                <Button variant="contained" color="primary" component={Link} onClick={handleJoinGame}>
                    Join Game
                </Button>
            </Box>
            <Box display="flex" justifyContent="center">
                <Button variant="outlined" color="primary" component={Link} onClick={() => setPage('welcomepage')}>
                    Go Back
                </Button>
            </Box>
        </Container>
    );
};

export default Choices;
