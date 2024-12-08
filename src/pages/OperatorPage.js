import React, { useState } from "react";
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
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";

function OperatorPage() {
  const [tabIndex, setTabIndex] = useState(0);
  const [busAssignments, setBusAssignments] = useState({
    route: "",
    bus: "",
  });

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleAssignmentChange = (event) => {
    const { name, value } = event.target;
    setBusAssignments((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssignBus = () => {
    console.log("Assigned:", busAssignments);
    alert(
      `Bus "${busAssignments.bus}" assigned to Route "${busAssignments.route}"`
    );
  };

  return (
    <Box
      sx={{
        width: "200%",
        margin: "auto",
        //p: 3,
        border: "2px solid #1976d2",
        borderRadius: "8px",
        justifyContent: "center",
      }}
    >
      {/* App Bar */}
      <AppBar position="static" sx={{ width: "100%" }}>
        <Toolbar>
          <Typography variant="h6">Operator Panel</Typography>
        </Toolbar>
      </AppBar>

      {/* Tabs for Navigation */}
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        variant="fullWidth"
        textColor="inherit"
        indicatorColor="primary"
      >
        <Tab label="Seat Status" />
        <Tab label="Bookings" />
        <Tab label="Assign Bus" />
      </Tabs>

      {/* Content Panels */}
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
                      <TableCell>Seat Number</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>1</TableCell>
                      <TableCell>Reserved</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2</TableCell>
                      <TableCell>Available</TableCell>
                    </TableRow>
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
                    <MenuItem value="Route 101">Route 101</MenuItem>
                    <MenuItem value="Route 202">Route 202</MenuItem>
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
                    <MenuItem value="Bus A">Bus A</MenuItem>
                    <MenuItem value="Bus B">Bus B</MenuItem>
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
  );
}

export default OperatorPage;
