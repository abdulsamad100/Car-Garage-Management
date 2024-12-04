import React, { useContext, useEffect, useState } from "react";
import { Box, Typography, Grid, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../JS Files/Firebase";

const AdminDashboard = () => {
    const { signin } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);

    if (!signin.isAdmin) {
        return <Navigate to="/" />;
    }

   
    useEffect(() => {
       
        const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
            setUsers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });

       
        const unsubscribeAppointments = onSnapshot(collection(db, "appointments"), (snapshot) => {
            setAppointments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });

        return () => {
            unsubscribeUsers();
            unsubscribeAppointments();
        };
    }, []);

    const stats = [
        { title: "Users", value: users.length },
        { title: "Appointments", value: appointments.length },
        { title: "Revenue", value: "$15,000" },
        { title: "Feedbacks", value: 32 },
    ];

    return (
        <Box sx={{ p: 4, bgcolor: "#f9f9f9", minHeight: "100vh", borderRadius: "16px" }}>
            {/* Header Section */}
            <Typography variant="h4" sx={{ mb: 4, textAlign: "center", fontWeight: "bold" }}>
                Admin Dashboard
            </Typography>

            {/* Stats Section */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Paper elevation={3} sx={{ p: 3, textAlign: "center", borderRadius: "12px" }}>
                            <Typography variant="h6" color="primary">
                                {stat.title}
                            </Typography>
                            <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
                                {stat.value}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Recent Activity Section */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                    Recent Activity
                </Typography>
                {recentActivity.map((activity) => (
                    <Paper
                        key={activity.id}
                        elevation={2}
                        sx={{ p: 2, mb: 1, borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                    >
                        <Typography>{activity.activity}</Typography>
                        <Typography variant="caption" color="text.secondary">
                            {activity.time}
                        </Typography>
                    </Paper>
                ))}
            </Box>

            <Box>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                    Appointments
                </Typography>
                <TableContainer component={Paper} sx={{ borderRadius: "12px" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>ID</strong></TableCell>
                                <TableCell><strong>Name</strong></TableCell>
                                <TableCell><strong>Appointment Date</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                <TableCell><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {appointments.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.appointment}</TableCell>
                                    <TableCell>{row.status}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" size="small" color="primary" sx={{ mr: 1 }}>
                                            Edit
                                        </Button>
                                        <Button variant="outlined" size="small" color="secondary">
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default AdminDashboard;
