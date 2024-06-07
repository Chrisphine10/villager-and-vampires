
import { createTheme, ThemeProvider } from '@mui/material/styles';
const theme = createTheme({
    typography: {
        fontFamily: '"Press Start 2P", cursive',
        h1: {
            color: '#ff1744',
        },
        h2: {
            color: '#d500f9',
        },
        h3: {
            color: '#00e5ff',
        },
        body1: {
            color: '#ffffff',
        },
    },
    palette: {
        background: {
            default: '#000000',
        },
        primary: {
            main: '#ff1744',
        },
        secondary: {
            main: '#d500f9',
        },
    },
});