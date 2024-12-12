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
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../JS Files/Firebase";
import { AuthContext } from "../context/AuthContext";
import CloseIcon from '@mui/icons-material/Close';
import toast from "react-hot-toast";
const MyAppointments = () => {
    const { signin } = useContext(AuthContext);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const hideAppointment = async (appointmentId) => {
        try {
            const appointmentRef = doc(db, "appointments", appointmentId);
            await updateDoc(appointmentRef, { hiddenStatus: true });
            toast.success("Appointment Removed")
            console.log(`Appointment with ID ${appointmentId} is now hidden.`);
        } catch (error) {
            console.error("Error hiding appointment:", error);
        }
    };

    useEffect(() => {
        // Check if user is logged in
        if (!signin?.userLoggedIn?.uid) {
            setLoading(false); // Stop loading if user is not logged in
            return;
        }

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
    }, [signin?.userLoggedIn?.uid]);

    if (!signin?.userLoggedIn) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                }}
            >
                <Typography variant="h6" color="text.secondary">
                    Please log in to view your appointments.
                </Typography>
            </Box>
        );
    }

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
                            {!appointment.hiddenStatus &&
                                <Card elevation={3} sx={{ borderRadius: "12px", p: 2, display: "flex", justifyContent: "space-between" }}>
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
                                        {appointment.warning && (
                                            <Typography
                                                variant="body2"
                                                color="error"
                                                sx={{
                                                    fontWeight: "bold",
                                                    mt: 1,
                                                }}
                                            >
                                                You had been warned to reach ASAP!
                                            </Typography>
                                        )}
                                        {appointment.status === "Rejected" && (
                                            <div style={{ display: "flex", gap: 7 }}>
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
                                    {
                                        appointment.status == "Rejected" &&
                                        <CloseIcon sx={{ cursor: "pointer" }} onClick={() => hideAppointment(appointment.id)}></CloseIcon>
                                    }
                                </Card>
                            }
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default MyAppointments;