import { Delete, Edit } from "@mui/icons-material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../../components/Header";

const Index = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all blogs from the API
    axios
      .get("https://backend.placemyfilms.com/blog/getAllBlogs")
      .then((response) => {
        if (response.data.status) {
          setBlogs(response.data.result);
        }
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
      });
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://backend.placemyfilms.com/blog/deleteBlogByID/${id}`)
          .then(() => {
            setBlogs(blogs.filter((blog) => blog.id !== id));
            Swal.fire("Deleted!", "Your blog has been deleted.", "success");
          })
          .catch((error) => {
            console.error("Error deleting blog:", error);
            Swal.fire(
              "Error!",
              "There was an issue deleting the blog.",
              "error"
            );
          });
      }
    });
  };

  const handleEdit = (id) => {
    navigate(`/editBlog/${id}`);
  };

  const handleAddNewBlog = () => {
    navigate("/addNewBlog");
  };

  const handleView = (id) => {
    navigate(`/viewBlog/${id}`);
  };

  return (
    <Box m="20px" height="76vh">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Header title="BLOGS" subtitle="View your all blogs" />
        <Button
          variant="contained"
          color="secondary"
          onClick={handleAddNewBlog}
        >
          Add New Blog
        </Button>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
        gap="20px"
      >
        {blogs.map((blog) => (
          <Card key={blog.id} sx={{ maxWidth: 345 }}>
            <img
              src={blog.imageURL}
              alt={blog.title}
              style={{ width: "100%", height: "200px", objectFit: "cover" }}
            />
            <CardContent>
              <Typography variant="h6">{blog.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {blog.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Author: {blog.author}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                color="primary"
                onClick={() => handleView(blog.id)}
                startIcon={<VisibilityIcon />}
              >
                View
              </Button>
              <Button
                size="small"
                color="primary"
                startIcon={<Edit />}
                onClick={() => handleEdit(blog.id)}
              >
                Edit
              </Button>
              <Button
                size="small"
                color="primary"
                startIcon={<Delete />}
                onClick={() => handleDelete(blog.id)}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Index;
