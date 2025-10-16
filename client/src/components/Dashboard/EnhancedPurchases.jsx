import React, { useState } from "react";
import { Link, Typography, Box } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Title from "../Template/Title.jsx";
import SaleModal from "./SaleModal";
import styles from "./Dashboard.module.css";
import LoadingSpinner from "../Loading/LoadingSpinner";

const EnhancedPurchases = ({ purchasedStocks, portfolioLoading, portfolioError, refreshPortfolio }) => {
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
      <LoadingSpinner text="Loading your portfolio..." size={50} />
    );
  }

  if (portfolioError) {
    return (
      <div className={styles.errorContainer}>
        <Typography variant="h6" component="h3">
          📊 Portfolio Error
        </Typography>
        <Typography variant="body1">
          {portfolioError}
        </Typography>
        <button className={styles.retryButton} onClick={refreshPortfolio}>
          🔄 Retry Loading
        </button>
      </div>
    );
  }

  if (!purchasedStocks || purchasedStocks.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h3>📈 No Stocks in Portfolio</h3>
        <p>Start your investment journey today!</p>
        <p>Use the <strong>Search</strong> tab to find and buy stocks.</p>
        <Typography variant="body2" style={{ marginTop: '1rem', opacity: 0.7 }}>
          💡 Tip: Start with well-known companies like Apple (AAPL) or Microsoft (MSFT)
        </Typography>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className={`${styles.portfolioContainer} ${styles.slideIn}`} style={{ minHeight: "200px" }}>
        <Title>📊 Stocks in Your Portfolio ({purchasedStocks.length})</Title>
        <Table size="small">
          <TableHead className={styles.tableHeader}>
            <TableRow>
              <TableCell style={{color: 'white', fontWeight: 600}}>🏢 Ticker</TableCell>
              <TableCell style={{color: 'white', fontWeight: 600}}>📝 Company</TableCell>
              <TableCell style={{color: 'white', fontWeight: 600}}>📦 Qty</TableCell>
              <TableCell style={{color: 'white', fontWeight: 600}}>💵 Bought At</TableCell>
              <TableCell style={{color: 'white', fontWeight: 600}}>💰 Invested</TableCell>
              <TableCell align="right" style={{color: 'white', fontWeight: 600}}>📈 Current</TableCell>
              <TableCell align="right" style={{color: 'white', fontWeight: 600}}>💎 Worth</TableCell>
              <TableCell align="right" style={{color: 'white', fontWeight: 600}}>📊 Performance</TableCell>
              <TableCell align="center" style={{color: 'white', fontWeight: 600}}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchasedStocks.map((row) => {
              const difference = (row.currentPrice - row.purchasePrice) / row.currentPrice;
              const purchaseTotal = Number(row.quantity) * Number(row.purchasePrice);
              const currentTotal = Number(row.quantity) * Number(row.currentPrice);
              const profitLoss = currentTotal - purchaseTotal;
              
              return (
                <TableRow key={row.id} className={styles.tableRow}>
                  <TableCell>
                    <Link 
                      onClick={() => openSaleModal(row)} 
                      className={styles.stockTicker}
                      component="button"
                      variant="body1"
                    >
                      {row.ticker}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span className={styles.stockName}>
                      {row.name || "----"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" style={{ fontWeight: 600 }}>
                      {row.quantity || "----"}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" className={styles.priceCell}>
                    ${row.purchasePrice?.toLocaleString() || "----"}
                  </TableCell>
                  <TableCell align="right" className={styles.priceCell}>
                    ${roundNumber(purchaseTotal).toLocaleString() || "----"}
                  </TableCell>
                  <TableCell
                    align="right"
                    className={`${styles.priceCell} ${
                      row.currentPrice >= row.purchasePrice
                        ? styles.positive
                        : styles.negative
                    }`}
                  >
                    ${row.currentPrice?.toLocaleString() || "----"}
                  </TableCell>
                  <TableCell
                    align="right"
                    className={`${styles.priceCell} ${
                      currentTotal >= purchaseTotal
                        ? styles.positive
                        : styles.negative
                    }`}
                  >
                    ${roundNumber(currentTotal).toLocaleString() || "----"}
                  </TableCell>
                  <TableCell
                    align="right"
                    className={`${styles.priceCell} ${
                      difference >= 0 ? styles.positive : styles.negative
                    }`}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <span className={styles.changeIndicator}>
                        {difference >= 0 ? "📈" : "📉"}
                      </span>
                      <Typography variant="body2" style={{ fontWeight: 600 }}>
                        {Math.abs(difference * 100).toFixed(2)}%
                      </Typography>
                      <Typography variant="caption" style={{ opacity: 0.8 }}>
                        ${profitLoss >= 0 ? '+' : ''}${roundNumber(profitLoss).toLocaleString()}
                      </Typography>
                    </div>
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
        
        {/* Portfolio Summary */}
        <Box mt={2} p={2} className={styles.portfolioSummary}>
          <Typography variant="h6" gutterBottom>
            📈 Portfolio Summary
          </Typography>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <Typography variant="body2">
              Total Positions: <strong>{purchasedStocks.length}</strong>
            </Typography>
            <Typography variant="body2">
              Total Shares: <strong>{purchasedStocks.reduce((sum, stock) => sum + Number(stock.quantity), 0)}</strong>
            </Typography>
          </div>
        </Box>
        
        {saleOpen && stock && (
          <SaleModal setSaleOpen={setSaleOpen} stock={stock} />
        )}
      </div>
    </React.Fragment>
  );
};

export default EnhancedPurchases;
