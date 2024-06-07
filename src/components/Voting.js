// VotingPage.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Grid, Card, CardContent, Box, Dialog, DialogTitle, DialogActions } from '@mui/material';
import { voteForUser, getGame, getPlayer, streamTriggerReload, triggerReload, setVotedPlayer, changeGamePhase } from '../apis/firebase';
import { auth } from '../firebase';


const VotingPage = ({ setPage }) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const gameId = localStorage.getItem('gameId');
    const [gamePhase, setGamePhase] = useState(null);
    const role = localStorage.getItem('role');
    const [hasVoted, setHasVoted] = useState(false);
    const [players, setPlayers] = useState([]);
    const [gameData, setGameData] = useState([]);
    const [votedPlayerData, setVotedPlayerData] = useState({});

    const handleUserSelect = (userName) => {
        console.log('Selected user:', userName);
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
        voteForUser(gameId, selectedUser);
        // You can redirect to another page or perform any other action after locking the vote
        setHasVoted(true);
        localStorage.setItem('hasVoted', 'true');
        triggerReload(gameId);
    };

    const callback = async (data) => {
        await liveVoting();
    };

    const liveVoting = async () => {
        try {
            const game = await getGame(gameId);
            const updatedGameData = [];

            for (const votes of game.voting) {
                const count = votes.count;
                const user = await getPlayer(votes.userId);
                const username = user.username;
                const playerId = votes.userId;
                updatedGameData.push({ username, count, playerId });
            }
            console.log(updatedGameData);
            setGameData(updatedGameData);
        } catch (error) {
            console.error("Error fetching live voting data: ", error);
        }
    };

    const revealPlayer = async () => {
        const votedPlayer = await setVotedPlayer(gameId);

        const votedPlayerOb = gameData.find((player) => player.playerId === votedPlayer);
        console.log(votedPlayerOb);
        setVotedPlayerData(votedPlayerOb);
        setGamePhase('reveal');
    };

    const handleNextRound = async () => {
        await changeGamePhase(gameId, 'day', 'awake');
        setPage('hostgameplay');
    };

    useEffect(() => {
        const fetchGame = async () => {
            const user = auth.currentUser;
            const game = await getGame(gameId);
            console.log(game.players);
            var playersList = []
            for (const player of game.players) {
                if (player !== user.uid) {
                    playersList.push(await getPlayer(player));
                }
            }
            console.log(playersList);
            setPlayers(playersList);
            await streamTriggerReload(gameId, callback);
        };
        if (localStorage.getItem('hasVoted') !== null && localStorage.getItem('hasVoted') === 'true') {
            liveVoting();
            setHasVoted(true);
            streamTriggerReload(gameId, callback);
        } else {
            fetchGame();
        }


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameId]);




    return (
        <Container maxWidth="md">
            <Typography variant="h2" align="center" gutterBottom>
                Voting Page
            </Typography>

            {hasVoted || role === 'host' ? <>
                {role !== 'host' ? <Typography variant="h5" align="center" gutterBottom>You have already voted.</Typography> : <></>}
                {gamePhase === 'reveal' ? <>
                    <Typography variant="h5" align="center" gutterBottom>The player who voted for you is:</Typography>
                    <Typography variant="h4" align="center" gutterBottom>{votedPlayerData.username}</Typography>
                    <Typography variant="h5" align="center" gutterBottom>With {votedPlayerData.count} votes.</Typography>
                </> : <Grid container spacing={2} justifyContent="center">
                    {gameData.map((data, index) => (
                        <Grid item key={data.userId || index}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        {data.username || 'Unknown'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Votes: {data.count || 0}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                }
            </>
                :
                <>
                    <Grid container spacing={2} justifyContent="center">
                        {players.map((user, index) => (
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
                    <Box mt={2} display="flex" justifyContent="center">
                        <Button variant="contained" color="primary" onClick={handleConfirmVote} disabled={!selectedUser}>
                            Confirm Vote
                        </Button>
                    </Box>
                    <Dialog open={confirmationOpen} onClose={() => setConfirmationOpen(false)}>
                        <DialogTitle>Are you sure you want to vote for {selectedUser}?</DialogTitle>
                        <DialogActions>
                            <Button onClick={handleCancelVote} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleLockVote} color="primary">
                                Yes, Lock Vote
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>}
            {role === 'host' && gamePhase !== 'reveal' ? <Box mt={4} display="flex" justifyContent="center">
                <Button variant="contained" color="primary" onClick={revealPlayer}>End Voting
                </Button>
            </Box>
                : <></>}
            {gamePhase === 'reveal' ? <Box mt={4} display="flex" justifyContent="center">
                <Button variant="contained" color="primary" onClick={handleNextRound}>Start Next Round
                </Button>
            </Box> : <></>}
        </Container>
    );
};

export default VotingPage;
