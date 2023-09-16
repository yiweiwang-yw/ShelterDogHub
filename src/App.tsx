import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import LoginPage from './pages/LoginPage';
import DogSearchPage from './pages/DogSearchPage';
import AppHeader from './components/AppHeader';

function App() {
    return (
        <>
            <CssBaseline />
            <Router>
                <AppHeader />
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/search" element={<DogSearchPage />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;
