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
        "https://backend.placemyfilms.com/payapi/getAllBilling",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch billing data: ${response.statusText}`);
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
        paymentId: item.paymentId,
        firstName: item.first_name,
        lastName: item.last_name,
        amount: item.payments.amount,
        currency: item.payments.currency,
        status: item.payments.status,
        createdAt: new Date(item.createdAt).toLocaleString(),
      }));

      setData(mappedData);
    } catch (error) {
      console.error("Error fetching billing data:", error);
    }
  };

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
            throw new Error("Failed to delete record");
          }

          const updatedData = data.filter((item) => item.id !== id);
          setData(updatedData);
          Swal.fire("Deleted!", "Your record has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting record:", error);
          Swal.fire("Error!", "Failed to delete record.", "error");
        }
      }
    });
  };

  const handleAddNewBlog = () => {
    navigate("/coupon/add");
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "paymentId", headerName: "Payment ID", flex: 1 },
    { field: "firstName", headerName: "First Name", flex: 1 },
    { field: "lastName", headerName: "Last Name", flex: 1 },
    { field: "amount", headerName: "Amount", flex: 1 },
    { field: "currency", headerName: "Currency", flex: 1 },
    { field: "status", headerName: "Payment Status", flex: 1 },
    { field: "createdAt", headerName: "Created At", flex: 1.2 },
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
        <Header
          title="Billing Logs"
          subtitle="All the billing records in the system."
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={handleAddNewBlog}
        >
          Add New Billing Record
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
