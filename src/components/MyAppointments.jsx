import React, { useState, useEffect, useContext } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Chip,
    CircularProgress,
} from "@mui/material";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../JS Files/Firebase";
import { AuthContext } from "../context/AuthContext";

const MyAppointments = () => {
    const { signin } = useContext(AuthContext);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, "appointments"),
            where("createdBy", "==", signin.userLoggedIn.uid)
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const fetchedAppointments = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setAppointments(fetchedAppointments);
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching appointments:", error);
                setLoading(false);
            }
        );

        return () => unsubscribe(); // Cleanup subscription on component unmount
    }, [signin.userLoggedIn.uid]);

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4, bgcolor: "#f9f9f9", minHeight: "100vh" }}>
            <Typography
                variant="h4"
                sx={{ mb: 4, textAlign: "center", fontWeight: "bold" }}
            >
                My Appointments
            </Typography>

            {appointments.length === 0 ? (
                <Typography
                    variant="h6"
                    sx={{ textAlign: "center", color: "text.secondary", mt: 4 }}
                >
                    No bookings yet.
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {appointments.map((appointment) => (
                        <Grid item xs={12} sm={6} md={4} key={appointment.id}>
                            <Card elevation={3} sx={{ borderRadius: "12px", p: 2 }}>
                                <CardContent>
                                    <Typography
                                        variant="h6"
                                        sx={{ mb: 2, fontWeight: "bold" }}
                                    >
                                        {appointment.carName} - {appointment.carModel}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mb: 1 }}
                                    >
                                        <strong>Company Name:</strong> {appointment.compName}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mb: 1 }}
                                    >
                                        <strong>Contact:</strong> {appointment.contact}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mb: 1 }}
                                    >
                                        <strong>Service Date:</strong>{" "}
                                        {appointment.createdAt
                                            ? appointment.createdAt.toDate().toLocaleString()
                                            : "N/A"}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mb: 2 }}
                                    >
                                        <strong>Notes:</strong> {appointment.notes || "N/A"}
                                    </Typography>
                                    <Chip
                                        label={appointment.status}
                                        color={
                                            appointment.status === "pending"
                                                ? "warning"
                                                : appointment.status === "Confirmed"
                                                    ? "success"
                                                    : "error"
                                        }
                                        sx={{ fontWeight: "bold", mb: 1 }}
                                    />
                                    {appointment.status === "Rejected" && (
                                        <div style={{display:"flex", gap:7}}>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: "red",
                                                    fontWeight: "bold",
                                                    mt: 1,
                                                }}
                                            >
                                                Reason:
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: "black",
                                                    fontWeight: "medium",
                                                    mt: 1,
                                                }}
                                            >
                                                {appointment.rejectionReason || "N/A"}
                                            </Typography>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default MyAppointments;
