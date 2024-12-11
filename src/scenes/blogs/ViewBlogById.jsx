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
    updatedAt: "",
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
          createdAt: formatDate(responseData.result.createdAt),
          updatedAt: formatDate(responseData.result.updatedAt),
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

  // Format field names to be more readable
  const formatFieldName = (field) => {
    const fieldNameMap = {
      noOfReaders: "Number of Readers",
      createdAt: "Created At",
      updatedAt: "Updated At",
    };

    // If there's a custom translation, use it
    if (fieldNameMap[field]) {
      return fieldNameMap[field];
    }

    return field.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
      return str.toUpperCase();
    });
  };

  // Format date to a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const capitalizeFirstLetter = (string) => {
    return string ? string.charAt(0).toUpperCase() + string.slice(1) : "";
  };

  return (
    <Box m="20px" height="auto" overflow="auto" paddingRight="20px">
      <Header title={`View Blog ID: ${id}`} subtitle="Blog Details" />
      <Box ml="10px">
        <Grid container spacing={2}>
          {/* Displaying the image */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{ display: "flex", justifyContent: "center", p: 2 }}
            >
              <img
                src={blogDetails.imageURL}
                alt="Blog"
                style={{
                  width: "100%",
                  maxWidth: "300px",
                  height: "auto",
                  borderRadius: "8px",
                }}
                onError={(e) => {
                  e.target.src = "/path/to/default/image.png";
                }}
              />
            </Paper>
          </Grid>

          {/* Displaying the blog fields and values */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              {Object.entries(blogDetails).map(([field, value]) => (
                <React.Fragment key={field}>
                  {/* Filter out imageURL */}
                  {field !== "imageURL" && (
                    <>
                      <Grid item xs={3}>
                        <Typography variant="h6" fontWeight="bold">
                          {formatFieldName(field)}
                        </Typography>
                      </Grid>
                      <Grid item xs={1}>
                        <Typography variant="h6" fontWeight="bold">
                          :
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography variant="body1">
                          {value || "N/A"}
                        </Typography>
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
