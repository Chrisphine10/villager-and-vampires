// HostGamePage.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, List, ListItem, ListItemText, Box } from '@mui/material';
import { streamTriggerReload, changeGamePhase } from '../apis/firebase';

const IDDisplay = ({ setPage }) => {
    const [users, setUsers] = useState([]);
    const gameCode = localStorage.getItem('gameCode');
    const gameId = localStorage.getItem('gameId');


    const handleStartGame = () => {
        changeGamePhase(gameId, 'day', 'awake');
        setPage('hostgameplay');
    };

    useEffect(() => {
        if (gameId !== null) {
            waitingForPlayers(gameId);
        }
    }, [gameId]);

    const callback = (data) => {
        if (data.gamePhase === 'waiting') {
            console.log('waiting for players');
            console.log(data.users);
        }
    };

    const waitingForPlayers = async (gameId) => {
        const stream = await streamTriggerReload(gameId, callback);
        return () => stream.cancel();
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h2" align="center" gutterBottom>
                Host Game
            </Typography>
            <Typography variant="h4" align="center" gutterBottom>
                Game Code: {gameCode}
            </Typography>
            <Typography variant="h5" align="center" gutterBottom>
                Users Joining the Game:
            </Typography>
            <List>
                {users.map((user, index) => (
                    <ListItem key={index}>
                        <ListItemText primary={user} />
                    </ListItem>
                ))}
            </List>
            <Box mt={4} display="flex" justifyContent="center">
                <Button variant="contained" color="primary" onClick={handleStartGame}>
                    Start Game
                </Button>
            </Box>
            <Button
                variant="contained" color="primary"
                sx={{ mt: 2 }}
                onClick={() => setPage('choices')}
            >
                Back
            </Button>
        </Container>
    );
};

export default IDDisplay;
