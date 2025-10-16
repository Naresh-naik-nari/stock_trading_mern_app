import React, { useState } from "react";
import { Link, Typography, Box, Button } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "../Template/Title.jsx";
import SaleModal from "./SaleModal";
import styles from "./Dashboard.module.css";
import LoadingSpinner from "../Loading/LoadingSpinner";
import SellIcon from '@mui/icons-material/Sell';


const Purchases = ({ purchasedStocks, portfolioLoading, portfolioError, refreshPortfolio }) => {
  const [saleOpen, setSaleOpen] = useState(false);
  const [stock, setStock] = useState(undefined);

  const roundNumber = (num) => {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  };

  const openSaleModal = (stock) => {
    setStock(stock);
    setSaleOpen(true);
  };

  if (portfolioLoading) {
    return (
      <LoadingSpinner text="Loading portfolio..." size={50} />
    );
  }

  if (portfolioError) {
    return (
      <Box textAlign="center" p={4}>
        <Typography color="error" variant="h6">
          {portfolioError}
        </Typography>
        <Link component="button" variant="body2" onClick={refreshPortfolio}>
          Retry
        </Link>
      </Box>
    );
  }

  return (
    <React.Fragment>
      <div style={{ minHeight: "200px" }}>
        <Title>Stocks in Your Portfolio</Title>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Company Ticker</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Price of Purchase</TableCell>
              <TableCell>Purchase Total</TableCell>
              <TableCell align="right">Current Price</TableCell>
              <TableCell align="right">Current Total</TableCell>
              <TableCell align="right">Difference</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchasedStocks.map((row) => {
              const difference = (row.currentPrice - row.purchasePrice) / row.currentPrice;
              const purchaseTotal = Number(row.quantity) * Number(row.purchasePrice);
              const currentTotal = Number(row.quantity) * Number(row.currentPrice);

              return (
                <TableRow key={row.id}>
                  <TableCell>
                    <Link onClick={() => openSaleModal(row)}>{row.ticker}</Link>
                  </TableCell>
                  <TableCell>{row.name || "----"}</TableCell>
                  <TableCell>{row.quantity || "----"}</TableCell>
                  <TableCell align="right">
                    ${row.purchasePrice.toLocaleString() || "----"}
                  </TableCell>
                  <TableCell align="right">
                    ${roundNumber(purchaseTotal).toLocaleString() || "----"}
                  </TableCell>
                  <TableCell
                    align="right"
                    className={
                      row.currentPrice >= row.purchasePrice
                        ? styles.positive
                        : styles.negative
                    }
                  >
                    ${row.currentPrice.toLocaleString() || "----"}
                  </TableCell>
                  <TableCell
                    align="right"
                    className={
                      currentTotal >= purchaseTotal
                        ? styles.positive
                        : styles.negative
                    }
                  >
                    ${roundNumber(currentTotal).toLocaleString() || "----"}
                  </TableCell>
                  <TableCell
                    align="right"
                    className={difference >= 0 ? styles.positive : styles.negative}
                  >
                    {difference >= 0 ? "▲" : "▼"}{" "}
                    {Math.abs(difference * 100).toFixed(2)}%
                  </TableCell>
                  <TableCell align="center">
                    <button 
                      onClick={() => openSaleModal(row)} 
                      style={{
                        backgroundColor: '#ff4757',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        transition: 'background-color 0.3s'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#ff3838'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#ff4757'}
                    >
                      Sell
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {saleOpen && stock && (
          <SaleModal setSaleOpen={setSaleOpen} stock={stock} />
        )}
      </div>
    </React.Fragment>
  );
};

export default Purchases;
