import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  TextField,
} from "@mui/material";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import Header from "../../components/Header";

const Form = () => {
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [initialData, setInitialData] = useState({
    websiteURL: "",
    imageURL: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch existing casting banner details
  useEffect(() => {
    const fetchCastingDetails = async () => {
      try {
        const response = await fetch(
          `https://webback.opencurtainscasting.com/casting/getCastingImageDetails/${id}`
        );

        if (response.ok) {
          const data = await response.json();
          setInitialData({
            websiteURL: data.casting.websiteURL,
            imageURL: data.casting.imageURL,
          });
          setPreviewImage(data.casting.imageURL);
        } else {
          throw new Error("Failed to fetch casting details");
        }
      } catch (error) {
        setSnackbarMessage("Error fetching data: " + error.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCastingDetails();
    }
  }, [id]);

  const handleImageChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setImagePreviewOpen(true);
        setFieldValue("imageURL", file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImagePreviewConfirm = () => {
    setPreviewImage(selectedImage);
    setImagePreviewOpen(false);
  };

  const handleImagePreviewCancel = () => {
    setSelectedImage(null);
    setImagePreviewOpen(false);
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();
      formData.append("websiteURL", values.websiteURL);

      // Only append imageURL if a new file is selected
      if (values.imageURL instanceof File) {
        formData.append("image", values.imageURL);
      }

      const response = await fetch(
        `https://webback.opencurtainscasting.com/casting/updateCastingBannerDetails/${id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (response.ok) {
        setSnackbarMessage("Banner details updated successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setTimeout(() => {
          navigate("/changeBanner");
        }, 2000);

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

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Header title="UPDATE CASTING BANNER IMAGE" subtitle="" />

      <Formik
        initialValues={initialData}
        enableReinitialize={true}
        validationSchema={yup.object().shape({
          websiteURL: yup
            .string()
            .url("Enter a valid URL")
            .required("Website URL is required"),
          imageURL: yup.mixed(),
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

            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                style={{
                  marginLeft: 10,
                  width: "50%",
                  height: "auto",
                  objectFit: "cover",
                  borderRadius: 5,
                }}
              />
            )}
            {touched.imageURL && errors.imageURL && (
              <Alert severity="error" sx={{ marginBottom: 2 }}>
                {errors.imageURL}
              </Alert>
            )}
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
                  Select New Image
                </Button>
              </label>
            </Box>

            <Box display="flex" justifyContent="flex-end">
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              >
                Update
              </Button>
            </Box>
          </form>
        )}
      </Formik>

      {/* Image Preview Dialog */}
      <Dialog
        open={imagePreviewOpen}
        onClose={handleImagePreviewCancel}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Image Preview
          <IconButton
            aria-label="close"
            onClick={handleImagePreviewCancel}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Selected Preview"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
                maxHeight: "500px",
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleImagePreviewCancel} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleImagePreviewConfirm}
            color="secondary"
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

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
