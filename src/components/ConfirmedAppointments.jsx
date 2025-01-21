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
  addDoc,
} from "firebase/firestore";
import { db } from "../JS Files/Firebase";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ConfirmedAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const { signin } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [isloading, setisLoading] = useState(false);
  const [issue, setissue] = useState("");
  const [totalPrice, settotalPrice] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);
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
        const fetchedAppointments = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((appointment) => !appointment.IsDeliver || appointment.IsDeliver === false); // Filter locally

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
  const handleDeliver = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModal2Open(true);
  };

  const confirmDelivery = async () => {
    setisLoading(true);
    try {
      if (!selectedAppointment) return;
  
      const appointmentRef = doc(db, "appointments", selectedAppointment.id);
      const historyRef = collection(db, "history");
      const billsRef = collection(db, "bills"); // Reference to the new "bills" collection
  
      // Update the appointment document in the "appointments" collection
      await updateDoc(appointmentRef, {
        IsDeliver: true,
        status: "Delivered",
        totalPrice,
      });
  
      // Add the appointment details to the "history" collection
      await addDoc(historyRef, {
        ...selectedAppointment,
        totalPrice,
        status: "Delivered",
        IsDeliver: true,
      });
  
      // Add a new document to the "bills" collection
      await addDoc(billsRef, {
        appointmentId: selectedAppointment.id,
        name: selectedAppointment.name,
        issue,
        totalPrice: totalPrice,
        contact: selectedAppointment.contact,
      });
  
      toast.success("Appointment marked as Delivered, added to History, and Bill created!");
      setIsModal2Open(false);
      settotalPrice("");
      setissue("");
      setisLoading(false);
    } catch (error) {
      console.error("Error during final bill confirmation:", error);
      toast.error("Error confirming delivery.");
      setisLoading(false);
    }
  };
  
  const confirmArrival = async () => {
    try {
      const appointmentRef = doc(db, "appointments", selectedAppointment.id);
      await updateDoc(appointmentRef, {
        status: "Arrived",
        IsArrived: true,
        warning: false,
        deliveryDate,
      });
      toast.success("Appointment marked as Arrived!");
      setIsModalOpen(false);
      settotalPrice("");
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
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                      {appointment.name}
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                    {appointment.compName} - {appointment.carName} - {appointment.carModel}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Issue:</strong> {appointment.notes}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Contact:</strong> {appointment.contact}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      <strong>Service Date:</strong>{" "}
                      {serviceDate ? serviceDate.toLocaleDateString() : "N/A"}
                    </Typography>

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

                    {
                      IsArrived && (
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={() => handleDeliver(appointment)}
                          sx={{ mb: 1 }}
                          disabled={appointment.IsDeliver == true}
                        >
                          Deliver
                        </Button>
                      )
                    }

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
            required
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

      <Modal open={isModal2Open} onClose={() => setIsModal2Open(false)}>
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
          <Typography variant="h6" sx={{ mb: 2, fontSize: 25, textAlign: 'center', fontWeight: 'bold', color: "ButtonText" }}>
            Bill Details
          </Typography>
          <Typography variant="h6" sx={{ mb: 2, fontSize: 15 }}>
            Provide Issue
          </Typography>
          <TextField
            required
            fullWidth
            type="text"
            value={issue}
            onChange={(e) => setissue(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Typography variant="h6" sx={{ mb: 2, fontSize: 16 }}>
            Total Bill Amount
          </Typography>
          <TextField
            fullWidth
            type="number"
            value={totalPrice}
            onChange={(e) => settotalPrice(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={confirmDelivery}
            disabled={!totalPrice || !issue || isloading}
          >
            Confirm
          </Button>

        </Box>
      </Modal>
    </Box>
  );
};

export default ConfirmedAppointments;
