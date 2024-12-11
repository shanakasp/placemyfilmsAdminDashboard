import {
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import Header from "../../components/Header";

// Validation Schema
const checkoutSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  author: yup.string().required("Author is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  noOfReaders: yup
    .number()
    .positive("Number of readers must be positive")
    .integer("Number of readers must be an integer")
    .required("Number of readers is required"),
  type: yup.string().required("Type is required"),
  status: yup.string().required("Status is required"),
});

function EditBlogById() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    author: "",
    email: "",
    noOfReaders: "",
    type: "",
    status: "",
    imageURL: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Handle Snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  // Fetch existing blog details
  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await fetch(
          `https://backend.placemyfilms.com/blog/getBlogById/${id}`
        );
        const responseData = await response.json();

        if (responseData.status) {
          const { result } = responseData;
          setInitialValues({
            title: result.title || "",
            description: result.description || "",
            author: result.author || "",
            email: result.email || "",
            noOfReaders: result.noOfReaders || "",
            type: result.type || "",
            status: result.status || "",
            imageURL: result.imageURL || "",
          });
          setImagePreview(result.imageURL || "");
          setIsLoading(false);
        } else {
          console.error("Failed to fetch blog details:", responseData.message);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching blog details:", error);
        setIsLoading(false);
      }
    };

    fetchBlogDetails();
  }, [id]);

  // Handle Image Change
  const handleImageChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setFieldValue("imageURL", file.name);

      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();

      // Append text fields
      Object.keys(values).forEach((key) => {
        if (key !== "imageURL") {
          formData.append(key, values[key]);
        }
      });

      // Append image file
      if (imageFile) {
        formData.append("blog-image", imageFile);
      }

      const response = await fetch(
        `https://backend.placemyfilms.com/blog/updateBlogByID/${id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const responseData = await response.json();

      if (responseData.status) {
        // Show success message
        setSnackbarMessage("Blog updated successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        // Redirect to blog view or list page after successful update
        setTimeout(() => {
          navigate(`/blog`);
        }, 2000);
      } else {
        // Show error message
        setSnackbarMessage(responseData.message || "Failed to update blog");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        console.error("Failed to update blog:", responseData.message);
      }
    } catch (error) {
      // Show network error message
      setSnackbarMessage("Network error. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error updating blog:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Render loading state
  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box m="20px" height="auto" overflow="auto" paddingRight="20px">
      <Header title={`Edit Blog ID: ${id}`} subtitle="Edit Blog Details" />

      <Formik
        initialValues={initialValues}
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
          setFieldValue,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Image Preview */}
              <Grid item xs={12} md={4}>
                <Box border={1} borderColor="grey.300" borderRadius={2} p={2}>
                  <img
                    src={imagePreview || "/path/to/default/image.png"}
                    alt="Blog"
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "8px",
                    }}
                    onError={(e) => {
                      e.target.src = "/path/to/default/image.png";
                    }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, setFieldValue)}
                    style={{ marginTop: "10px", width: "100%" }}
                  />
                </Box>
              </Grid>

              {/* Form Fields */}
              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  {/* Title */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="text"
                      label="Title"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.title}
                      name="title"
                      error={!!touched.title && !!errors.title}
                      helperText={touched.title && errors.title}
                    />
                  </Grid>

                  {/* Description */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      multiline
                      rows={4}
                      label="Description"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.description}
                      name="description"
                      error={!!touched.description && !!errors.description}
                      helperText={touched.description && errors.description}
                    />
                  </Grid>

                  {/* Author */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="text"
                      label="Author"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.author}
                      name="author"
                      error={!!touched.author && !!errors.author}
                      helperText={touched.author && errors.author}
                    />
                  </Grid>

                  {/* Email */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="email"
                      label="Email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.email}
                      name="email"
                      error={!!touched.email && !!errors.email}
                      helperText={touched.email && errors.email}
                    />
                  </Grid>

                  {/* Number of Readers */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="number"
                      label="Number of Readers"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.noOfReaders}
                      name="noOfReaders"
                      error={!!touched.noOfReaders && !!errors.noOfReaders}
                      helperText={touched.noOfReaders && errors.noOfReaders}
                    />
                  </Grid>

                  {/* Type */}
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Type</InputLabel>
                      <Select
                        label="Type"
                        name="type"
                        value={values.type}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!touched.type && !!errors.type}
                      >
                        <MenuItem value="poem">Poem</MenuItem>
                        <MenuItem value="article">Article</MenuItem>
                        <MenuItem value="story">Story</MenuItem>
                      </Select>
                      {touched.type && errors.type && (
                        <Typography color="error" variant="caption">
                          {errors.type}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>

                  {/* Status */}
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Status</InputLabel>
                      <Select
                        label="Status"
                        name="status"
                        value={values.status}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!touched.status && !!errors.status}
                      >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                      </Select>
                      {touched.status && errors.status && (
                        <Typography color="error" variant="caption">
                          {errors.status}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>

                  {/* Submit Button */}
                  <Grid item xs={12} display="flex" justifyContent="right">
                    <Button
                      type="submit"
                      color="secondary"
                      variant="contained"
                      disabled={isSubmitting}
                      sx={{ width: "200px" }}
                    >
                      Update Blog
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>

      {/* Snackbar for notifications */}
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
}

export default EditBlogById;
