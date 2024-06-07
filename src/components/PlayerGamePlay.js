// src/components/VillagerGameplay.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { getGame, setPlayer, streamGamePhase, getPlayerRoles } from '../apis/firebase';
import VotingPage from './Voting';
import HealingSelectPage from './HealingSelect';
import VictimSelectPage from './VictimSelect';
import KilledPlayerPage from './Killed';
import WinnerScreen from './Winners';

const PlayerGameplay = ({ setPage }) => {
    const [isNight, setIsNight] = useState(false);
    const [currentPhase, setCurrentPhase] = useState('');
    const [playerRoles, setPlayerRoles] = useState(null);

    const callback = (phase, subPhase) => {
        localStorage.removeItem('hasKilled');
        localStorage.removeItem('hasVoted');
        console.log('Callback phase:', phase);
        if (phase === 'night') {
            setIsNight(true);
        } else {
            setIsNight(false);
        }
        console.log('Callback subPhase:', subPhase);
        setCurrentPhase(subPhase);

    };

    const setPlayerRoleFunction = async (playerGameId) => {
        setPlayerRoles(await getPlayerRoles(playerGameId));
        console.log('Player roles:', playerRoles);
        //! redirect user to waiting page if playerRoles is null
    };

    useEffect(() => {
        const playerGameId = localStorage.getItem('playerGameId');
        console.log('useEffect triggered', playerGameId);
        setPlayerRoleFunction(playerGameId);
        if (playerGameId === null) {
            setPage('joingame');
        } else {
            const phaseStream = streamGamePhase(playerGameId, callback);
            return () => {
                console.log('Cleaning up phaseStream');
                if (phaseStream) phaseStream();
            };
        }
    }, [setPage]);

    const renderPhase = () => {
        switch (currentPhase) {
            case 'voting':
                return <VotingPage />;
            case 'seer':
                return <HealingSelectPage />;
            case 'vampire':
                return <VictimSelectPage />;
            case 'killed':
                return <KilledPlayerPage />;
            case 'winners':
                return <WinnerScreen />;
            default:
                return <div>Loading...</div>;
        }
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h2" align="center" gutterBottom>
                Player Gameplay
            </Typography>
            <Typography variant="h3" align="center" gutterBottom>
                {isNight ? 'Night Phase' : 'Day Phase'}
            </Typography>
            {/* Display relevant content based on the current phase */}
            {isNight ? (
                renderPhase()
            ) : (
                <Box>
                    <Typography variant="body1" paragraph>
                        Day phase instructions go here...
                    </Typography>
                    {/* Add any day-specific UI elements */}
                </Box>
            )}

        </Container>
    );
};

export default PlayerGameplay;
