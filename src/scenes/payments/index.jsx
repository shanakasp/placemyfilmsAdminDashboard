import { Visibility as VisibilityIcon } from "@mui/icons-material";
import { Box, IconButton, Tooltip, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const FormsUser = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = localStorage.getItem("accessToken");
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://backend.placemyfilms.com/payapi/getAllPayments",
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

      if (!responseData.success || !responseData.result) {
        throw new Error("Invalid response data format");
      }

      const formatDate = (isoDateString) => {
        const date = new Date(isoDateString);
        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });
      };

      const mappedData = responseData.result.map((item) => ({
        id: item.id,
        paymentId: item.paymentId,
        payID: item.payID,
        fullName: `${item.first_name} ${item.last_name}`,
        company: item.company_name,
        email: item.email_add,
        phone: item.phone,
        amount: item.payments?.amount
          ? `$${(item.payments.amount / 100).toFixed(2)}`
          : "N/A",
        status: item.payments?.status || "N/A",
        createdAt: formatDate(item.createdAt),
      }));

      setData(mappedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const columns = [
    // { field: "id", headerName: "ID", flex: 0.5 },
    { field: "payID", headerName: "Payment_ID", flex: 0.5 },
    { field: "fullName", headerName: "Customer Name", flex: 1 },
    { field: "company", headerName: "Company", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "amount", headerName: "Amount", flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      flex: 0.7,
      renderCell: (params) => (
        <Box
          sx={{
            backgroundColor:
              params.value === "succeeded"
                ? colors.green[100]
                : colors.grey[100],
            color:
              params.value === "succeeded"
                ? colors.green[900]
                : colors.grey[900],
            padding: "5px 10px",
            borderRadius: "4px",
            textTransform: "capitalize",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    { field: "createdAt", headerName: "Created At", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.7,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View Details">
            <Link to={`/payment/viewpayment/${params.row.payID}`}>
              <IconButton>
                <VisibilityIcon />
              </IconButton>
            </Link>
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
      <Header
        title="Payment Records"
        subtitle="View all payment transactions in the system"
      />

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
          pageSize={10}
        />
      </Box>
    </Box>
  );
};

export default FormsUser;
