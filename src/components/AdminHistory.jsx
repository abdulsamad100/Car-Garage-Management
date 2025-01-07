import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
} from "@mui/material";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../JS Files/Firebase";

const AdminHistory = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = () => {
      const historyRef = collection(db, "history");

      const unsubscribe = onSnapshot(
        historyRef,
        (snapshot) => {
          const fetchedHistory = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setHistoryData(fetchedHistory);
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching history:", error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    };

    fetchHistory();
  }, []);

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
        All Users' History
      </Typography>

      {historyData.length === 0 ? (
        <Typography
          variant="h6"
          sx={{ textAlign: "center", color: "text.secondary", mt: 4 }}
        >
          No history records found.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {historyData.map((record) => (
            <Grid item xs={12} sm={6} md={4} key={record.id}>
              <Card elevation={3} sx={{ borderRadius: "12px", p: 2 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, fontWeight: "bold" }}
                  >
                    {record.carName} - {record.carModel}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    <strong>User ID:</strong> {record.createdBy || "N/A"}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    <strong>Company Name:</strong> {record.compName}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    <strong>Contact:</strong> {record.contact}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    <strong>Completion Date:</strong>{" "}
                    {record.completedAt
                      ? record.completedAt.toDate().toLocaleString()
                      : "N/A"}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    <strong>Notes:</strong> {record.notes || "N/A"}
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

export default AdminHistory;
