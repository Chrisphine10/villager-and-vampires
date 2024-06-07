// JoinGamePage.js
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Container, Typography, TextField, Button } from '@mui/material';
import { addPlayerToList, findGameByCode } from '../apis/firebase';
import { auth } from '../firebase';
const JoinGamePage = ({ setPage }) => {
    const [gameCode, setGameCode] = useState('');
    const [showJoinButton, setShowJoinButton] = useState(false);
    const user = auth.currentUser;

    const handleGameCodeChange = (event) => {
        setGameCode(event.target.value);
        if (event.target.value.length === 7) {
            setShowJoinButton(true);
        } else {
            setShowJoinButton(false);
        }
    };

    const handleJoinGame = async () => {
        const gameId = await findGameByCode(gameCode);
        console.log(gameId);
        localStorage.setItem('playerGameId', gameId);
        if (!gameId) {
            toast.error('Invalid game code');
        } else {
            await addPlayerToList(gameId, 'players', user.uid);
            setPage('playergameplay');
        }
    };

    const handleCancel = () => {
        setGameCode('');
        setShowJoinButton(false);
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h2" align="center" gutterBottom>
                Join Game
            </Typography>
            <TextField
                label="Enter Game ID"
                variant="outlined"
                fullWidth
                value={gameCode}
                disabled={showJoinButton}
                onChange={handleGameCodeChange}
                sx={{ marginBottom: 2 }}
            />
            {showJoinButton && (
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleJoinGame}
                    sx={{ marginBottom: 2 }}
                >
                    Join
                </Button>
            )}
            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleCancel}
            >
                Cancel
            </Button>

        </Container>
    );
};

export default JoinGamePage;
