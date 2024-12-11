import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Modal,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import * as yup from "yup";

import { Link } from "react-router-dom";
import Header from "../../components/Header";
import { tokens } from "../../theme";

// Validation schema for admin details
const checkoutSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  image: yup.mixed(),
});

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [adminDetails, setAdminDetails] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const response = await fetch(
          "https://backend.placemyfilms.com/admin/getAdmin"
        );
        const data = await response.json();
        if (data && data.length > 0) {
          setAdminDetails(data[0]);
        }
      } catch (error) {
        console.error("Error fetching admin details:", error);
      }
    };

    fetchAdminDetails();
  }, []);

  const handleFileUpload = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setFieldValue("image", file);
      setSelectedImage(file);
    }
  };

  const handleFormSubmit = async (values) => {
    // Close the modal first to ensure SweetAlert is top-most
    setOpenModal(false);

    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update your user details?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    });

    if (result.isConfirmed) {
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("email", values.email);

        // Only append image if a new file was selected
        if (selectedImage) {
          formData.append("imageFile", selectedImage);
        }

        const userId = localStorage.getItem("userId"); // Changed from AdminId
        const response = await fetch(
          `https://backend.placemyfilms.com/admin/updateUserDetails/${userId}`,
          {
            method: "PUT",
            body: formData,
          }
        );

        if (response.ok) {
          // Update successful
          Swal.fire({
            title: "Updated!",
            text: "Your user details have been updated.",
            icon: "success",
            position: "top",
          });

          // Update local state
          setAdminDetails((prev) => ({
            ...prev,
            name: values.name,
            email: values.email,
          }));

          // Reset selected image
          setSelectedImage(null);
        } else {
          // Handle error
          Swal.fire({
            title: "Error!",
            text: "Failed to update user details.",
            icon: "error",
            position: "top",
          });
        }
      } catch (error) {
        console.error("Error updating user details:", error);
        Swal.fire({
          title: "Error!",
          text: "An unexpected error occurred.",
          icon: "error",
          position: "top",
        });
      }
    }
  };

  if (!adminDetails) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box m="20px" height="80vh">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box display="flex" gap="10px">
          <Link to="/changepw">
            {" "}
            <Button
              variant="contained"
              startIcon={<SettingsOutlinedIcon />}
              sx={{
                backgroundColor: colors.greenAccent[500],
                ":hover": {
                  backgroundColor: colors.greenAccent[600],
                },
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              Change Password
            </Button>
          </Link>

          <Link to="/editAdminDetails">
            {" "}
            <Button
              variant="contained"
              startIcon={<EditOutlinedIcon />}
              sx={{
                backgroundColor: colors.blueAccent[500],
                ":hover": {
                  backgroundColor: colors.blueAccent[600],
                },
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              Edit Details
            </Button>{" "}
          </Link>
        </Box>
      </Box>

      <Card
        sx={{
          mt: "20px",
          backgroundColor: colors.primary[400],
          borderRadius: "8px",
          boxShadow: 3,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <CardMedia
              component="img"
              height="200"
              image={adminDetails.image}
              alt={adminDetails.name}
              sx={{
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <CardContent>
              <Typography
                gutterBottom
                variant="h4"
                component="div"
                color={colors.greenAccent[300]}
              >
                {adminDetails.name}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Email: {adminDetails.email}
              </Typography>
            </CardContent>
          </Grid>
        </Grid>
      </Card>

      {/* Edit Modal */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="edit-admin-modal"
        disableAutoFocus
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: colors.primary[400],
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">Edit User Details</Typography>
            <IconButton onClick={() => setOpenModal(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Formik
            initialValues={{
              name: adminDetails.name,
              email: adminDetails.email,
              image: null,
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
              setFieldValue,
            }) => (
              <Form>
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  label="Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  name="name"
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                  sx={{ mb: 2 }}
                />
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
                  sx={{ mb: 2 }}
                />
                <Box>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleFileUpload(event, setFieldValue)}
                    style={{ display: "none" }}
                    id="image-upload"
                  />
                  <label htmlFor="image-upload">
                    <Button
                      variant="contained"
                      component="span"
                      sx={{
                        mb: 2,
                        backgroundColor: colors.blueAccent[500],
                        ":hover": {
                          backgroundColor: colors.blueAccent[600],
                        },
                      }}
                    >
                      Upload Profile Picture
                    </Button>
                  </label>

                  {selectedImage && (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      mb={2}
                    >
                      <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Preview"
                        style={{
                          maxWidth: "200px",
                          maxHeight: "200px",
                          objectFit: "contain",
                          border: "2px solid " + colors.blueAccent[500],
                        }}
                      />
                    </Box>
                  )}
                </Box>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  sx={{
                    mt: 2,
                    backgroundColor: colors.greenAccent[500],
                    ":hover": {
                      backgroundColor: colors.greenAccent[600],
                    },
                  }}
                >
                  Update Details
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
    </Box>
  );
};

export default Dashboard;
