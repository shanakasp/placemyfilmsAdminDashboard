import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CategoryIcon from "@mui/icons-material/Category";
import CountertopsIcon from "@mui/icons-material/Countertops";
import EditIcon from "@mui/icons-material/Edit";
import StripeIcon from "@mui/icons-material/Payment";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Fade,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";

const Index = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  // Custom styles object
  const styles = {
    rootContainer: {
      height: "70%",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden", // Prevent outer scroll
    },
    pageContainer: {
      height: "100%",
      backgroundColor: theme.palette.background.default,
      display: "flex",
      margin: "20px",
      flexDirection: "column",
    },
    scrollableContent: {
      maxHeight: "70vh",
      overflowY: "auto",
      padding: "20px",
      flex: 1,
      "&::-webkit-scrollbar": {
        width: "8px",
      },
      "&::-webkit-scrollbar-track": {},
      "&::-webkit-scrollbar-thumb": {
        borderRadius: "4px",
      },
    },
    cardsContainer: {
      display: "flex",
      gap: "24px",
      flexWrap: "wrap",
      justifyContent: "center",
      padding: "0 16px",
      paddingBottom: "32px",
    },
    // ... rest of the styles remain the same
    card: {
      flexBasis: "calc(50% - 24px)",
      minWidth: "300px",
      transition: "all 0.3s ease",
      borderRadius: "16px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      position: "relative",
      overflow: "hidden",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
      },
      "@media (max-width: 768px)": {
        flexBasis: "100%",
      },
    },
    cardContent: {
      padding: "28px !important",
    },
    headerSection: {
      marginBottom: "24px",
      borderBottom: `2px solid ${theme.palette.divider}`,
      paddingBottom: "16px",
    },
    titleRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "8px",
    },
    title: {
      fontWeight: 700,
      fontSize: "28px",
      color: theme.palette.primary.main,
      letterSpacing: "-0.5px",
    },
    infoRow: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "12px",
    },
    infoIcon: {
      color: theme.palette.primary.main,
      fontSize: "20px",
    },
    infoText: {
      fontSize: "16px",
      color: theme.palette.text.secondary,
      fontWeight: 500,
    },
    price: {
      display: "flex",
      alignItems: "center",
      fontSize: "32px",
      fontWeight: 700,
      color: theme.palette.success.main,
      marginBottom: "16px",
      "& .MuiSvgIcon-root": {
        marginRight: "4px",
      },
    },
    stripeSection: {
      backgroundColor: theme.palette.background.paper,
      borderRadius: "8px",
      padding: "12px",
      marginTop: "16px",
    },
    editButton: {
      width: "100%",
      marginTop: "24px",
      padding: "12px",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: 600,
      textTransform: "none",
      // backgroundColor: theme.palette.primary.main,
      backgroundColor: "#32E3BD",
    },
    timeStampChip: {
      fontSize: "12px",
      borderRadius: "16px",
      backgroundColor: theme.palette.background.paper,
      marginRight: "8px",
    },
  };
  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://webback.opencurtainscasting.com/subscriptionPackage/getAll"
        );
        if (response.data.status) {
          setPackages(response.data.result);
        }
      } catch (error) {
        console.error("Error fetching subscription packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handleEdit = (id) => {
    navigate(`/subscription/edit/${id}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h6">Loading packages...</Typography>
      </Box>
    );
  }
  return (
    <Box sx={styles.rootContainer}>
      <Box sx={styles.pageContainer}>
        <Header
          title="SUBSCRIPTION PACKAGES"
          subtitle="Manage and monitor your subscription packages"
        />
        <Box sx={styles.scrollableContent}>
          <Box sx={styles.cardsContainer}>
            {packages.map((pkg) => (
              <Fade in={true} timeout={500} key={pkg.id}>
                <Card sx={styles.card}>
                  <CardContent sx={styles.cardContent}>
                    {/* Card content remains the same */}
                    <Box sx={styles.headerSection}>
                      <Box sx={styles.titleRow}>
                        <Typography sx={styles.title}>{pkg.title}</Typography>
                        <Chip
                          label={pkg.type}
                          color={pkg.type === "calls" ? "primary" : "secondary"}
                          size="small"
                        />
                      </Box>

                      <Typography sx={styles.price} component="div">
                        <AttachMoneyIcon />
                        {pkg.price}
                      </Typography>
                    </Box>

                    <Box sx={styles.infoRow}>
                      <CategoryIcon sx={styles.infoIcon} />
                      <Typography sx={styles.infoText}>
                        Type:{" "}
                        {pkg.type.charAt(0).toUpperCase() + pkg.type.slice(1)}
                      </Typography>
                    </Box>

                    <Box sx={styles.infoRow}>
                      <CountertopsIcon sx={styles.infoIcon} />
                      <Typography sx={styles.infoText}>
                        Count: {pkg.count}
                      </Typography>
                    </Box>

                    <Box sx={styles.stripeSection}>
                      <Box sx={styles.infoRow}>
                        <StripeIcon sx={styles.infoIcon} />
                        <Tooltip
                          title={pkg.stripe_price_object_id}
                          placement="top"
                        >
                          <Typography sx={styles.infoText} noWrap>
                            Price ID:{" "}
                            {pkg.stripe_price_object_id.substring(0, 15)}...
                          </Typography>
                        </Tooltip>
                      </Box>
                      <Box sx={styles.infoRow}>
                        <StripeIcon sx={styles.infoIcon} />
                        <Tooltip
                          title={pkg.stripe_product_object_id}
                          placement="top"
                        >
                          <Typography sx={styles.infoText} noWrap>
                            Product ID:{" "}
                            {pkg.stripe_product_object_id.substring(0, 15)}...
                          </Typography>
                        </Tooltip>
                      </Box>
                    </Box>

                    <Box
                      sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}
                    >
                      <Tooltip title="Created At" placement="top">
                        <Chip
                          icon={<AccessTimeIcon />}
                          label={formatDate(pkg.createdAt)}
                          sx={styles.timeStampChip}
                          size="small"
                        />
                      </Tooltip>
                      <Tooltip title="Updated At" placement="top">
                        <Chip
                          icon={<AccessTimeIcon />}
                          label={formatDate(pkg.updatedAt)}
                          sx={styles.timeStampChip}
                          size="small"
                        />
                      </Tooltip>
                    </Box>

                    <Button
                      sx={styles.editButton}
                      onClick={() => handleEdit(pkg.id)}
                      startIcon={<EditIcon />}
                    >
                      Edit Package
                    </Button>
                  </CardContent>
                </Card>
              </Fade>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Index;
