import { Box, Grid, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";

function ViewBlogById() {
  const { id } = useParams();
  const [blogDetails, setBlogDetails] = useState({
    title: "",
    description: "",
    author: "",
    email: "",
    noOfReaders: "",
    type: "",
    status: "",
    imageURL: "",
    createdAt: "",
  });

  useEffect(() => {
    fetchBlogDetails();
  }, [id]);

  const fetchBlogDetails = async () => {
    try {
      const response = await fetch(
        `https://backend.placemyfilms.com/blog/getBlogById/${id}`
      );
      const responseData = await response.json();
      if (responseData.status) {
        const modifiedData = {
          ...responseData.result,
          createdAt: responseData.result.createdAt.split("T")[0],
          status: capitalizeFirstLetter(responseData.result.status),
        };
        setBlogDetails(modifiedData);
      } else {
        console.error("Failed to fetch blog details:", responseData.message);
      }
    } catch (error) {
      console.error("Error fetching blog details:", error);
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <Box m="20px" height="auto" overflow="auto" paddingRight="20px">
      <Header title={`View Blog ID: ${id}`} subtitle="Blog Details" />
      <Box ml="10px">
        <Grid container spacing={2}>
          {/* Displaying the image */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3}>
              <img
                src={blogDetails.imageURL}
                alt="Blog"
                style={{ width: "100%", height: "auto", borderRadius: "8px" }}
              />
            </Paper>
          </Grid>

          {/* Displaying the blog fields and values */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              {Object.entries(blogDetails).map(([field, value]) => (
                <React.Fragment key={field}>
                  {/* Filter out unnecessary fields such as imageURL */}
                  {field !== "imageURL" && (
                    <>
                      <Grid item xs={3}>
                        <Typography variant="h6" fontWeight="bold">
                          {capitalizeFirstLetter(field)}
                        </Typography>
                      </Grid>

                      <Grid item xs={1}>
                        <Typography variant="h6" fontWeight="bold">
                          :
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography variant="body1">{value}</Typography>
                      </Grid>
                    </>
                  )}
                </React.Fragment>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default ViewBlogById;
