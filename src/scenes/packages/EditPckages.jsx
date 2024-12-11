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
  const { id } = useParams();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [initialValues, setInitialValues] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("accessToken");

  const typeOptions = [
    { value: "calls", label: "Calls" },
    { value: "months", label: "Months" },
  ];

  useEffect(() => {
    const fetchSubscriptionPackage = async () => {
      try {
        const response = await axios.get(
          `https://webback.opencurtainscasting.com/subscriptionPackage/findById/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const packageData = response.data.result;
        setInitialValues({
          id: packageData.id,
          title: packageData.title,
          type: packageData.type,
          price: packageData.price,
          count: packageData.count,
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

  const handleFormSubmit = async (values) => {
    try {
      // Create the request payload matching the expected format
      const requestData = {
        title: values.title,
        type: values.type,
        price: values.price,
        count: parseInt(values.count), // Ensure count is sent as a number
      };

      const response = await fetch(
        `https://webback.opencurtainscasting.com/subscriptionPackage/update/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Specify JSON content type
          },
          body: JSON.stringify(requestData),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        console.log("Subscription package updated successfully:", responseData);
        setSnackbarMessage("Subscription package updated successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        setTimeout(() => {
          navigate("/packages");
        }, 2000);
      } else {
        throw new Error(responseData.message || "Failed to update package");
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
        enableReinitialize={true}
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
                select
                variant="filled"
                label="Type"
                name="type"
                value={values.type}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.type && !!errors.type}
                helperText={touched.type && errors.type}
                sx={{ gridColumn: "span 2" }}
              >
                {typeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                variant="filled"
                label="Price"
                name="price"
                value={values.price}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.price && !!errors.price}
                helperText={touched.price && errors.price}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Count"
                name="count"
                type="number"
                value={values.count}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.count && !!errors.count}
                helperText={touched.count && errors.count}
                sx={{ gridColumn: "span 4" }}
              />
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

const checkoutSchema = yup.object().shape({
  title: yup.string().required("Required"),
  type: yup
    .string()
    .required("Required")
    .oneOf(["calls", "months"], "Invalid type selected"),
  price: yup.string().required("Required"),
  count: yup.number().required("Required").min(1, "Count must be at least 1"),
});

export default Form;
