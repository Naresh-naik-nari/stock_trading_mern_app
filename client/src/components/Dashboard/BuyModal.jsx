import React, { useState } from "react";
import { Modal, Backdrop, Fade, Typography, TextField, Button, Box } from "@material-ui/core";
import styles from "./Dashboard.module.css";

const BuyModal = ({ setBuyOpen, stock }) => {
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  const handleClose = () => {
    setBuyOpen(false);
  };

  const handleBuy = () => {
    if (quantity < 1) {
      setError("Quantity must be at least 1");
      return;
    }
    // TODO: Implement buy logic here, e.g., call API to buy stock
    console.log(`Buying ${quantity} shares of ${stock.ticker}`);
    setBuyOpen(false);
  };

  return (
    <Modal
      open={true}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      className={styles.modal}
    >
      <Fade in={true}>
        <Box className={styles.modalContent}>
          <Typography variant="h6" gutterBottom>
            Buy {stock.ticker} Shares
          </Typography>
          <TextField
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            fullWidth
            error={!!error}
            helperText={error}
            inputProps={{ min: 1 }}
            margin="normal"
          />
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button onClick={handleClose} color="default" style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button onClick={handleBuy} color="primary" variant="contained">
              Buy
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default BuyModal;
