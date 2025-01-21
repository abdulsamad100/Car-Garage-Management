import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { collection, onSnapshot } from "firebase/firestore";
import { jsPDF } from "jspdf";
import { db } from "../JS Files/Firebase";

const AdminHistory = () => {
  const [historyData, setHistoryData] = useState([]);
  const [billsData, setBillsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState(null);
  const [isBillDialogOpen, setIsBillDialogOpen] = useState(false);

  useEffect(() => {
    const fetchHistory = () => {
      const historyRef = collection(db, "history");

      const unsubscribeHistory = onSnapshot(
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

      return () => unsubscribeHistory();
    };

    const fetchBills = () => {
      const billsRef = collection(db, "bills");

      const unsubscribeBills = onSnapshot(
        billsRef,
        (snapshot) => {
          const fetchedBills = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setBillsData(fetchedBills);
        },
        (error) => {
          console.error("Error fetching bills:", error);
        }
      );

      return () => unsubscribeBills();
    };

    fetchHistory();
    fetchBills();
  }, []);

  const handleViewBill = (appointmentId) => {
    const bill = billsData.find((b) => b.appointmentId === appointmentId);
    setSelectedBill(bill);
    setIsBillDialogOpen(true);
  };

  const handleCloseBillDialog = () => {
    setIsBillDialogOpen(false);
    setSelectedBill(null);
  };

  const handleDownloadPDF = () => {
    if (!selectedBill) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Bill Details", 10, 10);
    doc.setFontSize(12);

    doc.text(`Bill ID: ${selectedBill.id}`, 10, 30);
    doc.text(`Name: ${selectedBill.name}`, 10, 40);
    doc.text(`Contact: ${selectedBill.contact}`, 10, 50);
    doc.text(`Issue: ${selectedBill.issue || "N/A"}`, 10, 60);
    doc.text(`Total Amount: Rs. ${selectedBill.totalPrice}`, 10, 70);

    doc.save(`Bill_${selectedBill.id}.pdf`);
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
                    {record.compName} - {record.carName} - {record.carModel}
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
                    <strong>Contact:</strong> {record.contact}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    <strong>Notes:</strong> {record.notes || "N/A"}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    <strong>Completion Date:</strong>{" "}
                    {record.deliveryDate || "N/A"}
                  </Typography>

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleViewBill(record.appointmentId)}
                    sx={{ mt: 2 }}
                  >
                    View Bill
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={isBillDialogOpen} onClose={handleCloseBillDialog}>
        <DialogTitle>Bill Details</DialogTitle>
        <DialogContent>
          {selectedBill ? (
            <Card
              elevation={3}
              sx={{ p: 3, bgcolor: "#f5f5f5", borderRadius: "12px" }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Bill Information
              </Typography>
              <Typography>
                <strong>Bill ID:</strong> {selectedBill.id}
              </Typography>
              <Typography>
                <strong>Name:</strong> {selectedBill.name}
              </Typography>
              <Typography>
                <strong>Contact:</strong> {selectedBill.contact}
              </Typography>
              <Typography>
                <strong>Issue:</strong> {selectedBill.issue || "N/A"}
              </Typography>
              <Typography>
                <strong>Total Amount:</strong> Rs. {selectedBill.totalPrice}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleDownloadPDF}
                sx={{ mt: 3 }}
              >
                Download PDF
              </Button>
            </Card>
          ) : (
            <Typography>No bill found for this record.</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AdminHistory;
