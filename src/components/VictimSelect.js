// VictimSelectPage.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Grid, Card, CardContent, Box, Dialog, DialogTitle, DialogActions } from '@mui/material';
import { killUser, getGame, getPlayer, setKilledPlayer } from '../apis/firebase';
import { auth } from '../firebase';

const VictimSelectPage = ({ setPage }) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const gameId = localStorage.getItem('gameId');
    const [hasKilled, setHasKilled] = useState(false);

    const handleUserSelect = (userName) => {
        setSelectedUser(userName);
    };

    const handleConfirmVote = () => {
        setConfirmationOpen(true);
    };

    const handleCancelVote = () => {
        setSelectedUser(null);
        setConfirmationOpen(false);
    };

    const handleLockVote = async () => {
        // Implement logic to lock in the vote
        console.log('Vote locked for:', selectedUser);
        console.log('Game ID:', gameId);
        await killUser(gameId, selectedUser);
        localStorage.setItem('hasKilled', 'true');
        setHasKilled(true);
    };

    useEffect(() => {
        const fetchGame = async () => {
            const user = auth.currentUser;
            const game = await getGame(gameId);
            console.log(game.players);
            var playersList = []
            for (const player of game.villagers) {
                if (player !== user.uid) {
                    playersList.push(await getPlayer(player));
                }
            }
            console.log(playersList);
            setUsers(playersList);
        };
        if (localStorage.getItem('hasKilled') !== null && localStorage.getItem('hasKilled') === 'true') {
            setHasKilled(true);
        } else {
            fetchGame();
        }


    }, [gameId]);

    return (
        <Container maxWidth="md">
            <Typography variant="h2" align="center" gutterBottom>
                Victim Select Page
            </Typography>
            {hasKilled ? <>
                <Typography variant="h5" align="center" gutterBottom>You have selected a victim </Typography>
            </> : <><Grid container spacing={2} justifyContent="center">
                <Grid container spacing={2} justifyContent="center">
                    {users.map((user, index) => (
                        <Grid item key={index}>
                            <Card variant="outlined" onClick={() => handleUserSelect(user.id)} sx={{ cursor: 'pointer', backgroundColor: selectedUser === user.id ? '#e0f7fa' : 'inherit' }}>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        {user.username}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
                <Box mt={2} display="flex" justifyContent="center">
                    <Button variant="contained" color="primary" onClick={handleConfirmVote} disabled={!selectedUser}>
                        Confirm Victim
                    </Button>
                </Box>
                <Dialog open={confirmationOpen} onClose={() => setConfirmationOpen(false)}>
                    <DialogTitle>Are you sure you want to vote for {selectedUser}?</DialogTitle>
                    <DialogActions>
                        <Button onClick={handleCancelVote} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleLockVote} color="primary">
                            Yes, Lock Victim
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
            }
        </Container>
    );
};

export default VictimSelectPage;
