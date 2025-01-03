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
} from "firebase/firestore";
import { db } from "../JS Files/Firebase";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ConfirmedAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const { signin } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  if (signin?.userLoggedIn?.uid !== "KwjulzXHJbXp0SEFMZcih4nvHtx2") {
    navigate("/Dashboard");
  }

  useEffect(() => {
    const q = query(
      collection(db, "appointments"),
      where("status", "in", ["Confirmed", "Arrived"])
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

  const handleArrive = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const confirmArrival = async () => {
    try {
      const appointmentRef = doc(db, "appointments", selectedAppointment.id);
      await updateDoc(appointmentRef, {
        status: "Arrived",
        IsArrived: true,
        deliveryDate,
      });
      toast.success("Appointment marked as Arrived!");
      setIsModalOpen(false);
      setDeliveryDate("");
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

  const checkForNotification = (appointment) => {
    const today = new Date().toISOString().split("T")[0];
    return appointment.deliveryDate === today;
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
            const notify = checkForNotification(appointment);
            const IsArrived = appointment.IsArrived

            return (
              <Grid item xs={12} sm={6} md={4} key={appointment.id}>
                <Card
                  elevation={3}
                  sx={{
                    borderRadius: "12px",
                    p: 2,
                    border: (isExpired && !IsArrived) ? "2px solid red" : "none",
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
                    {notify && (
                      <Typography
                        variant="body2"
                        color="primary"
                        sx={{ mb: 2, fontWeight: "bold" }}
                      >
                        Notify: Please pick up your car today!
                      </Typography>
                    )}
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => handleArrive(appointment)}
                      sx={{ mb: 1 }}
                      disabled={appointment.status === "Arrived"}
                    >
                      Arrive
                    </Button>
                    {isExpired && appointment.status !== "Arrived" && (
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

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            p: 4,
            borderRadius: "8px",
            boxShadow: 24,
            minWidth: "300px",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Set Delivery Date
          </Typography>
          <TextField
            fullWidth
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            sx={{ mb: 2 }}
            inputProps={{
              min: new Date().toISOString().split("T")[0],
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={confirmArrival}
            disabled={!deliveryDate}
          >
            Confirm
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default ConfirmedAppointments;
