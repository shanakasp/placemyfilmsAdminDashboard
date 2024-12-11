import { Box, Grid, Typography, useTheme } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const ViewProject = () => {
  const { id } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `https://webback.opencurtainscasting.com/producer/getProducer/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching the user data:", error);
      }
    };

    fetchUser();
  }, [id, token]);

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  const { result, registerResult } = user;

  return (
    <Box m="20px" height="80vh" overflow="auto" paddingRight="20px">
      <Header
        title={`VIEW PRODUCER ID ${id}`}
        subtitle="View Producer Details"
      />

      <Grid container spacing={2} pl={2}>
        {/* Full Name */}
        <Grid item xs={2}>
          <Typography variant="h6">Full Name</Typography>
        </Grid>
        <Grid item xs={10}>
          <Typography>{`${registerResult.firstName} ${registerResult.lastName}`}</Typography>
        </Grid>

        {/* Email */}
        <Grid item xs={2}>
          <Typography variant="h6">Email</Typography>
        </Grid>
        <Grid item xs={10}>
          <Typography>{registerResult.email}</Typography>
        </Grid>

        {/* User Role */}
        <Grid item xs={2}>
          <Typography variant="h6">User Role</Typography>
        </Grid>
        <Grid item xs={10}>
          <Typography>{registerResult.role}</Typography>
        </Grid>

        {/* Contact Number */}
        <Grid item xs={2}>
          <Typography variant="h6">Contact Number</Typography>
        </Grid>
        <Grid item xs={10}>
          <Typography>{registerResult.contactNumber}</Typography>
        </Grid>

        {/* Birthday */}
        <Grid item xs={2}>
          <Typography variant="h6">Birthday</Typography>
        </Grid>
        <Grid item xs={10}>
          <Typography>{registerResult.birthday || "Not provided"}</Typography>
        </Grid>

        {/* Gender */}
        <Grid item xs={2}>
          <Typography variant="h6">Gender</Typography>
        </Grid>
        <Grid item xs={10}>
          <Typography>{registerResult.gender || "Not provided"}</Typography>
        </Grid>

        {/* Ethnicity */}
        <Grid item xs={2}>
          <Typography variant="h6">Ethnicity</Typography>
        </Grid>
        <Grid item xs={10}>
          <Typography>{registerResult.ethnicity || "Not provided"}</Typography>
        </Grid>

        {/* Age */}
        <Grid item xs={2}>
          <Typography variant="h6">Age</Typography>
        </Grid>
        <Grid item xs={10}>
          <Typography>{registerResult.age || "Not provided"}</Typography>
        </Grid>

        {/* Location */}
        <Grid item xs={2}>
          <Typography variant="h6">Location</Typography>
        </Grid>
        <Grid item xs={10}>
          <Typography>{result.location || "Not provided"}</Typography>
        </Grid>

        {/* Company Name */}
        <Grid item xs={2}>
          <Typography variant="h6">Company Name</Typography>
        </Grid>
        <Grid item xs={10}>
          <Typography>{result.companyName || "Not provided"}</Typography>
        </Grid>

        {/* Facebook Link */}
        <Grid item xs={2}>
          <Typography variant="h6">Facebook Link</Typography>
        </Grid>
        <Grid item xs={10}>
          <Typography>{result.fbLink || "Not provided"}</Typography>
        </Grid>

        {/* Instagram Link */}
        <Grid item xs={2}>
          <Typography variant="h6">Instagram Link</Typography>
        </Grid>
        <Grid item xs={10}>
          <Typography>{result.instagramLink || "Not provided"}</Typography>
        </Grid>

        {/* X (formerly Twitter) Link */}
        <Grid item xs={2}>
          <Typography variant="h6">X Link</Typography>
        </Grid>
        <Grid item xs={10}>
          <Typography>{result.xLink || "Not provided"}</Typography>
        </Grid>

        {/* TikTok Link */}
        <Grid item xs={2}>
          <Typography variant="h6">TikTok Link</Typography>
        </Grid>
        <Grid item xs={10}>
          <Typography>{result.tikTokLink || "Not provided"}</Typography>
        </Grid>

        {/* YouTube Link */}
        <Grid item xs={2}>
          <Typography variant="h6">YouTube Link</Typography>
        </Grid>
        <Grid item xs={10}>
          <Typography>{result.youtubeLink || "Not provided"}</Typography>
        </Grid>

        {/* Image */}
        <Grid item xs={2}>
          <Typography variant="h6">Image</Typography>
        </Grid>
        <Grid item xs={10}>
          {result.imageURL ? (
            <img
              src={result.imageURL}
              alt={`${registerResult.firstName} ${registerResult.lastName}`}
              style={{ width: "25%", height: "auto" }}
            />
          ) : (
            <Typography>No image available</Typography>
          )}
        </Grid>

        {/* Created At */}
        <Grid item xs={2}>
          <Typography variant="h6">Created At</Typography>
        </Grid>
        <Grid item xs={10}>
          <Typography>{new Date(result.createdAt).toLocaleString()}</Typography>
        </Grid>

        {/* Updated At */}
        <Grid item xs={2}>
          <Typography variant="h6">Updated At</Typography>
        </Grid>
        <Grid item xs={10}>
          <Typography>{new Date(result.updatedAt).toLocaleString()}</Typography>
        </Grid>

        {/* Admin Active */}
        <Grid item xs={2}>
          <Typography variant="h6">Admin Active</Typography>
        </Grid>
        <Grid item xs={10}>
          <Typography>
            {registerResult.adminActive ? "Activated" : "Deactivated"}
          </Typography>
        </Grid>

        {/* User Active */}
        <Grid item xs={2}>
          <Typography variant="h6">User Active</Typography>
        </Grid>
        <Grid item xs={10}>
          <Typography>
            {registerResult.userActive ? "Activated" : "Deactivated"}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewProject;
