import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import API from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const CommuterPage = () => {
  const { logout } = useAuth();
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [view, setView] = useState("booking"); // Tracks current view

  useEffect(() => {
    fetchTrips();
    fetchBookings();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await API.get("/trip");
      if (response.data.status === "success") {
        setTrips(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching trip data:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await API.get("/bookings/my-bookings");
      if (response.data.status === "success") {
        setBookings(response.data.data.bookings);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleRouteSelect = (trip) => {
    setSelectedRoute(trip);
    setSelectedTimeSlot(null);
    setSelectedSeat(null);
  };

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setSelectedSeat(null);
  };

  const handleSeatSelect = (seat) => {
    setSelectedSeat(seat);
  };

  const handleConfirmBooking = async () => {
    try {
      await API.post("/bookings/add", {
        tripId: selectedRoute.id,
        seatNumber: selectedSeat,
      });
      setSelectedRoute(null);
      setSelectedTimeSlot(null);
      setSelectedSeat(null);
      setOpenConfirmDialog(false);
      fetchTrips();
      fetchBookings();
      alert("Seat booking successfully!");
    } catch (error) {
      console.error("Error seat booking:", error);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await API.put(`/bookings/${bookingId}/cancel`);
      fetchBookings();
      alert("Booking canceled successfully!");
    } catch (error) {
      console.error("Error canceling booking:", error);
    }
  };

  const handleCancelSeatSelection = () => {
    setSelectedSeat(null);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* AppBar */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Commuter Booking
          </Typography>
          <Button color="inherit" onClick={() => setView("booking")}>
            Booking
          </Button>
          <Button color="inherit" onClick={() => setView("table")}>
            My Bookings
          </Button>
          <Button
            color="inherit"
            onClick={handleLogout}
            sx={{
              backgroundColor: "#f44336", // Red background for logout
              "&:hover": { backgroundColor: "#d32f2f" }, // Darker red on hover
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Container>
        {view === "booking" && (
          <>
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
                {trips.map((trip) => (
                  <Grid item xs={12} sm={4} key={trip.id}>
                    <Card
                      onClick={() => handleRouteSelect(trip)}
                      style={{ cursor: "pointer" }}
                    >
                      <CardContent>
                        <Typography variant="h6">
                          {trip.route.origin} to {trip.route.destination}
                        </Typography>
                        <Typography variant="body2">
                          ${trip.route.price}
                        </Typography>
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
                  {selectedRoute.route.schedule.map((slot, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleTimeSlotSelect(slot)}
                        fullWidth
                      >
                        {slot}
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
                  {selectedRoute.bus.seats.map((seat) => (
                    <Grid item xs={4} key={seat.seatNumber}>
                      <Button
                        variant="outlined"
                        color={
                          seat.seatNumber === selectedSeat
                            ? "secondary"
                            : "primary"
                        }
                        disabled={seat.isBooked}
                        onClick={() => handleSeatSelect(seat.seatNumber)}
                        fullWidth
                      >
                        {seat.seatNumber}
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
                  Price: ${selectedRoute.route.price}
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
                  Route:{" "}
                  {selectedRoute
                    ? `${selectedRoute.route.origin} to ${selectedRoute.route.destination}`
                    : "Not selected"}
                  <br />
                  Time Slot: {selectedTimeSlot || "Not selected"}
                  <br />
                  Seat: {selectedSeat || "Not selected"}
                  <br />
                  Price: ${selectedRoute ? selectedRoute.route.price : "N/A"}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setOpenConfirmDialog(false)}
                  color="primary"
                >
                  Cancel
                </Button>
                <Button onClick={handleConfirmBooking} color="primary">
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}

        {view === "table" && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Route</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Seat</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking._id}>
                    <TableCell>
                      {booking.trip.route.origin} to{" "}
                      {booking.trip.route.destination}
                    </TableCell>
                    <TableCell>${booking.price}</TableCell>
                    <TableCell>{booking.seat}</TableCell>
                    <TableCell>{booking.status}</TableCell>
                    <TableCell>
                      {booking.status === "CONFIRMED" && (
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleCancelBooking(booking._id)}
                        >
                          Cancel
                        </Button>
                      )}
                      {booking.status === "CANCELLED" && (
                        <Typography color="textSecondary">
                          Booking Cancelled
                        </Typography>
                      )}
                      {booking.status !== "CONFIRMED" &&
                        booking.status !== "CANCELLED" && (
                          <Typography color="primary">Pending...</Typography>
                        )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </>
  );
};

export default CommuterPage;
