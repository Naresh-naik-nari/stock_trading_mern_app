import React, { useState, useContext } from "react";
import UserContext from "../../context/UserContext";
import styles from "../Template/PageTemplate.module.css";
import {
  Typography,
  IconButton,
  Box,
  Button,
  TextField,
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
} from "@material-ui/core";
import { motion } from "framer-motion";
import CloseIcon from "@material-ui/icons/Close";
import Axios from "axios";
import config from "../../config/Config";

const SaleModal = ({ setSaleOpen, stock }) => {
  return (
    <motion.div
      className={styles.backdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      id="backdrop"
    >
      <Container>
        <motion.div animate={{ opacity: 1, y: -20 }}>
          <SaleModalContent setSaleOpen={setSaleOpen} stock={stock} />
        </motion.div>
      </Container>
    </motion.div>
  );
};

const SaleModalContent = ({ setSaleOpen, stock }) => {
  const { userData } = useContext(UserContext);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleQuantityChange = (e) => {
    const val = e.target.value;
    if (!isNaN(val) && Number(val) >= 1 && Number(val) <= stock.quantity) {
      setQuantity(val);
      setErrorMessage("");
    } else {
      setErrorMessage(`Quantity must be between 1 and ${stock.quantity}`);
    }
  };

  const handleClick = () => {
    setSaleOpen(false);
  };

  const sellStock = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
    const headers = {
      "x-auth-token": userData.token,
    };
    const data = {
      stockId: stock.id,
      quantity: Number(quantity),
      userId: userData.user.id,
      price: Number(stock.currentPrice),
    };
    const url = config.base_url + `/api/stock/sell`;
    try {
      const response = await Axios.patch(url, data, {
        headers,
      });
      if (response.data.status === "success") {
        setSuccessMessage("Sale successful!");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setErrorMessage(response.data.message || "Sale failed.");
      }
    } catch (err) {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid
      container
      spacing={2}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: "100vh", padding: 16, overflowY: "auto" }}
    >
      <Box width="100%" maxWidth="400px" boxShadow={3} borderRadius={8} bgcolor="background.paper" p={3}>
        <Card>
          <CardHeader
            title="Sell Stock"
            titleTypographyProps={{ align: "center", variant: "h6" }}
            action={
              <IconButton aria-label="Close" onClick={handleClick}>
                <CloseIcon />
              </IconButton>
            }
          />
          <CardContent>
            {successMessage && (
              <Typography color="primary" align="center" style={{ marginBottom: 10 }}>
                {successMessage}
              </Typography>
            )}
            {errorMessage && (
              <Typography color="error" align="center" style={{ marginBottom: 10 }}>
                {errorMessage}
              </Typography>
            )}
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    disabled
                    id="name"
                    label="Name"
                    name="Name"
                    autoComplete="Name"
                    value={stock.name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    disabled
                    id="price"
                    label="Price"
                    name="price"
                    autoComplete="price"
                    value={stock.currentPrice}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="quantity"
                    label="Quantity"
                    name="quantity"
                    autoComplete="quantity"
                    type="number"
                    inputProps={{ min: 1, max: stock.quantity }}
                    value={quantity}
                    onChange={handleQuantityChange}
                    disabled={loading}
                  />
                </Grid>
              </Grid>
            </form>
            <Box display="flex" justifyContent="center" mt={3}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={styles.confirm}
                onClick={sellStock}
                disabled={loading || !!errorMessage || quantity < 1}
              >
                {loading ? "Processing..." : "Confirm"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Grid>
  );
};

export default SaleModal;
