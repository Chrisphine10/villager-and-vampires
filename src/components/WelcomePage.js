import React from 'react';
import { Button, Typography, Container, Box } from '@mui/material'; // Added Box from MUI
import { auth } from '../firebase';
import { useTheme } from '@mui/material/styles';
import backgroundImage from '../assets/6.jpg';
import buttonBackground from '../assets/button.png';

const WelcomePage = ({ setPage }) => {
    const theme = useTheme();
    const titleColor = theme.palette.primary.main;
    const secondaryColor = theme.palette.secondary.main;
    return (
        <>
            <Container textAlign="center" sx={{
                position: 'relative', // Added position relative
                width: '80%',
                minHeight: '60vh',
                borderRadius: '50px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: 'Play',
                padding: '20px',
                overflow: 'hidden', // Added overflow hidden to contain the background image
            }}>
                {/* Dark overlay */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.2)', // Dark semi-transparent color
                        zIndex: 1, // Ensure the overlay is above the background image
                    }}
                ></Box>

                {/* Background Image */}
                <img
                    src={backgroundImage}
                    alt="Background"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'blur(1.3px)', // Added blur effect
                        zIndex: 0, // Ensure the background image is behind the overlay
                    }}
                />

                {/* Content */}
                <h1 variant="h1" style={{ color: titleColor, textAlign: 'center', zIndex: 0 }}> {/* Ensuring text is above overlay */}
                    Welcome to Timbuktu!
                </h1>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setPage('choices')}
                    sx={{
                        mt: 2,
                        zIndex: 2,
                        width: '200px',
                        backgroundImage: `url(${buttonBackground})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        color: secondaryColor,
                        '&:hover': {
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        },
                    }}
                >
                    Start Game
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setPage('howtoplay')}
                    sx={{
                        mt: 2,
                        zIndex: 2,
                        width: '200px',
                        backgroundImage: `url(${buttonBackground})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        color: 'blue',
                        '&:hover': {
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        },
                    }}
                >
                    How to Play
                </Button>

            </Container>
            <Button
                sx={{
                    mt: 2,
                    width: '200px',
                    backgroundImage: `url(${buttonBackground})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: 'red',
                    '&:hover': {
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    },
                }}
                onClick={() => auth.signOut()}
            >
                Sign Out
            </Button>
        </>
    );
};

export default WelcomePage;
