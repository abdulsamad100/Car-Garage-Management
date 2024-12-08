import React, { useContext, useState } from "react";
import { Box, Typography, TextField, Button, Paper, TextareaAutosize } from "@mui/material";
import { db } from "../JS Files/Firebase";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { AuthContext } from "../context/AuthContext";

const AppointmentForm = () => {
  const { signin } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: signin?.userLoggedIn?.displayName,
    contact: "",
    carModel: "",
    compName: "",
    carName: "",
    serviceDate: "",
    notes: "",
    createdAt: serverTimestamp(),
    createdBy: signin.userLoggedIn.uid,
    status: "pending",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log("Updated Form Data:", formData); // Debugging
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus("");

    try {
      const appointmentId = uuidv4();
      await setDoc(doc(db, "appointments", appointmentId), {
        ...formData,
        appointmentId,
        createdAt: new Date(), // Automatically add created date
      });
      setSubmissionStatus("Appointment successfully booked!");
      setFormData({
        name: signin?.userLoggedIn?.displayName,
        contact: "",
        carModel: "",
        compName: "",
        carName: "",
        serviceDate: "",
        notes: "",
        createdBy: signin.userLoggedIn.uid,
        status: "pending",
      });
    } catch (error) {
      console.error("Error booking appointment:", error);
      setSubmissionStatus("Failed to book appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, margin: "auto", borderRadius: "20px" }}>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Contact Number"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Company Name"
          name="compName"
          value={formData.compName}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Car Name"
          name="carName"
          value={formData.carName}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Car Model"
          name="carModel"
          value={formData.carModel}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Service Date"
          name="serviceDate"
          type="date"
          value={formData.serviceDate}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextareaAutosize
          name="notes"
          value={formData.notes || ""}
          onChange={handleChange}
          placeholder="Enter information in Detail..."
          minRows={3}
          style={{
            width: "97%",
            padding: "8px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            resize: "none",
          }}
          required
        />
        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Booking..." : "Book Appointment"}
        </Button>
      </form>
      {submissionStatus && (
        <Typography
          variant="body1"
          sx={{
            color: submissionStatus.includes("successfully") ? "green" : "red",
            mt: 2,
          }}
        >
          {submissionStatus}
        </Typography>
      )}
    </Paper>
  );
};

export default AppointmentForm;
