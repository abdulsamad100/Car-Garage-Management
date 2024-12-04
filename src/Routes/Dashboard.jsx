import React, { useContext, useState } from "react";
import { Box, Typography, Grid, Paper, IconButton, Button } from "@mui/material";
import CarRepairIcon from "@mui/icons-material/CarRepair";
import InventoryIcon from "@mui/icons-material/Inventory";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AppointmentForm from "../components/AppointmentForm";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const [selectedSection, setSelectedSection] = useState("Overview");
  const {signin} = useContext(AuthContext)
  
  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f5f5f5", borderRadius:"20px" }}>
      <Box sx={{ flex: 1, p: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, textAlign: "center" , fontWeight:"bold" }}>
        Book Appointment
        </Typography>
            <AppointmentForm />
      </Box>
    </Box>
  );
};

export default Dashboard;
