import { Visibility as VisibilityIcon } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, IconButton, Tooltip, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const FormsUser = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const colors = tokens(theme.palette.mode);
  const token = localStorage.getItem("accessToken");
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://backend.placemyfilms.com/feedback/getAllFeedbacks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const responseData = await response.json();

      if (!responseData.status || !Array.isArray(responseData.result)) {
        throw new Error("Invalid response data format");
      }

      const formatDate = (isoDateString) => {
        const date = new Date(isoDateString);
        const formattedDate = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        const formattedTime = date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });
        return `${formattedDate} ${formattedTime}`;
      };

      const mappedData = responseData.result.map((item) => ({
        id: item.id,
        blogId: item.blogId,
        description: item.description,
        feedBackType: item.feedBackType,
        createdAt: formatDate(item.createdAt),
      }));

      setData(mappedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleViewClick = async (id) => {
    navigate(`/feedback/${id}`);
  };

  const handleDeleteClick = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this feedback!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `https://backend.placemyfilms.com/feedback/deleteFeedbackByID/${id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error("Failed to delete feedback");
          }

          const updatedData = data.filter((item) => item.id !== id);
          setData(updatedData);
          Swal.fire("Deleted!", "Your feedback has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting feedback:", error);
          Swal.fire("Error!", "Failed to delete feedback.", "error");
        }
      }
    });
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "blogId", headerName: "Blog ID", flex: 0.5 },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "feedBackType", headerName: "Feedback Type", flex: 0.8 },
    { field: "createdAt", headerName: "Created At", flex: 1 },
    {
      field: "Actions",
      headerName: "Actions",
      flex: 0.5,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View">
            <IconButton onClick={() => handleViewClick(params.row.id)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDeleteClick(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="Feedback Logs"
        subtitle="All feedbacks recorded in the system."
      />

      <Box
        height="65vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
            fontSize: "14px",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[800],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[900],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.green[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={data}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default FormsUser;
