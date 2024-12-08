import React, { useEffect, useState } from "react";
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
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../JS Files/Firebase";
import { DatePicker } from "@mui/x-date-pickers";

const ConfirmedAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  console.log("chl rha hai");
  

  useEffect(() => {
    const q = query(
      collection(db, "appointments"),
      where("status", "==", "confirmed")
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

    return () => unsubscribe(); // Cleanup subscription on component unmount
  }, []);

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenModal(true);
  };

  const handleSaveDeliveryDate = async () => {
    if (deliveryDate && selectedAppointment) {
      try {
        const appointmentRef = doc(db, "appointments", selectedAppointment.id);
        await updateDoc(appointmentRef, { deliveryDate });
        alert("Delivery date saved successfully!");
        setOpenModal(false);
        setSelectedAppointment(null);
        setDeliveryDate(null);
      } catch (error) {
        console.error("Error saving delivery date:", error);
      }
    } else {
      alert("Please select a delivery date.");
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
          {appointments.map((appointment) => (
            <Grid item xs={12} sm={6} md={4} key={appointment.id}>
              <Card elevation={3} sx={{ borderRadius: "12px", p: 2 }}>
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
                    {appointment.createdAt
                      ? appointment.createdAt.toDate().toLocaleString()
                      : "N/A"}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleEdit(appointment)}
                  >
                    Edit
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            p: 4,
            borderRadius: "12px",
            width: 400,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Edit Appointment
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Select an action:
          </Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mb: 2 }}
            onClick={() => {
              // Show the date picker for "Arrive"
              setDeliveryDate(null);
            }}
          >
            Arrive
          </Button>
          {deliveryDate !== null && (
            <Box sx={{ mb: 2 }}>
              <DatePicker
                label="Delivery Date"
                value={deliveryDate}
                onChange={(date) => setDeliveryDate(date)}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
              <Button
                variant="contained"
                color="success"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleSaveDeliveryDate}
              >
                Save Delivery Date
              </Button>
            </Box>
          )}
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={() => setOpenModal(false)}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default ConfirmedAppointments;
