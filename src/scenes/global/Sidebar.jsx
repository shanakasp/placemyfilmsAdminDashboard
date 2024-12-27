import CameraRollOutlinedIcon from "@mui/icons-material/CameraRollOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { Menu, MenuItem, ProSidebar } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";

import FeedbackOutlinedIcon from "@mui/icons-material/FeedbackOutlined";

import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";

import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
        marginBottom: "15px",
        marginTop: "10px",
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              marginBottom: "15px", // Add margin-bottom
              marginTop: "10px", // Add margin-top if needed
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography
                  variant="h3"
                  color={colors.grey[100]}
                  sx={{ fontWeight: "bold" }}
                >
                  Admin
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="5px">
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "20px 0 0 0" }}
                ></Typography>
              </Box>
            </Box>
          )}

          <Box height="85.5vh" paddingLeft={isCollapsed ? 0 : "10%"}>
            <Item
              title="Dashboard"
              to="/dd"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{
                m: "25px 0 5px 20px",
                fontWeight: "bold",
              }}
            >
              Control Area
            </Typography>
            {/* <Item
              title="Pending Castings"
              to="/pending"
              icon={<GroupOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
            <Item
              title="Blogs"
              to="/blog"
              icon={<CameraRollOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Packages"
              to="/packages"
              icon={<ViewListOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Payments"
              to="/payments"
              icon={<PaymentOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Feedbacks"
              to="/feedback"
              icon={<FeedbackOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Coupon"
              to="/coupons"
              icon={<LocalOfferOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
