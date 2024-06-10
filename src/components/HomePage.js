// src/components/HomePage.js
import React, { useState, useEffect } from 'react';
import { Container, Button } from '@mui/material';
import WelcomePage from './WelcomePage';
import HowToPlayPage from './HowToPlay';
import HostGamePlay from './HostGamePlay';
import PlayerGameplay from './PlayerGamePlay';
import Choices from './Choices';
import IDDisplay from './IDDisplay';
import JoinGamePage from './JoinGame';
import VotingPage from './Voting';
import { useAuth } from '../contexts/AuthContext';
import backgroundImage from '../assets/background.png'; // Use any cool background image
import buttonBackground from '../assets/button.png';

const HomePage = () => {
    const [page, setPage] = useState(''); // default page
    const { user } = useAuth();

    useEffect(() => {
        const storedPage = localStorage.getItem('page');
        if (storedPage) {
            setPage(storedPage);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('page', page);
    }, [page]);

    const renderPage = () => {
        switch (page) {
            case 'welcome':
                return <WelcomePage setPage={setPage} />;
            case 'howtoplay':
                return <HowToPlayPage setPage={setPage} />;
            case 'choices':
                return <Choices setPage={setPage} />;
            case 'iddisplay':
                return <IDDisplay setPage={setPage} />;
            case 'joingame':
                return <JoinGamePage setPage={setPage} />;
            case 'hostgameplay':
                return <HostGamePlay setPage={setPage} />;
            case 'playergameplay':
                return <PlayerGameplay setPage={setPage} />;
            case 'voting':
                return <VotingPage setPage={setPage} />;
            default:
                return <WelcomePage setPage={setPage} />;
        }
    };

    return (
        <Container
            maxWidth="lg"
            sx={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '100vw',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                FontFace: 'Play',
            }}
        >
            <div>Vampires and Villages</div>
            {user ? renderPage() : <div variant="h2" align="center">Please Sign In</div>}
            <Button
                sx={{
                    mt: 2,
                    width: '200px',  // Adjust as necessary
                    backgroundImage: `url(${buttonBackground})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: 'red',  // Ensure text is visible
                    '&:hover': {
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    },
                }}
                onClick={() => setPage('welcome')}
            >
                Back to Home
            </Button>
        </Container>
    );
};

export default HomePage;
