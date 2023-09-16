import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import LoginPage from './pages/LoginPage';
import DogSearchPage from './pages/DogSearchPage';

function App() {
    return (
        <>
            <CssBaseline />
            <Router>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/search" element={<DogSearchPage />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;
