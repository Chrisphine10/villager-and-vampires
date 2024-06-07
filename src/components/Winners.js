// WinnerScreen.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { getGame, getPlayer } from '../apis/firebase';
import { auth } from '../firebase';

const WinnerScreen = ({ setPage }) => {

    const [players, setPlayers] = useState([]);
    const gameId = localStorage.getItem('gameId');
    const [isWinner, setIsWinner] = useState(false);

    useEffect(() => {
        const fetchGame = async () => {
            const user = auth.currentUser;
            const game = await getGame(gameId);
            console.log(game.players);
            var playersList = []
            for (const player of game.winners) {
                if (player !== user.uid) {
                    playersList.push(await getPlayer(player));
                }
            }
            setIsWinner(game.winnerTeam);
            console.log(playersList);
            setPlayers(playersList);
        };
        if (localStorage.getItem('gameOver') !== null && localStorage.getItem('gameOver') === 'true') {
        } else {
            fetchGame();
        }


    }, [gameId]);


    const handleGameOver = () => {
        localStorage.removeItem('gameOver');
        localStorage.removeItem('gameId');
        localStorage.removeItem('role');
        localStorage.removeItem('hasKilled');
        localStorage.removeItem('hasVoted');
        setPage('welcome');
    };

    return (
        <>
            <Container maxWidth="md">
                <Typography variant="h2" align="center" gutterBottom>
                    Game Over
                </Typography>
                <Typography variant="h4" align="center" gutterBottom>
                    Winners:
                </Typography>
                <Typography variant="body1" align="center" gutterBottom>
                    {isWinner === 'villagers' ? 'Villagers' : 'Vampires'}
                </Typography>
                <Grid container spacing={2} justifyContent="center">
                    {players.map((player, index) => (
                        <Grid item key={player.userId || index}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        {player.username || 'Unknown'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

            </Container>
            <Button
                variant="contained" color="primary"
                sx={{ mt: 2 }}
                onClick={handleGameOver}
            >
                Back to Home
            </Button>
        </>
    );
};

export default WinnerScreen;
