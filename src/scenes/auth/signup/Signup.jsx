import { Visibility, VisibilityOff } from "@mui/icons-material";
import { CircularProgress, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const defaultTheme = createTheme();

export default function SignInSide() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formData = {
      email: data.get("email"),
      password: data.get("password"),
    };

    setError("");
    setEmailError("");
    setPasswordError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      setEmailError("Email is required");
    } else if (!emailRegex.test(formData.email)) {
      setEmailError("Email is not a valid format");
    }

    if (!formData.password) {
      setPasswordError("Password is required");
    }

    if (
      formData.email &&
      emailRegex.test(formData.email) &&
      formData.password
    ) {
      setIsLoading(true);
      try {
        const response = await fetch(
          "https://webback.opencurtainscasting.com/admin/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        if (response.ok) {
          const responseData = await response.json();
          const token = responseData.token;

          localStorage.setItem("accessToken", token);

          setSnackbarMessage("Login successful!");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);

          setTimeout(() => {
            navigate("/dd");
          }, 2000);
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Login failed");
        }
      } catch (error) {
        console.error("Error during login:", error.message);
        setError("An error occurred during login");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (event) => {
    setEmailError("");
    setPasswordError("");
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box
        component="main"
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CssBaseline />

        <Box
          item
          xs={12}
          sm={12}
          component={Paper}
          elevation={6}
          square
          sx={{
            padding: 4,
            maxWidth: " 50%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              alt="login image"
              src={`../../assets/user.png`}
              style={{ width: "60%", height: "auto", marginBottom: "20px" }}
            />

            <Typography
              component="h1"
              variant="h5"
              sx={{ mb: 2, mt: 3, fontWeight: "bold" }}
            >
              Sign in
            </Typography>

            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                error={!!emailError}
                helperText={emailError}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                error={!!passwordError}
                helperText={passwordError}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, height: 56 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Sign In"
                )}
              </Button>

              {error && (
                <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          sx={{ borderRadius: 10 }}
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
      </Box>
    </ThemeProvider>
  );
}
