// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import HomePage from './components/HomePage';
import SignIn from './components/auth/SignIn';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Loader from './components/Loader';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const theme = createTheme({
  typography: {
    fontFamily: '"Play", cursive',
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

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route
              path="/*"
              element={
                <RequireAuth>
                  <HomePage />
                </RequireAuth>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return user ? children : <Navigate to="/signin" />;
};

export default App;
