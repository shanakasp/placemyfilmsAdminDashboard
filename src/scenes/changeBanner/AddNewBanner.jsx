import ImageIcon from "@mui/icons-material/Image";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  TextField,
} from "@mui/material";
import { Formik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import Header from "../../components/Header";

const Form = () => {
  const [previewImage, setPreviewImage] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const navigate = useNavigate();

  const handleImageChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    setFieldValue("imageURL", file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();
      formData.append("websiteURL", values.websiteURL);
      formData.append("imageURL", values.imageURL);

      const response = await fetch(
        "https://webback.opencurtainscasting.com/casting/addCastingBannerImage",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        setSnackbarMessage("Banner image uploaded successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setTimeout(() => {
          navigate("/changeBanner");
        }, 2000);

        setPreviewImage(null);
        resetForm();
      } else {
        const errorData = await response.json();
        setSnackbarMessage("Error: " + errorData.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("Error: " + error.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box m="20px">
      <Header title="UPLOAD NEW CASTING BANNER IMAGE" subtitle="" />

      <Formik
        initialValues={{
          websiteURL: "",
          imageURL: null,
        }}
        validationSchema={yup.object().shape({
          websiteURL: yup
            .string()
            .url("Enter a valid URL")
            .required("Website URL is required"),
          imageURL: yup.mixed().required("Image is required"),
        })}
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
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              variant="outlined"
              label="Website URL"
              name="websiteURL"
              value={values.websiteURL}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.websiteURL && !!errors.websiteURL}
              helperText={touched.websiteURL && errors.websiteURL}
              sx={{ marginBottom: 2 }}
            />

            <Box display="flex" alignItems="center" mb={2}>
              <label htmlFor="image-upload">
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleImageChange(event, setFieldValue)}
                  style={{ display: "none" }}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  component="span"
                  startIcon={<ImageIcon />}
                >
                  Select Image
                </Button>
              </label>
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{
                    marginLeft: 10,
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: 5,
                  }}
                />
              )}
            </Box>

            {touched.imageURL && errors.imageURL && (
              <Alert severity="error" sx={{ marginBottom: 2 }}>
                {errors.imageURL}
              </Alert>
            )}

            <Box display="flex" justifyContent="flex-end">
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              >
                Upload
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

export default Form;
