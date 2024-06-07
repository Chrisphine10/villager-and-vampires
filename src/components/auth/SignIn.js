import React, { useState } from 'react';
import { auth } from '../../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';

const SignIn = () => {
    const navigate = useNavigate();
    const [termsAccepted, setTermsAccepted] = useState(false);

    const signInWithGoogle = async () => {
        if (!termsAccepted) {
            alert("Please accept the terms and conditions.");
            return;
        }

        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            navigate('/'); // Redirect to home page after sign-in
        } catch (error) {
            console.error("Error signing in: ", error);
        }
    };

    return (
        <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={2}
            style={{ minHeight: '100vh' }}
        >
            <Grid item>
                <Typography variant="h3" gutterBottom>
                    Welcome to Vampires and Villages
                </Typography>
            </Grid>
            <Grid item>
                <Typography variant="body1" paragraph>
                    Discover the secrets of the world around you.
                </Typography>
            </Grid>
            <Grid item>
                <Typography variant="subtitle1" gutterBottom>
                    This game is meant to help you connect with people around you.
                </Typography>
            </Grid>
            <Grid item>
                <FormControlLabel
                    control={<Checkbox checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />}
                    label="I accept the terms and conditions"
                />
            </Grid>
            <Grid item>
                <Button variant="contained" color="primary" onClick={signInWithGoogle} disabled={!termsAccepted}>
                    Sign in with Google
                </Button>
            </Grid>
            <Grid item>
                <Typography variant="body2">
                    By signing in, you agree to our <Link href="#" target="_blank" rel="noopener">terms and conditions</Link>.
                </Typography>
            </Grid>
        </Grid>
    );
};

export default SignIn;
