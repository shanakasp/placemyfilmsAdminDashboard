import { Visibility as VisibilityIcon } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, IconButton, Tooltip, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const FormsUser = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = async (id) => {
    console.log(`Clicked edit on coupon with ID: ${id}`);
    // Implement the logic for editing coupon here
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://backend.placemyfilms.com/payapi/getAllCoupon",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch coupon data: ${response.statusText}`);
      }
      const responseData = await response.json();

      if (
        !responseData.status ||
        !responseData.result ||
        !Array.isArray(responseData.result)
      ) {
        throw new Error("Invalid response data format");
      }

      const mappedData = responseData.result.map((item) => ({
        id: item.id,
        code: item.code,
        details: item.details,
        amount: item.amount,
        status: item.status,
        createdAt: new Date(item.createdAt).toLocaleString(),
        updatedAt: new Date(item.updatedAt).toLocaleString(),
      }));

      setData(mappedData);
    } catch (error) {
      console.error("Error fetching coupon data:", error);
    }
  };

  const handleDeleteClick = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this coupon!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `https://backend.placemyfilms.com/payapi/deleteCouponByID/${id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error("Failed to delete coupon");
          }

          const updatedData = data.filter((item) => item.id !== id);
          setData(updatedData);
          Swal.fire("Deleted!", "Your coupon has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting coupon:", error);
          Swal.fire("Error!", "Failed to delete coupon.", "error");
        }
      }
    });
  };

  const handleAddNewBlog = () => {
    navigate("/coupon/add");
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "code", headerName: "Code", flex: 1 },
    { field: "details", headerName: "Details", flex: 1 },
    { field: "amount", headerName: "Amount", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "createdAt", headerName: "Created At", flex: 1.2 },
    { field: "updatedAt", headerName: "Updated At", flex: 1.2 },
    {
      field: "Actions",
      headerName: "Actions",
      flex: 0.7,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View">
            <Link to={`/coupon/view/${params.row.id}`}>
              <IconButton>
                <VisibilityIcon />
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip title="Edit">
            <Link to={`/coupon/edit/${params.row.id}`}>
              <IconButton>
                <EditIcon />
              </IconButton>
            </Link>
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

  const getRowClassName = (params) => {
    return "row-divider";
  };

  return (
    <Box m="20px">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Header title="Coupon Logs" subtitle="All the coupons in the system." />
        <Button
          variant="contained"
          color="secondary"
          onClick={handleAddNewBlog}
        >
          Add New Coupon
        </Button>
      </Box>
      <Box
        m="0 0 0 0"
        height="65vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
            fontSize: "14px",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.green[300],
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
          "& .row-divider": {
            borderBottom: `1px solid rgba(0, 0, 0, 0.1)`,
          },
        }}
      >
        <DataGrid
          rows={data}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowClassName={getRowClassName}
        />
      </Box>
    </Box>
  );
};

export default FormsUser;
