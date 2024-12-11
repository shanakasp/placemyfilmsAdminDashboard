import DownloadOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { Box, Button, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px" height="80vh" overflow="auto" paddingRight="20px">
      <Box>
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        {/* Buttons container */}
        <Box display="flex" gap="10px" mt="20px">
          <Link to="/changeContent">
            <Button
              sx={{
                backgroundColor: colors.greenAccent[500],
                color: colors.grey[100],
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 20px",
              }}
            >
              <DownloadOutlinedIcon sx={{ mr: "10px" }} />
              Change Content
            </Button>
          </Link>

          <Link to="/changeBanner">
            <Button
              sx={{
                backgroundColor: colors.greenAccent[500],
                color: colors.grey[100],
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 20px",
              }}
            >
              <DownloadOutlinedIcon sx={{ mr: "10px" }} />
              Change Banner
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
