import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
} from "@mui/material";

const CommuterPage = () => {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const routes = [
    {
      id: 1,
      name: "Route A",
      price: 15,
      timeSlots: [
        { time: "10:00 AM", availableSeats: ["A1", "A2", "B1", "B2"] },
        { time: "2:00 PM", availableSeats: ["A1", "B2", "B3"] },
      ],
    },
    {
      id: 2,
      name: "Route B",
      price: 20,
      timeSlots: [
        { time: "9:00 AM", availableSeats: ["A1", "B1", "B2"] },
        { time: "12:00 PM", availableSeats: ["A2", "B1", "B3"] },
      ],
    },
    {
      id: 3,
      name: "Route C",
      price: 25,
      timeSlots: [
        { time: "11:00 AM", availableSeats: ["A1", "A2", "B2"] },
        { time: "3:00 PM", availableSeats: ["A3", "B1", "B3"] },
      ],
    },
  ];

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
    setSelectedTimeSlot(null); // Reset time slot when a new route is selected
    setSelectedSeat(null); // Reset seat selection
  };

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setSelectedSeat(null); // Reset seat selection when a new time slot is chosen
  };

  const handleSeatSelect = (seat) => {
    setSelectedSeat(seat);
  };

  const handleConfirmBooking = () => {
    alert(
      `Booking Confirmed for ${selectedRoute.name} on ${selectedTimeSlot.time} at seat ${selectedSeat}`
    );
    setOpenConfirmDialog(false);
  };

  const handleCancelSeatSelection = () => {
    setSelectedSeat(null); // Reset seat selection
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Commuter Booking
      </Typography>

      {/* View Routes */}
      <Box
        sx={{
          border: "1px solid #ccc",
          padding: 2,
          borderRadius: 2,
          marginBottom: 3,
        }}
      >
        <Typography variant="h6">Select a Route</Typography>
        <Grid container spacing={2}>
          {routes.map((route) => (
            <Grid item xs={12} sm={4} key={route.id}>
              <Card
                onClick={() => handleRouteSelect(route)}
                style={{ cursor: "pointer" }}
              >
                <CardContent>
                  <Typography variant="h6">{route.name}</Typography>
                  <Typography variant="body2">${route.price}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Time Slot Selection */}
      {selectedRoute && (
        <Box
          sx={{
            border: "1px solid #ccc",
            padding: 2,
            borderRadius: 2,
            marginBottom: 3,
          }}
        >
          <Typography variant="h6" style={{ marginTop: "20px" }}>
            Select a Time Slot
          </Typography>
          <Grid container spacing={2}>
            {selectedRoute.timeSlots.map((slot, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Button
                  variant="outlined"
                  color={
                    slot.availableSeats.length > 0 ? "primary" : "disabled"
                  }
                  disabled={slot.availableSeats.length === 0}
                  onClick={() => handleTimeSlotSelect(slot)}
                  fullWidth
                >
                  {slot.time}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Seat Selection */}
      {selectedTimeSlot && (
        <Box
          sx={{
            border: "1px solid #ccc",
            padding: 2,
            borderRadius: 2,
            marginBottom: 3,
          }}
        >
          <Typography variant="h6" style={{ marginTop: "20px" }}>
            Select a Seat
          </Typography>
          <Grid container spacing={2}>
            {selectedTimeSlot.availableSeats.map((seat) => (
              <Grid item xs={4} key={seat}>
                <Button
                  variant="outlined"
                  color={seat === selectedSeat ? "secondary" : "primary"}
                  onClick={() => handleSeatSelect(seat)}
                  fullWidth
                >
                  {seat}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Confirm Booking */}
      {selectedSeat && selectedRoute && selectedTimeSlot && (
        <>
          <Typography variant="h6" style={{ marginTop: "20px" }}>
            Price: ${selectedRoute.price}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenConfirmDialog(true)}
            style={{ marginTop: "20px" }}
          >
            Confirm Booking
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleCancelSeatSelection}
            style={{ marginTop: "10px" }}
          >
            Cancel Seat Selection
          </Button>
        </>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>Confirm Your Booking</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Route: {selectedRoute ? selectedRoute.name : "Not selected"}
            <br />
            Time Slot:{" "}
            {selectedTimeSlot ? selectedTimeSlot.time : "Not selected"}
            <br />
            Seat: {selectedSeat ? selectedSeat : "Not selected"}
            <br />
            Price: ${selectedRoute ? selectedRoute.price : "N/A"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmBooking} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CommuterPage;
