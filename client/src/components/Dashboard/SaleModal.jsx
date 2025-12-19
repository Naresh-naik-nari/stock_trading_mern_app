import React, { useState, useContext } from "react";
import ReactDOM from "react-dom";
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
  // Use React Portal to render modal outside the main DOM tree
  return ReactDOM.createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
        boxSizing: 'border-box'
      }}
      onClick={(e) => {
        // Close modal when clicking backdrop
        if (e.target === e.currentTarget) {
          setSaleOpen(false);
        }
      }}
    >
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        style={{ maxWidth: '500px', width: '100%' }}
      >
        <SaleModalContent setSaleOpen={setSaleOpen} stock={stock} />
      </motion.div>
    </motion.div>,
    document.body
  );
};

const SaleModalContent = ({ setSaleOpen, stock }) => {
  const { userData } = useContext(UserContext);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleQuantityChange = (e) => {
    if (!isNaN(e.target.value) && Number(e.target.value) <= stock.quantity) {
      setQuantity(e.target.value);
    }
  };

  const handleClick = () => {
    document.body.style.overflow = 'unset';
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
        setTimeout(() => {
          document.body.style.overflow = 'unset';
          setSaleOpen(false);
          // Trigger a refresh of the parent component instead of full page reload
          if (window.location.pathname.includes('dashboard')) {
            window.location.reload();
          }
        }, 1500);
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
    <Card style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
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
  );
};

export default SaleModal;
