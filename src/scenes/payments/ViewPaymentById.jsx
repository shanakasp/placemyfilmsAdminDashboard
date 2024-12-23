import {
  Box,
  CircularProgress,
  Grid,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import { tokens } from "../../theme";

function ViewPayment() {
  const { id } = useParams();
  const theme = useTheme();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    fetchPaymentDetails();
  }, [id]);

  const fetchPaymentDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://backend.placemyfilms.com/payapi/payment-details/${id}`
      );
      const responseData = await response.json();
      if (responseData.success) {
        const data = responseData.result[0];

        // Hide paydata and format createdAt/updatedAt
        if (data.payments) {
          const { paydata, createdAt, updatedAt, ...otherPayments } =
            data.payments;
          data.payments = {
            ...otherPayments,
            createdAt: formatDate(createdAt),
            updatedAt: formatDate(updatedAt),
          };
        }

        setPaymentDetails(data);
      } else {
        setError(
          "Failed to fetch payment details: " + responseData.response_code
        );
      }
    } catch (error) {
      setError("Error fetching payment details: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const formatFieldName = (field) => {
    return field.replace(/([A-Z])/g, " $1").trim();
  };

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m="20px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!paymentDetails) {
    return (
      <Box m="20px">
        <Typography variant="h6">No payment details found.</Typography>
      </Box>
    );
  }

  return (
    <Box m="20px" height="70vh" overflow="auto" paddingRight="20px">
      <Header title={`View Payment PayId:`} subtitle={` ${id}`} />

      <Box ml={"40px"}>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            mb={2}
            color={colors.blueAccent[400]}
          >
            Payment Details
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(paymentDetails).map(([field, value]) => {
              if (value === null || value === "") {
                return null;
              }
              if (field === "payments") {
                return (
                  <Grid item xs={12} key={field}>
                    <Typography variant="h6" fontWeight="bold" mt={2} mb={1}>
                      Payments
                    </Typography>
                    <Grid container spacing={2}>
                      {Object.entries(value).map(([key, val]) => {
                        if (key === "paydata") {
                          return null; // Hide paydata
                        }
                        return (
                          <Grid item xs={12} key={key}>
                            <Grid container>
                              <Grid item xs={3}>
                                <Typography
                                  variant="subtitle1"
                                  fontWeight="bold"
                                >
                                  {capitalizeFirstLetter(formatFieldName(key))}:
                                </Typography>
                              </Grid>
                              <Grid item xs={9}>
                                <Typography>{val}</Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Grid>
                );
              }
              return (
                <Grid item xs={12} key={field}>
                  <Grid container>
                    <Grid item xs={3}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {capitalizeFirstLetter(formatFieldName(field))}:
                      </Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography>{value}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
}

export default ViewPayment;
