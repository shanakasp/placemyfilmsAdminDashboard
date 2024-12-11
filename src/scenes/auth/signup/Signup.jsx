import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  CssBaseline,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from "@mui/material/styles";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../../../api/ApiConfig";

export default function SignInSide() {
  const navigate = useNavigate();

  // Create a responsive theme
  const theme = responsiveFontSizes(
    createTheme({
      breakpoints: {
        values: {
          xs: 0,
          sm: 600,
          md: 960,
          lg: 1280,
          xl: 1920,
        },
      },
    })
  );

  // Media query hooks for responsive design
  const isXsScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMdScreen = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isLgScreen = useMediaQuery(theme.breakpoints.up("lg"));

  // State management
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Responsive sizing function
  const getResponsiveSizing = () => {
    if (isXsScreen)
      return {
        paperWidth: "90%",
        imageWidth: "40%",
        padding: 2,
        borderRadius: "12px",
      };
    if (isSmScreen)
      return {
        paperWidth: "80%",
        imageWidth: "30%",
        padding: 3,
        borderRadius: "14px",
      };
    if (isMdScreen)
      return {
        paperWidth: "70%",
        imageWidth: "255%",
        padding: 4,
        borderRadius: "16px",
      };
    return {
      paperWidth: "50%",
      imageWidth: "20%",
      padding: 4,
      borderRadius: "16px",
    };
  };

  const responsiveSizing = getResponsiveSizing();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formData = {
      email: data.get("email"),
      password: data.get("password"),
    };

    // Reset errors
    setError("");
    setEmailError("");
    setPasswordError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validation logic (same as previous implementation)
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
        const responseData = await loginApi(formData);
        const token = responseData.token;

        localStorage.setItem("accessToken", token);

        setSnackbarMessage("Login successful!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        setTimeout(() => {
          navigate("/dd");
        }, 2000);
      } catch (error) {
        console.error("Error during login:", error.message);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Other handler functions remain the same as in the previous implementation

  return (
    <ThemeProvider theme={theme}>
      <Box
        component="main"
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom, #4AE5A2, #37A5EE)",
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <CssBaseline />

        <Box
          component={Paper}
          elevation={6}
          sx={{
            width: responsiveSizing.paperWidth,
            padding: responsiveSizing.padding,
            borderRadius: responsiveSizing.borderRadius,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            alt="login image"
            src={`../../assets/user.png`}
            style={{
              width: responsiveSizing.imageWidth,
              height: "auto",
              marginBottom: "20px",
            }}
          />

          <Typography
            component="h1"
            variant={isXsScreen ? "h6" : "h5"}
            sx={{
              mb: 2,
              mt: 3,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Sign in
          </Typography>

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{
              width: "100%",
              mt: 1,
              px: { xs: 1, sm: 2, md: 3 }, // Responsive form padding
            }}
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
              onChange={() => {
                setEmailError("");
                setPasswordError("");
              }}
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
              onChange={() => {
                setEmailError("");
                setPasswordError("");
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={(event) => event.preventDefault()}
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
              sx={{
                mt: 3,
                mb: 2,
                height: { xs: 48, sm: 52, md: 56 },
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>

            {error && (
              <Typography
                variant="body2"
                color="error"
                sx={{
                  mt: 2,
                  textAlign: "center",
                }}
              >
                {error}
              </Typography>
            )}
          </Box>
        </Box>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          sx={{ borderRadius: 10 }}
        >
          <MuiAlert
            onClose={() => setSnackbarOpen(false)}
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
