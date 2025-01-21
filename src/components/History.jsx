import React, { useState, useEffect, useContext } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    CircularProgress,
} from "@mui/material";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../JS Files/Firebase";
import { AuthContext } from "../context/AuthContext";

const History = () => {
    const { signin } = useContext(AuthContext);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!signin?.userLoggedIn?.uid) {
            setLoading(false); 
            return;
        }

        const q = query(
            collection(db, "history"),
            where("createdBy", "==", signin.userLoggedIn.uid) 
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const fetchedHistory = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                console.log(fetchedHistory)
                setHistory(fetchedHistory);
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching history:", error);
                setLoading(false);
            }
        );

        return () => unsubscribe(); 
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
                    Please log in to view your history.
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
                Delivery History
            </Typography>

            {history.length === 0 ? (
                <Typography
                    variant="h6"
                    sx={{ textAlign: "center", color: "text.secondary", mt: 4 }}
                >
                    No delivery history found.
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {history.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item.id}>
                            <Card elevation={3} sx={{ borderRadius: "12px", p: 2 }}>
                                <CardContent>
                                    <Typography
                                        variant="h6"
                                        sx={{ mb: 2, fontWeight: "bold" }}
                                    >
                                        {item.carName} - {item.carModel}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mb: 1 }}
                                    >
                                        <strong>Company Name:</strong> {item.compName}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mb: 1 }}
                                    >
                                        <strong>Contact:</strong> {item.contact}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mb: 1 }}
                                    >
                                        <strong>Delivery Date:</strong>{" "}
                                        {item.deliveryDate
                                            ? item.deliveryDate.toDate
                                                ? item.deliveryDate
                                                      .toDate()
                                                      .toLocaleString() 
                                                : new Date(item.deliveryDate).toLocaleString() 
                                            : "N/A"}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mb: 2 }}
                                    >
                                        <strong>Notes:</strong> {item.notes || "N/A"}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default History;
