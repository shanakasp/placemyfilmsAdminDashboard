import { ExitToApp } from "@mui/icons-material";
import { Box, Button, Typography, alpha, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { tokens } from "../../theme";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Log Out",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("accessToken");
        navigate("/");
      }
    });
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      p={2}
      backgroundColor={colors.primary[400]}
    >
      <Box display="flex" borderRadius="3px">
        <Box display="flex" justifyContent="center" alignItems="center">
          <img
            alt="profile-user"
            width="50px"
            height="50px"
            src={`../../assets/user.png`}
            style={{ cursor: "pointer", borderRadius: "20%" }}
          />
        </Box>{" "}
        <Typography
          variant="h2"
          color={colors.grey[100]}
          fontWeight="bold"
          sx={{ m: "10px " }}
        >
          Open Curtains Casting
        </Typography>
      </Box>

      <Button
        color="inherit"
        startIcon={<ExitToApp />}
        sx={{
          fontWeight: "bold",
          fontSize: "20px",
          textTransform: "none",
          color: alpha(colors.grey[300], 0.8),
        }}
        onClick={handleLogout}
      >
        Log Out
      </Button>
    </Box>
  );
};

export default Topbar;
