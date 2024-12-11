import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../../components/Header";

const Index = () => {
  const [castings, setCastings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://webback.opencurtainscasting.com/casting/getCastingAllImageDetails"
        );
        if (response.data.success) {
          setCastings(response.data.castings);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleDeleteClick = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this record!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `https://webback.opencurtainscasting.com/casting/deleteCastingImageDetails/${id}`
          );
          setCastings(castings.filter((casting) => casting.id !== id));
          Swal.fire("Deleted!", "The record has been deleted.", "success");
        } catch (error) {
          Swal.fire("Error!", "Could not delete the record.", "error");
        }
      }
    });
  };

  return (
    <div style={{ padding: "20px", height: "70vh" }}>
      <Header title="CHANGE CONTENT" subtitle="Change your content" />
      <Box
        sx={{
          mt: 4,
          display: "flex",
          flexDirection: "column",
          gap: 4,
          backgroundColor: "#f9f9f9",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          maxHeight: "70vh",
          overflow: "auto",
        }}
      >
        <Button
          variant="contained"
          color="secondary"
          sx={{ alignSelf: "flex-start" }}
          onClick={() => navigate("/add-new-banner")}
        >
          Add New Banner
        </Button>
        <Grid container spacing={2}>
          {castings.map((casting) => (
            <Grid item xs={12} sm={6} md={4} key={casting.id}>
              <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                  component="img"
                  sx={{
                    height: "190px",
                    width: "100%",
                    objectFit: "contain",
                  }}
                  image={casting.imageURL}
                  alt={`Banner ${casting.id}`}
                />

                <CardContent>
                  <Typography gutterBottom variant="h6">
                    ID: {casting.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Website:{" "}
                    <a
                      href={casting.websiteURL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {casting.websiteURL}
                    </a>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Created: {new Date(casting.createdAt).toLocaleString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => navigate(`/editBanner/${casting.id}`)}
                    startIcon={<EditIcon />}
                  >
                    {/* Optional: Include text alongside the icon if desired */}
                  </Button>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleDeleteClick(casting.id)}
                    startIcon={<DeleteIcon />}
                  >
                    {/* Optional: Include text alongside the icon if desired */}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
};

export default Index;
