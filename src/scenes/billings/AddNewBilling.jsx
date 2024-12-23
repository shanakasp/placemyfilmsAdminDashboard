import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Snackbar,
  TextField,
} from "@mui/material";
import { Formik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import Header from "../../components/Header";

const Form = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const navigate = useNavigate();

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const response = await fetch(
        "https://backend.placemyfilms.com/payapi/createCoupon",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: values.code,
            details: values.details,
            amount: values.amount,
            status: values.status,
          }),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log("Coupon created successfully:", responseData);
        setSnackbarMessage("Coupon created successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        setTimeout(() => {
          navigate("/coupons"); // Navigate to the coupon list page or desired page
        }, 3000);
      } else {
        const errorData = await response.json();
        console.error("Error creating coupon:", errorData);
        setSnackbarMessage("Error creating coupon: " + errorData.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error creating coupon:", error);
      setSnackbarMessage("Error creating coupon: " + error.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box m="20px" height="80vh" overflow="auto" paddingRight="20px">
      <Header title="CREATE NEW COUPON" subtitle="Create a coupon" />

      <Formik
        initialValues={{
          code: "",
          details: "",
          amount: "",
          status: "Active", // Default status
        }}
        validationSchema={checkoutSchema}
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            >
              <TextField
                fullWidth
                variant="filled"
                label="Coupon Code"
                name="code"
                value={values.code}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.code && !!errors.code}
                helperText={touched.code && errors.code}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Details"
                name="details"
                value={values.details}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.details && !!errors.details}
                helperText={touched.details && errors.details}
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
                sx={{ gridColumn: "span 4" }}
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
                sx={{ gridColumn: "span 4" }}
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
                <strong>Create New Coupon</strong>
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
  code: yup.string().required("Coupon code is required"),
  details: yup.string().required("Details are required"),
  amount: yup
    .number()
    .required("Amount is required")
    .positive("Amount must be a positive number"),
  status: yup.string().required("Status is required"),
});

export default Form;
