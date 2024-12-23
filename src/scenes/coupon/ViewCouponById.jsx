import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, useTheme } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const ViewCoupon = () => {
  const { id } = useParams(); // Get coupon ID from URL params
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [coupon, setCoupon] = useState(null);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const response = await axios.get(
          `https://backend.placemyfilms.com/payapi/getCouponById/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCoupon(response.data.result); // Set the coupon data
      } catch (error) {
        console.error("Error fetching the coupon data:", error);
      }
    };

    fetchCoupon();
  }, [id, token]);

  if (!coupon) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box
      m="20px"
      height="80vh"
      overflow="auto"
      paddingRight="20px"
      color={colors.greenAccent[500]}
    >
      <Header title={`VIEW COUPON ID ${id}`} subtitle="View Coupon Details" />

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Coupon Code
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{coupon.code}</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Coupon Details
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{coupon.details}</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Coupon Amount
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{coupon.amount}</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Status
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{coupon.status}</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Created At
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {new Date(coupon.createdAt).toLocaleDateString()}
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Updated At
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {new Date(coupon.updatedAt).toLocaleDateString()}
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ViewCoupon;
