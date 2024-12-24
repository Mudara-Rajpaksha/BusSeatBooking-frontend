import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TextField,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import CloseIcon from "@mui/icons-material/Close";
import Autocomplete from "@mui/material/Autocomplete";
import API from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const seats = [
  { seatNumber: "A1", isBooked: false },
  { seatNumber: "A2", isBooked: false },
  { seatNumber: "A3", isBooked: false },
  { seatNumber: "A4", isBooked: false },
  { seatNumber: "A5", isBooked: false },
  { seatNumber: "B1", isBooked: false },
  { seatNumber: "B2", isBooked: false },
  { seatNumber: "B3", isBooked: false },
  { seatNumber: "B4", isBooked: false },
  { seatNumber: "B5", isBooked: false },
  { seatNumber: "C1", isBooked: false },
  { seatNumber: "C2", isBooked: false },
  { seatNumber: "C3", isBooked: false },
  { seatNumber: "C4", isBooked: false },
  { seatNumber: "C5", isBooked: false },
];

const amenities = [
  { title: "WiFi" },
  { title: "AC" },
  { title: "USB Charging" },
];

function OperatorPage() {
  const { logout } = useAuth();
  const [tabIndex, setTabIndex] = useState(0);
  const [view, setView] = useState("tabs");
  const [busData, setBusData] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [busAssignments, setBusAssignments] = useState({
    route: "",
    bus: "",
  });
  const [newBus, setNewBus] = useState({
    busNumber: "",
    seats: [],
    amenities: [],
    isActive: true,
  });

  useEffect(() => {
    fetchBusData();
    fetchRoutes();
  }, []);

  const fetchBusData = async () => {
    try {
      const response = await API.get("/bus");
      if (response.data.status === "success") {
        setBusData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching bus data:", error);
    }
  };

  const fetchRoutes = async () => {
    try {
      const response = await API.get("/routes");
      if (response.data.status === "success") {
        setRoutes(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleAssignmentChange = (event) => {
    const { name, value } = event.target;
    setBusAssignments((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssignBus = async () => {
    console.log("Assigned:", busAssignments);
    try {
      await API.post("/trip/add", busAssignments);
      alert("Bus assigned to Route successfully!");
      setView("tabs");
    } catch (error) {
      console.error("Error assigned to Route:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleNewBusChange = (e, value) => {
    const { name } = e.target;
    if (name === "seats" || name === "amenities") {
      setNewBus((prev) => ({ ...prev, [name]: value }));
    } else {
      const { value } = e.target;
      setNewBus((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNewBusSubmit = async () => {
    const formattedBus = {
      registrationNumber: newBus.busNumber,
      seats: newBus.seats.map((seat) => ({
        seatNumber: seat.seatNumber,
        isBooked: seat.isBooked,
      })),
      amenities: newBus.amenities.map((amenity) => amenity.title),
      isActive: newBus.isActive,
    };

    try {
      await API.post("/bus/add", formattedBus);
      alert("New bus added successfully!");
      fetchBusData();
      setNewBus({ busNumber: "", seats: [], amenities: [] });
      setView("tabs");
    } catch (error) {
      console.error("Error adding bus:", error);
    }
  };

  const renderAddNewBusView = () => (
    <Box sx={{ width: "80%", margin: "2px", p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Add New Bus
      </Typography>
      <Paper elevation={3} style={{ padding: "16px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Bus Number"
              name="busNumber"
              value={newBus.busNumber}
              onChange={handleNewBusChange}
              required
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              name="seats"
              id="seats-outlined"
              options={seats}
              getOptionLabel={(option) => option.seatNumber || "Untitled"}
              value={newBus.seats || []}
              onChange={(event, value) =>
                handleNewBusChange({ target: { name: "seats" } }, value)
              }
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Seats"
                  placeholder="Select Seats"
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              name="amenities"
              id="amenities-outlined"
              options={amenities}
              getOptionLabel={(option) => option.title || "Untitled"}
              value={newBus.amenities || []}
              onChange={(event, value) =>
                handleNewBusChange({ target: { name: "amenities" } }, value)
              }
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Amenities"
                  placeholder="Select amenities"
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNewBusSubmit}
                startIcon={<AddIcon />}
              >
                Add
              </Button>
              <Button
                variant="contained"
                color="warning"
                onClick={() =>
                  setNewBus({
                    busNumber: "",
                    seats: [],
                    amenities: [],
                  })
                }
                startIcon={<CleaningServicesIcon />}
              >
                Clear
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => setView("tabs")}
                startIcon={<CloseIcon />}
              >
                Cancel
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );

  return view === "tabs" ? (
    <Box
      sx={{
        width: "200%",
        margin: "auto",
        border: "2px solid #1976d2",
        borderRadius: "8px",
        justifyContent: "center",
      }}
    >
      {/* App Bar */}
      <AppBar position="static" sx={{ width: "100%" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Operator Panel</Typography>
          <Button
            color="inherit"
            onClick={handleLogout}
            sx={{
              width: "100px",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setView("addNewBus")}
        >
          Add New Bus
        </Button>
      </Box>

      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        variant="fullWidth"
        textColor="inherit"
        indicatorColor="primary"
      >
        <Tab label="Buses" />
        <Tab label="Bookings" />
        <Tab label="Assign Bus" />
      </Tabs>

      {tabIndex === 0 && (
        <Box sx={{ width: "80%", margin: "auto", p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Seat Status
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper elevation={3}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Bus Number</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {busData.map((bus) => (
                      <TableRow key={bus._id}>
                        <TableCell>{bus.registrationNumber}</TableCell>
                        <TableCell>
                          {bus.isActive ? "Active" : "Inactive"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}

      {tabIndex === 1 && (
        <Box sx={{ width: "80%", margin: "auto", p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Bookings Per Route/Bus
          </Typography>
          <Paper elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Route</TableCell>
                  <TableCell>Bus</TableCell>
                  <TableCell>Bookings</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Route 101</TableCell>
                  <TableCell>Bus A</TableCell>
                  <TableCell>45</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Route 202</TableCell>
                  <TableCell>Bus B</TableCell>
                  <TableCell>30</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </Box>
      )}

      {tabIndex === 2 && (
        <Box sx={{ width: "80%", margin: "auto", p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Assign Bus to Route
          </Typography>
          <Paper elevation={3} style={{ padding: "16px" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Route</InputLabel>
                  <Select
                    name="route"
                    value={busAssignments.route}
                    onChange={handleAssignmentChange}
                  >
                    {routes.map((route) => (
                      <MenuItem key={route._id} value={route._id}>
                        {`${route.origin} → ${route.destination}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Bus</InputLabel>
                  <Select
                    name="bus"
                    value={busAssignments.bus}
                    onChange={handleAssignmentChange}
                  >
                    {busData.map((bus) => (
                      <MenuItem key={bus._id} value={bus._id}>
                        {bus.registrationNumber}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleAssignBus}
                >
                  Assign Bus
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      )}
    </Box>
  ) : (
    renderAddNewBusView()
  );
}

export default OperatorPage;
