import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Snackbar,
  TextField,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import { Formik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import Header from "../../../components/Header";

const CreateNewUser = () => {
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleFormSubmit = async (values) => {
    const token = localStorage.getItem("accessToken");
    const id = localStorage.getItem("id");
    try {
      const response = await axios.post(
        `https://webback.opencurtainscasting.com/user/changePassword/${id}`,
        {
          oldPassword: values.currentPassword,
          newPassword: values.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setAlertSeverity("success");
        setAlertMessage("Password changed successfully.");
        setOpenSnackbar(true);
        setTimeout(() => {
          setOpenSnackbar(false);
          localStorage.removeItem("accessToken");
          navigate("/");
        }, 2000);
      } else if (response.status === 400) {
        setAlertSeverity("error");
        setAlertMessage("Incorrect old password!");
        setOpenSnackbar(true);
      } else {
        setAlertSeverity("error");
        setAlertMessage("Failed to change password. Please try again.");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("API Error:", error);
      setAlertSeverity("error");
      setAlertMessage("Failed to change password. Please try again.");
      setOpenSnackbar(true);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Box m="20px">
      <Header title="Change Password" subtitle="" />

      <Box justifyContent="center" margin="20px ">
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={checkoutSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box>
                <Box mb={2}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type={"text"}
                    label="Enter Your Current Password *"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.currentPassword}
                    name="currentPassword"
                    error={
                      !!touched.currentPassword && !!errors.currentPassword
                    }
                    helperText={
                      touched.currentPassword && errors.currentPassword
                    }
                  />
                </Box>
                <Box mb={2}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type={showNewPassword ? "text" : "password"}
                    label="New Password *"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.newPassword}
                    name="newPassword"
                    error={!!touched.newPassword && !!errors.newPassword}
                    helperText={touched.newPassword && errors.newPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowNewPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showNewPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <Box mb={2}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type={showConfirmPassword ? "text" : "password"}
                    label="Confirm Password *"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.confirmPassword}
                    name="confirmPassword"
                    error={
                      !!touched.confirmPassword && !!errors.confirmPassword
                    }
                    helperText={
                      touched.confirmPassword && errors.confirmPassword
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowConfirmPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <Box display="flex" justifyContent="left" mt={3}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      backgroundColor: "#6870fa",
                      color: "white",
                      fontSize: "16px",
                      "&:hover": {
                        backgroundColor: "#3e4396",
                      },
                    }}
                  >
                    Update
                  </Button>
                </Box>
              </Box>
            </form>
          )}
        </Formik>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={alertSeverity}
          elevation={6}
          variant="filled"
          style={{ color: "white" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  currentPassword: yup.string().required("Current Password is required"),
  newPassword: yup
    .string()
    .required("New Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_+=\-/\[\]`~\\';])[A-Za-z\d!@#$%^&*(),.?":{}|<>_+=\-/\[\]`~\\';]{8,}$/,
      "New Password must be at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_+=\-/\[\]`~\\';])[A-Za-z\d!@#$%^&*(),.?":{}|<>_+=\-/\[\]`~\\';]{8,}$/,
      "Confirm Password must be at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

const initialValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default CreateNewUser;
