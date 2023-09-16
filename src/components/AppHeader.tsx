import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/auth";

const AppHeader: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            // The user data has been cleared from sessionStorage in the logout function
            navigate("/");
        } catch (error) {
            console.error("Error during logout:", error);
            // Optionally, you can show an error notification to the user
        }
    };

    return (
        <AppBar position="static" className="mb-4">
            <Toolbar>
                <Typography variant="h6" className="flex-grow">
                    Dog App
                </Typography>
                <IconButton color="inherit" onClick={handleLogout}>
                    <LogoutIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default AppHeader;
