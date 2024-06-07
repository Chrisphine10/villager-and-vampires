import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Grid } from '@mui/material';
import { changeGamePhase, triggerReload } from '../apis/firebase';

const HostGameplay = ({ setPage }) => {
    const [isNight, setIsNight] = useState(false); // Initially night phase
    const [vampireAwake, setVampireAwake] = useState(false);
    const [seerAwake, setSeerAwake] = useState(false);
    const [isVampireTurn, setIsVampireTurn] = useState(true);
    const [isSeerTurn, setIsSeerTurn] = useState(false);
    const [firstVoting, setFirstVoting] = useState(false);

    const handlePhaseChange = async () => {
        setIsNight(!isNight); // Toggle between night and day phases
        setVampireAwake(false); // Reset state for the next night phase
        setSeerAwake(false);
        setIsVampireTurn(true);
        setIsSeerTurn(false);
        if (isNight) {
            changeGamePhase(await localStorage.getItem('gameId'), 'day', 'awake');
        } else {
            changeGamePhase(await localStorage.getItem('gameId'), 'night', 'sleep');
        }
    };

    const handleWakeUp = async (role) => {
        if (role === 'vampire') {
            setVampireAwake(true);
            setIsVampireTurn(true);
            changeGamePhase(await localStorage.getItem('gameId'), 'night', 'vampire');
        } else if (role === 'seer') {
            setSeerAwake(true);
            setIsSeerTurn(true);
            changeGamePhase(await localStorage.getItem('gameId'), 'night', 'seer');
        }
    };

    const handleSleep = async (role) => {
        changeGamePhase(await localStorage.getItem('gameId'), 'night', 'sleep');
        if (role === 'vampire') {
            setVampireAwake(false);
            setIsVampireTurn(false);
            setIsSeerTurn(true);
        } else if (role === 'seer') {
            setSeerAwake(false);
            setIsSeerTurn(false);
            localStorage.setItem('firstVoting', 'true');
        }
    };

    const handleVoting = async () => {
        changeGamePhase(await localStorage.getItem('gameId'), 'day', 'voting');
        setPage('voting');

    };

    useEffect(() => {
        const fetchGame = async () => {
            setFirstVoting(await localStorage.getItem('firstVoting') === 'true');
        };

        fetchGame();
    }, []);


    return (
        <Container maxWidth="md">
            <Typography variant="h2" align="center" gutterBottom>
                Host Gameplay
            </Typography>
            <Typography variant="h3" align="center" gutterBottom>
                {isNight ? 'Night Phase' : 'Day Phase'}
            </Typography>
            {/* Display relevant content based on the current phase */}
            {isNight ? (
                <Box>
                    {/* Add any night-specific UI elements */}
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={vampireAwake || !isVampireTurn}
                                onClick={() => handleWakeUp('vampire')}
                            >
                                Wake Up Vampires
                            </Button>

                            <Button
                                variant="contained"
                                color="primary"
                                disabled={!vampireAwake || !isVampireTurn}
                                onClick={() => handleSleep('vampire')}
                            >
                                Sleep Vampires
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={seerAwake || !isSeerTurn}
                                onClick={() => handleWakeUp('seer')}
                            >
                                Wake Up Seer
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={!seerAwake || !isSeerTurn}
                                onClick={() => handleSleep('seer')}
                            >
                                Sleep Seer
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            ) : (
                <Box mt={2}>
                    <Typography variant="body1" paragraph>
                        Day Phase Instructions:
                    </Typography>
                    <Typography variant="body1" paragraph>
                        - During the day phase, all players gather in the village square to discuss and deliberate.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        - Villagers should share any suspicions they have about other players and present evidence if available.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        - Players can ask questions, analyze behavior, and attempt to deduce the identities of vampires.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        - The goal for villagers is to identify and vote out suspected vampires.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        - Players must be cautious not to reveal sensitive information that could be used by vampires against them.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        - Once all discussions are complete, players vote on which player they believe is a vampire.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        - The player with the most votes is eliminated from the game and their role is revealed.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        - After the vote, the game progresses to the next night phase.
                    </Typography>
                    {firstVoting ? <Box mt={4} display="flex" justifyContent="center">
                        <Button variant="contained" color="primary" onClick={handleVoting}>Voting
                        </Button>
                    </Box> : null}
                </Box>
            )}
            <Box mt={4} display="flex" justifyContent="center">
                <Button variant="contained" color="primary" onClick={handlePhaseChange}>
                    {isNight ? 'Switch to Day Phase' : 'Switch to Night Phase'}
                </Button>
            </Box>
        </Container>
    );
};

export default HostGameplay;
