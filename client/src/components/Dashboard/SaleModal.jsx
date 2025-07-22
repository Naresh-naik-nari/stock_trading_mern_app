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
    if (!isNaN(e.target.value) && Number(e.target.value) <= stock.quantity) {
      setQuantity(e.target.value);
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
    const url = config.base_url + `/api/stock`;
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
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: "100vh" }}
    >
      <Box width="60vh" boxShadow={1}>
        <Card>
          <CardHeader
            action={
              <IconButton aria-label="Close" onClick={handleClick}>
                <CloseIcon />
              </IconButton>
            }
          />
          <CardContent>
            <Typography component="h1" variant="h6" align="center">
              Sell
            </Typography>
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
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                disabled
                id="name"
                label="Name"
                name="Name"
                autoComplete="Name"
                value={stock.name}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                disabled
                id="price"
                label="Price"
                name="price"
                autoComplete="price"
                value={stock.currentPrice}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="quantity"
                label="Quantity"
                name="quantity"
                autoComplete="quantity"
                value={quantity}
                onChange={handleQuantityChange}
                disabled={loading}
              />
            </form>
            <br />
            <Box display="flex" justifyContent="center">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={styles.confirm}
                onClick={sellStock}
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm"}
              </Button>
            </Box>
            <br />
            <br />
          </CardContent>
        </Card>
      </Box>
    </Grid>
  );
};

export default SaleModal;
