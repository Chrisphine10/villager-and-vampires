// src/components/Loader.js
import React from 'react';
import { ClipLoader } from 'react-spinners';
import { Box } from '@mui/material';

const Loader = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#000000',
            }}
        >
            <ClipLoader color="#ff1744" size={150} />
        </Box>
    );
};

export default Loader;
