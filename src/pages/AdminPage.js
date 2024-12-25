import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
  Autocomplete,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import CloseIcon from "@mui/icons-material/Close";
import API from "../services/api";
import "../css/AdminPage.css";
import { useAuth } from "../contexts/AuthContext";

const AdminPage = () => {
  const { logout } = useAuth();
  const [routes, setRoutes] = useState([]);
  const [operators, setOperators] = useState([]);
  const [form, setForm] = useState({
    origin: "",
    destination: "",
    schedule: [],
    operator: "",
    price: "",
  });
  const [view, setView] = useState("grid");

  const generateBusTimeSlots = () => {
    const times = [];
    const startHour = 6;
    const endHour = 22;

    for (let hour = startHour; hour <= endHour; hour++) {
      const hourString = hour < 10 ? `0${hour}` : `${hour}`;
      times.push(`${hourString}:00 AM`);
      times.push(`${hourString}:30 AM`);
    }

    return times;
  };

  const scheduleOptions = generateBusTimeSlots();

  const fetchRoutes = async () => {
    try {
      const response = await API.get("/routes");
      setRoutes(response.data.data);
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  const fetchOperators = async () => {
    try {
      const response = await API.get("/users/role/operator");
      setOperators(response.data.data);
    } catch (error) {
      console.error("Error fetching operators:", error);
    }
  };

  useEffect(() => {
    fetchRoutes();
    fetchOperators();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleScheduleChange = (event, newValue) => {
    setForm({ ...form, schedule: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(form);
    try {
      await API.post("/routes/add", form);
      alert("New route added successfully!");
      setForm({
        origin: "",
        destination: "",
        schedule: [],
        operator: "",
        price: "",
      });
      setView("grid");
      fetchRoutes();
    } catch (error) {
      console.error("Error adding route:", error);
    }
  };

  // Logout function
  const handleLogout = async () => {
    await logout();
  };

  const renderGridView = () => (
    <Container sx={{ marginBottom: 50 }}>
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxWidth: 500,
          margin: "0 auto",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Route Management
        </Typography>
        <Box mt={2} sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setView("addNew")}
            startIcon={<AddIcon />}
            sx={{
              borderRadius: "12px", // Rounded corners
              padding: "10px 20px", // Padding for the button
            }}
          >
            Add New Route
          </Button>

          <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout} // Trigger logout
            startIcon={<CloseIcon />}
            sx={{
              backgroundColor: "#f44336", // Red background color for logout
              borderRadius: "12px", // Rounded corners
              padding: "10px 20px", // Padding for the button
              "&:hover": {
                backgroundColor: "#d32f2f", // Darker red on hover
              },
            }}
          >
            Logout
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Origin</TableCell>
                <TableCell>Destination</TableCell>
                <TableCell>Operator</TableCell>
                <TableCell>Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {routes.length > 0 ? (
                routes.map((route) => (
                  <TableRow key={route._id}>
                    <TableCell>{route._id}</TableCell>
                    <TableCell>{route.origin}</TableCell>
                    <TableCell>{route.destination}</TableCell>
                    <TableCell>{route.operator.username}</TableCell>
                    <TableCell>${route.price}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No routes found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );

  const renderAddNewView = () => (
    <Container sx={{ marginBottom: 10 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxWidth: 500,
          margin: "0 auto",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Typography fontSize="25px" variant="h4" gutterBottom>
            Add Route
          </Typography>
        </Box>
        <TextField
          label="Origin"
          name="origin"
          value={form.origin || ""}
          onChange={handleChange}
          required
          fullWidth
          size="small"
        />
        <TextField
          label="Destination"
          name="destination"
          value={form.destination || ""}
          onChange={handleChange}
          required
          fullWidth
          size="small"
        />

        {/* Schedule Multi-Select */}
        <Autocomplete
          multiple
          name="schedule"
          value={form.schedule || []}
          onChange={handleScheduleChange}
          options={scheduleOptions}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Schedule"
              placeholder="Select Schedules"
            />
          )}
        />
        {/* Operator Dropdown */}
        <Autocomplete
          value={
            operators.find((operator) => operator._id === form.operator) || null
          } // Find the operator by its ID
          onChange={(event, newValue) => {
            setForm({ ...form, operator: newValue ? newValue._id : "" }); // Store operator ID
          }}
          options={operators} // Pass whole operator object
          getOptionLabel={(option) => option.username || "No username"} // Display username
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Operator"
              placeholder="Select an Operator"
              fullWidth
              size="small"
            />
          )}
        />
        <TextField
          label="Price"
          name="price"
          type="number"
          value={form.price || ""}
          onChange={handleChange}
          required
          fullWidth
          size="small"
        />
        <Box sx={{ display: "flex", justifyContent: "end", gap: 1 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              width: "100px",
              height: "40px",
              fontSize: "13px",
              padding: "10px 20px",
            }}
            startIcon={<AddIcon sx={{ fontSize: 13 }} />}
          >
            Add
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() =>
              setForm({
                origin: "",
                destination: "",
                schedule: [],
                operator: "",
                price: "",
              })
            }
            sx={{
              width: "100px",
              height: "40px",
              fontSize: "13px",
              padding: "10px 20px",
            }}
            startIcon={<CleaningServicesIcon sx={{ fontSize: 13 }} />}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setView("grid")}
            sx={{
              width: "100px",
              height: "40px",
              fontSize: "13px",
              padding: "10px 20px",
            }}
            startIcon={<CloseIcon sx={{ fontSize: 13 }} />}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Container>
  );

  return view === "grid" ? renderGridView() : renderAddNewView();
};

export default AdminPage;
