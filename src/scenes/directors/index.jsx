import { Visibility as VisibilityIcon } from "@mui/icons-material";
import {
  Box,
  IconButton,
  MenuItem,
  Select,
  Tooltip,
  useTheme,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const FormsUser = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = localStorage.getItem("accessToken");

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://webback.opencurtainscasting.com/director/getAllDirectors",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const userData = response.data.users.directorProfiles.map(
          (profile) => ({
            ...profile.user,
            imageURL: profile.profile.imageURL,
            id: profile.user.id,
          })
        );
        setUsers(userData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [token]);

  const handleAdminActiveChange = async (userId, newStatus) => {
    const activateStatus = newStatus ? 1 : 0;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to ${
        newStatus ? "activate" : "deactivate"
      } this user.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, continue",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.patch(
          `https://webback.opencurtainscasting.com/user/updateUserAccess/${userId}`,
          { activate: activateStatus },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId
              ? { ...user, adminActive: activateStatus === 1 }
              : user
          )
        );

        Swal.fire("Success", "User status updated successfully", "success");
      } catch (error) {
        Swal.fire(
          "Error",
          "There was an error updating the user status",
          "error"
        );
      }
    } else {
      Swal.fire("Canceled", "The action has been canceled.", "info");
    }
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "firstName", headerName: "First Name", flex: 1 },
    { field: "lastName", headerName: "Last Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1.3 },
    { field: "contactNumber", headerName: "Contact Number", flex: 1 },
    {
      field: "adminActive",
      headerName: "Admin Active",
      flex: 1,
      renderCell: ({ row }) => (
        <Select
          value={row.adminActive ? "Active" : "Deactivate"}
          onChange={(event) =>
            handleAdminActiveChange(row.id, event.target.value === "Active")
          }
          displayEmpty
          variant="standard"
          sx={{
            color: row.adminActive
              ? colors.greenAccent[500]
              : colors.redAccent[500],
          }}
        >
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Deactivate">Deactivate</MenuItem>
        </Select>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      renderCell: ({ row }) => (
        <Box>
          <Tooltip title="View">
            <Link to={`/director/${row.id}`}>
              <IconButton>
                <VisibilityIcon />
              </IconButton>
            </Link>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="DIRECTORS" subtitle="Manage Directors" />
      <Box
        m="40px 0 0 0"
        height="70vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid
          rows={users}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
        />
      </Box>
    </Box>
  );
};

export default FormsUser;
