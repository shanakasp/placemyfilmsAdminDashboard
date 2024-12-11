import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  useTheme,
} from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as yup from "yup";
import Header from "../../components/Header";
import { tokens } from "../../theme";

// Validation schema for admin details
const checkoutSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  image: yup.mixed(),
});

const AdminEditPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [adminDetails, setAdminDetails] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const response = await fetch(
          "https://backend.placemyfilms.com/admin/getAdmin"
        );
        const data = await response.json();
        if (data && data.length > 0) {
          setAdminDetails(data[0]);
          setPreviewImage(data[0].image);
        }
      } catch (error) {
        console.error("Error fetching admin details:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to fetch admin details.",
          icon: "error",
        });
      }
    };

    fetchAdminDetails();
  }, []);

  const handleFileUpload = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setFieldValue("image", file);
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);

      if (selectedImage) {
        formData.append("imageURL", selectedImage);
      }

      const userId = localStorage.getItem("AdminId");
      const response = await fetch(
        `https://backend.placemyfilms.com/admin/updateAdmin/${userId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (response.ok) {
        Swal.fire({
          title: "Updated!",
          text: "Your admin details have been updated.",
          icon: "success",
          position: "top",
        }).then(() => {
          navigate("/dd");
        });

        setAdminDetails((prev) => ({
          ...prev,
          name: values.name,
          email: values.email,
        }));

        setSelectedImage(null);
      } else {
        const errorData = await response.json();
        Swal.fire({
          title: "Error!",
          text: errorData.message || "Failed to update admin details.",
          icon: "error",
          position: "top",
        });
      }
    } catch (error) {
      console.error("Error updating admin details:", error);
      Swal.fire({
        title: "Error!",
        text: "An unexpected error occurred.",
        icon: "error",
        position: "top",
      });
    }
  };

  if (!adminDetails) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box m="20px" height="80vh">
      <Header
        title="EDIT ADMIN DETAILS"
        subtitle="Update your profile information"
      />

      <Card
        sx={{
          mt: "20px",
          backgroundColor: colors.primary[400],
          borderRadius: "8px",
          boxShadow: 3,
        }}
      >
        <CardContent>
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
                <Box display="flex" flexDirection="column" gap={3}>
                  {/* Profile Image Preview */}
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    mb={2}
                  >
                    <img
                      src={previewImage}
                      alt="Profile"
                      style={{
                        width: "250px",
                        height: "250px",
                        objectFit: "cover",
                        borderRadius: "50%",
                        border: `4px solid ${colors.blueAccent[500]}`,
                      }}
                    />
                    <label htmlFor="image-upload">
                      <Button
                        variant="contained"
                        component="span"
                        sx={{
                          mt: 2,
                          backgroundColor: colors.blueAccent[500],
                          ":hover": {
                            backgroundColor: colors.blueAccent[600],
                          },
                          width: "200px",
                        }}
                      >
                        Change Profile Picture
                      </Button>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        handleFileUpload(event, setFieldValue)
                      }
                      style={{ display: "none" }}
                      id="image-upload"
                    />
                  </Box>

                  {/* Name Field */}
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
                  />

                  {/* Email Field */}
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

                  {/* Submit Button */}
                  <Box display="flex" justifyContent="flex-start" mt={2}>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        backgroundColor: colors.greenAccent[500],
                        ":hover": {
                          backgroundColor: colors.greenAccent[600],
                        },
                        width: "150px",
                        height: "40px",
                      }}
                    >
                      Update
                    </Button>
                  </Box>
                </Box>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminEditPage;
