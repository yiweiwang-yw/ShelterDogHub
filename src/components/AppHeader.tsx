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
            navigate("/");
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <AppBar position="static" className="mb-4">
            <Toolbar>
                <Typography variant="h6" className="flex-grow">
                    Shelter Dog Hub
                </Typography>
                <IconButton color="inherit" onClick={handleLogout}>
                    <LogoutIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default AppHeader;
