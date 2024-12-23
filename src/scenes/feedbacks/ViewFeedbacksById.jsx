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

const ViewProject = () => {
  const { id } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [feedback, setFeedback] = useState(null);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get(
          `https://backend.placemyfilms.com/feedback/getFeedbackById/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFeedback(response.data.result);
      } catch (error) {
        console.error("Error fetching the feedback data:", error);
      }
    };

    fetchFeedback();
  }, [id, token]);

  if (!feedback) {
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
      <Header
        title={`VIEW FEEDBACK ID ${id}`}
        subtitle="View Feedback Details"
      />

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Feedback ID
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{feedback.id}</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Blog ID
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{feedback.blogId}</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Description
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{feedback.description}</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Feedback Type
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{feedback.feedBackType}</Typography>
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
            {new Date(feedback.createdAt).toLocaleString()}
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
            {new Date(feedback.updatedAt).toLocaleString()}
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ViewProject;
