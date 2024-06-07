// VictimSelectPage.js
import React, { useState } from 'react';
import { Container, Typography, Button, Grid, Card, CardContent, Box, Dialog, DialogTitle, DialogActions } from '@mui/material';

const users = ['User1', 'User2', 'User3', 'User4']; // Sample user names

const HealingSelectPage = ({ setPage }) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmationOpen, setConfirmationOpen] = useState(false);

    const handleUserSelect = (userName) => {
        setSelectedUser(userName);
    };

    const handleConfirmVote = () => {
        setConfirmationOpen(true);
    };

    const handleCancelVote = () => {
        setSelectedUser(null);
    };

    const handleLockVote = () => {
        // Implement logic to lock in the vote
        console.log('Vote locked for:', selectedUser);
        // You can redirect to another page or perform any other action after locking the vote
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h2" align="center" gutterBottom>
                Victim Select Page
            </Typography>
            <Grid container spacing={2} justifyContent="center">
                {users.map((user, index) => (
                    <Grid item key={index}>
                        <Card variant="outlined" onClick={() => handleUserSelect(user)} sx={{ cursor: 'pointer', backgroundColor: selectedUser === user ? '#e0f7fa' : 'inherit' }}>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {user}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
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
        </Container>
    );
};

export default HealingSelectPage;
