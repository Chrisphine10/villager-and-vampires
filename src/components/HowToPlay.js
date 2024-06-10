import React, { useState } from 'react';
import { Container, Typography, Button, Box, Tab, Tabs, Card, CardContent } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import backgroundImage from '../assets/6.jpg';

const HowToPlayPage = ({ setPage }) => {
    const theme = useTheme();
    const titleColor = theme.palette.primary.main;
    const secondaryColor = theme.palette.secondary.main;

    return (
        <>
            <h1 variant="h1" style={{ color: titleColor, textAlign: 'center', zIndex: 1 }}>
                {/* Ensuring text is above overlay */}
                How to Play - Vampires vs Villagers
            </h1>
            <div style={{ overflowX: 'auto' }}>
                <Container
                    textAlign="center"
                    sx={{
                        position: 'relative', // Added position relative
                        width: '90%',
                        minHeight: '60vh',
                        borderRadius: '30px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontFamily: 'Play',
                        padding: '20px',
                        overflow: 'hidden', // Changed overflow to hidden to contain the background image
                    }}
                >
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

                    {/* Rules */}
                    <Box
                        sx={{
                            zIndex: 2, // Ensure rules are above overlay
                            width: '100%',
                            marginTop: '20px',
                        }}
                    >
                        <Card>
                            <CardContent>
                                <Typography variant="h4" gutterBottom>
                                    Main Rules
                                </Typography>
                                <Typography variant="code">
                                    <ol>
                                        <li>Vampires: The objective is to eliminate all villagers without revealing their identity. They can do this by "biting" villagers each night. Vampires win when they outnumber the remaining villagers.</li>
                                        <li>Villagers: The objective is to identify and eliminate all vampires. During the day, villagers vote to eliminate who they suspect is a vampire. Villagers win when all vampires are eliminated.</li>
                                        <li>Night Phase: At night, vampires secretly choose a villager to bite, and certain special roles may also perform their actions.</li>
                                        <li>Day Phase: During the day, all players discuss and vote on who they believe is a vampire. The player with the most votes is eliminated. In case of a tie, no one is eliminated.</li>
                                        <li>Special Roles: Some players may have special abilities that affect the game, such as the Seer who can identify one player's role each night, or the Doctor who can protect a player from being bitten by vampires.</li>
                                        <li>Win Condition: The game ends when either all vampires or all villagers are eliminated. The winning team is determined based on the remaining roles.</li>
                                    </ol>
                                </Typography>
                            </CardContent>
                        </Card>
                        <br></br>

                    </Box>

                </Container>
            </div>
        </>
    );
};


export default HowToPlayPage;
