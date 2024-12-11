import {
  Box,
  Button,
  CircularProgress,
  Snackbar,
  TextField,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";

const Iindex = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title1: "",
    title2: "",
    title3: "",
    title4: "",
    content1: "",
    content2: "",
    content3: "",
    content4: "",
  });

  const [errors, setErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch existing data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://webback.opencurtainscasting.com/content/get"
        );
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.error("Error fetching content data:", error.message);
      }
    };
    fetchData();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  // Validate form fields
  const validateFields = () => {
    const newErrors = {};
    if (!formData.title1) newErrors.title1 = "Input cannot be empty";
    if (!formData.title2) newErrors.title2 = "Input cannot be empty";
    if (!formData.title3) newErrors.title3 = "Input cannot be empty";
    if (!formData.title4) newErrors.title4 = "Input cannot be empty";
    if (!formData.content1) newErrors.content1 = "Input cannot be empty";
    if (!formData.content2) newErrors.content2 = "Input cannot be empty";
    if (!formData.content3) newErrors.content3 = "Input cannot be empty";
    if (!formData.content4) newErrors.content4 = "Input cannot be empty";
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = validateFields();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        const response = await fetch(
          "https://webback.opencurtainscasting.com/content/patch",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        if (response.ok) {
          setSnackbarMessage("Content updated successfully!");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);

          setTimeout(() => {
            navigate("/dd");
          }, 2000);
        } else {
          const errorData = await response.json();
          setSnackbarMessage(errorData.message || "Update failed");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error("Error during content update:", error.message);
        setSnackbarMessage("An error occurred during update");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Header title="CHANGE CONTENT" subtitle="Change your content" />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          height: "70vh",
          overflowY: "auto",
          width: "100%",
          padding: "20px",
          margin: "auto",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Form fields */}

        <img
          src="/assets/page1.png"
          alt="First Page"
          style={{ width: "40%", height: "auto" }}
        />

        <TextField
          label="First Page Title 1"
          name="title1"
          value={formData.title1}
          onChange={handleChange}
          fullWidth
          error={!!errors.title1}
          helperText={errors.title1}
          required
        />
        <TextField
          label="First Page Title 2"
          name="title2"
          value={formData.title2}
          onChange={handleChange}
          fullWidth
          error={!!errors.title2}
          helperText={errors.title2}
          required
        />
        <TextField
          label="First Page Content 1"
          name="content1"
          value={formData.content1}
          onChange={handleChange}
          fullWidth
          multiline
          rows={2}
          error={!!errors.content1}
          helperText={errors.content1}
          required
        />

        <img
          src="/assets/page2.png"
          alt="First Page"
          style={{ width: "40%", height: "auto" }}
        />

        <TextField
          label="Casting Directors Page Title"
          name="title3"
          value={formData.title3}
          onChange={handleChange}
          fullWidth
          error={!!errors.title3}
          helperText={errors.title3}
          required
        />
        <TextField
          label="Casting Directors Page Content 1"
          name="title4"
          value={formData.title4}
          onChange={handleChange}
          fullWidth
          error={!!errors.title4}
          helperText={errors.title4}
          required
        />

        <TextField
          label="Casting Directors Page Content 2"
          name="content2"
          value={formData.content2}
          onChange={handleChange}
          fullWidth
          multiline
          rows={2}
          error={!!errors.content2}
          helperText={errors.content2}
          required
        />
        {/* <TextField
          label="Content 3"
          name="content3"
          value={formData.content3}
          onChange={handleChange}
          fullWidth
          multiline
          rows={2}
          error={!!errors.content3}
          helperText={errors.content3}
          required
        /> */}
        {/* <TextField
          label="Content 4"
          name="content4"
          value={formData.content4}
          onChange={handleChange}
          fullWidth
          multiline
          rows={2}
          error={!!errors.content4}
          helperText={errors.content4}
          required
        /> */}

        {/* Submit Button */}
        <Box display="flex" justifyContent="end" mt="20px">
          {" "}
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading && <CircularProgress size={20} />}
          >
            {isLoading ? "Updating..." : "Update Content"}
          </Button>
        </Box>
      </Box>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Iindex;
