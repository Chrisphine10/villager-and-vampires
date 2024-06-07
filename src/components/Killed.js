// KilledPlayerPage.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { getGame, getPlayer } from '../apis/firebase';
import { auth } from '../firebase';

const KilledPlayerPage = ({ setPage }) => {
    const [player, setPlayer] = useState({});
    const gameId = localStorage.getItem('gameId');
    const [isKilled, setIsKilled] = useState(false);




    useEffect(() => {
        const user = auth.currentUser;
        const fetchGame = async () => {
            const game = await getGame(gameId);
            console.log(game.killed);
            setIsKilled(game.killed);
            const player = await getPlayer(game.killed);
            setPlayer(player);
            if (game.killed === user.uid) {
                setIsKilled(true);
            } else {
                setIsKilled(false);
            }

        };

        fetchGame();
    }, [gameId]);

    return (
        <Container maxWidth="md">
            <Typography variant="h2" align="center" gutterBottom>
                {isKilled ? 'You Have Been Killed' : 'Player Eliminated'}
            </Typography>
            <Grid container spacing={2} justifyContent="center">
                <Grid item>
                    <Card variant="outlined">
                        {/* <CardMedia
                            component="img"
                            alt={playerName}
                            height="200"
                            image={isKilled ? '/killed-image.png' : '/eliminated-image.png'}
                        /> */}
                        <CardContent>
                            <Typography variant="h5" component="div" align="center">
                                {player.username}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

        </Container>
    );
};

export default KilledPlayerPage;
