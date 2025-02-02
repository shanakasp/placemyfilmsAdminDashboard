import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Snackbar,
  TextField,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import Header from "../../components/Header";

const Form = () => {
  const { id } = useParams(); // Retrieve the package ID from the URL
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [initialValues, setInitialValues] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("accessToken"); // Retrieve the token from local storage

  // Fetch the package details by ID
  useEffect(() => {
    const fetchSubscriptionPackage = async () => {
      try {
        const response = await axios.get(
          `https://backend.placemyfilms.com/payapi/getPackageById/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const packageData = response.data.result;
        setInitialValues({
          title: packageData.title,
          description: packageData.description,
          amount: packageData.amount,
          status: packageData.status,
        });
      } catch (error) {
        console.error("Error fetching subscription package data:", error);
        setSnackbarMessage("Error fetching package data: " + error.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };

    fetchSubscriptionPackage();
  }, [token, id]);

  // Handle form submission
  const handleFormSubmit = async (values) => {
    try {
      const requestData = {
        title: values.title,
        description: values.description,
        amount: values.amount,
        status: values.status,
      };

      const response = await axios.put(
        `https://backend.placemyfilms.com/payapi/updatePackageByID/${id}`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setSnackbarMessage("Subscription package updated successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        setTimeout(() => {
          navigate("/packages");
        }, 2000);
      } else {
        throw new Error(response.data.message || "Failed to update package");
      }
    } catch (error) {
      console.error("Error updating subscription package:", error);
      setSnackbarMessage("Error updating package: " + error.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Show a loading spinner if the initial values are not loaded
  if (!initialValues) {
    return <CircularProgress />;
  }

  return (
    <Box m="20px" height="70vh" overflow="auto" paddingRight="20px">
      <Header
        title="EDIT SUBSCRIPTION PACKAGE"
        subtitle="Edit package details"
      />

      <Formik
        initialValues={initialValues}
        validationSchema={checkoutSchema}
        onSubmit={handleFormSubmit}
        enableReinitialize={true} // Ensure form is reinitialized when initial values change
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          isSubmitting,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                label="Title"
                name="title"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.title && !!errors.title}
                helperText={touched.title && errors.title}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Description"
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Amount"
                name="amount"
                type="number"
                value={values.amount}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.amount && !!errors.amount}
                helperText={touched.amount && errors.amount}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                select
                variant="filled"
                label="Status"
                name="status"
                value={values.status}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.status && !!errors.status}
                helperText={touched.status && errors.status}
                sx={{ gridColumn: "span 2" }}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </TextField>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                size="large"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              >
                <strong>Update Package</strong>
              </Button>
            </Box>
          </form>
        )}
      </Formik>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// Validation schema for the form
const checkoutSchema = yup.object().shape({
  title: yup.string().required("Required"),
  description: yup.string().required("Required"),
  amount: yup.number().required("Required").positive("Amount must be positive"),
  status: yup.string().required("Required"),
});

export default Form;
