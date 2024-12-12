import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../JS Files/Firebase";
import { DatePicker } from "@mui/x-date-pickers";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ConfirmedAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const { signin } = useContext(AuthContext)
  const [loading, setLoading] = useState(true);
  const [deliveryDate, setDeliveryDate] = useState(null);
  const navigate = useNavigate()

  if (signin?.userLoggedIn?.uid !== "KwjulzXHJbXp0SEFMZcih4nvHtx2") {
    navigate("/Dashboard")
  }

  useEffect(() => {
    const q = query(
      collection(db, "appointments"),
      where("status", "==", "Confirmed")
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
        console.error("Error fetching confirmed appointments:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleArrive = async (appointment) => {
    try {
      const appointmentRef = doc(db, "appointments", appointment.id);
      await updateDoc(appointmentRef, { status: "Arrived" });
      toast.success("Appointment marked as Arrived!");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating status.");
    }
  };

  const handleDeliver = async (appointment) => {
    try {
      const appointmentRef = doc(db, "appointments", appointment.id);
      await updateDoc(appointmentRef, { status: "Delivered", deliveryDate });
      toast.success("Appointment marked as Delivered!");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating status.");
    }
  };

  const handleWarn = async (appointment) => {
    try {
      const appointmentRef = doc(db, "appointments", appointment.id);
      await updateDoc(appointmentRef, { warning: true });
      toast.success("Customer warned successfully!");
    } catch (error) {
      console.error("Error updating warning status:", error);
      toast.error("Error warning customer.");
    }
  };

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
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, bgcolor: "#f9f9f9", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: "center", fontWeight: "bold" }}>
        Confirmed Appointments
      </Typography>

      {appointments.length === 0 ? (
        <Typography
          variant="h6"
          sx={{ textAlign: "center", color: "text.secondary", mt: 4 }}
        >
          No confirmed appointments.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {appointments.map((appointment) => {
            const serviceDateStr = appointment.serviceDate || null;
            const serviceDate = serviceDateStr ? new Date(serviceDateStr) : null;
            const isExpired = serviceDate && serviceDate < new Date();

            return (
              <Grid item xs={12} sm={6} md={4} key={appointment.id}>
                <Card
                  elevation={3}
                  sx={{
                    borderRadius: "12px",
                    p: 2,
                    border: isExpired ? "2px solid red" : "none",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                      {appointment.carName} - {appointment.carModel}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Company Name:</strong> {appointment.compName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Contact:</strong> {appointment.contact}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      <strong>Service Date:</strong>{" "}
                      {serviceDate ? serviceDate.toLocaleDateString() : "N/A"}
                    </Typography>
                    {isExpired && (
                      <Typography
                        variant="body2"
                        color="error"
                        sx={{ mb: 2, fontWeight: "bold" }}
                      >
                        Service Date has expired!
                      </Typography>
                    )}
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => handleArrive(appointment)}
                      sx={{ mb: 1 }}
                    >
                      {appointment.status === "Arrived" ? "Deliver" : "Arrive"}
                    </Button>
                    {isExpired && (
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleWarn(appointment)}
                      >
                        Warn
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}

        </Grid>
      )}
    </Box>
  );
};

export default ConfirmedAppointments;
