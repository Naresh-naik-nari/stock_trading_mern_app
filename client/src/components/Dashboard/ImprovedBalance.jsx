import React, { useContext, useState, useEffect } from "react";
import UserContext from "../../context/UserContext";
import { Typography, Box, Chip } from "@material-ui/core/";
import { TrendingUp, TrendingDown, AccountBalance } from "@material-ui/icons";
import Title from "../Template/Title.jsx";
import styles from "./Dashboard.module.css";
import LoadingSpinner from "../Loading/LoadingSpinner";

const ImprovedBalance = ({ purchasedStocks, portfolioLoading }) => {
  const { userData } = useContext(UserContext);
  const [portfolioBalance, setPortfolioBalance] = useState(0);
  const [portfolioChange, setPortfolioChange] = useState(0);

  const getPortfolioBalance = () => {
    let total = 0;
    let totalChange = 0;
    
    purchasedStocks.forEach((stock) => {
      const currentValue = Number(stock.currentPrice) * Number(stock.quantity);
      const originalValue = Number(stock.purchasePrice) * Number(stock.quantity);
      total += currentValue;
      totalChange += (currentValue - originalValue);
    });

    setPortfolioChange(totalChange);
    return Math.round((total + Number.EPSILON) * 100) / 100;
  };

  useEffect(() => {
    setPortfolioBalance(getPortfolioBalance());
  }, [purchasedStocks]);

  const totalBalance = userData ? userData.user.balance + portfolioBalance : 0;
  const portfolioPercentage = totalBalance > 0 ? ((portfolioBalance / totalBalance) * 100).toFixed(1) : 0;

  return (
    <React.Fragment>
      <Title>Portfolio Overview</Title>
      <Box className={styles.depositContext} style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Background decoration */}
        <Box 
          style={{
            position: 'absolute',
            top: -20,
            right: -20,
            opacity: 0.1,
            fontSize: '4rem'
          }}
        >
          <AccountBalance style={{ fontSize: 'inherit' }} />
        </Box>

        {/* Cash Balance */}
        <Box mb={2}>
          <Typography 
            style={{ 
              color: 'rgba(255,255,255,0.9)', 
              fontSize: '0.85rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }} 
            align="center"
          >
            Cash Available
          </Typography>
          <Typography 
            component="p" 
            variant="h5" 
            align="center" 
            style={{ 
              color: 'white', 
              fontWeight: 600, 
              margin: '8px 0',
              textShadow: '0 1px 3px rgba(0,0,0,0.3)'
            }}
          >
            ${userData ? userData.user.balance.toLocaleString() : "---"}
          </Typography>
        </Box>

        {/* Portfolio Balance */}
        <Box mb={2}>
          <Typography 
            style={{ 
              color: 'rgba(255,255,255,0.9)', 
              fontSize: '0.85rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }} 
            align="center"
          >
            Stock Portfolio
          </Typography>
          <Typography 
            component="div" 
            variant="h5" 
            align="center" 
            style={{ 
              color: 'white', 
              fontWeight: 600, 
              margin: '8px 0',
              textShadow: '0 1px 3px rgba(0,0,0,0.3)'
            }}
          >
            {portfolioLoading ? (
              <LoadingSpinner text="" size={20} />
            ) : (
              <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                <span>${portfolioBalance.toLocaleString()}</span>
                {portfolioChange !== 0 && (
                  <Chip
                    icon={portfolioChange > 0 ? <TrendingUp /> : <TrendingDown />}
                    label={`${portfolioChange > 0 ? '+' : ''}$${Math.abs(portfolioChange).toFixed(2)}`}
                    size="small"
                    style={{
                      backgroundColor: portfolioChange > 0 ? 'rgba(76, 175, 80, 0.8)' : 'rgba(244, 67, 54, 0.8)',
                      color: 'white',
                      fontSize: '0.7rem',
                      height: '20px'
                    }}
                  />
                )}
              </Box>
            )}
          </Typography>
          {!portfolioLoading && portfolioBalance > 0 && (
            <Typography 
              style={{ 
                color: 'rgba(255,255,255,0.8)', 
                fontSize: '0.75rem',
                textAlign: 'center'
              }}
            >
              {portfolioPercentage}% of total balance
            </Typography>
          )}
        </Box>

        {/* Total Balance */}
        <Box className={styles.addMargin} style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1rem' }}>
          <Typography 
            style={{ 
              color: 'rgba(255,255,255,0.9)', 
              fontSize: '0.9rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }} 
            align="center"
          >
            Total Net Worth
          </Typography>
          <Typography
            component="div"
            variant="h3"
            align="center"
            style={{
              color: 'white',
              fontWeight: 700,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              margin: '12px 0'
            }}
          >
            {portfolioLoading ? (
              <LoadingSpinner text="" size={30} />
            ) : (
              `$${totalBalance.toLocaleString()}`
            )}
          </Typography>
        </Box>
      </Box>
      
      <Box mt={2} textAlign="center">
        <Typography 
          color="textSecondary" 
          style={{ 
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </Typography>
        {!portfolioLoading && purchasedStocks.length > 0 && (
          <Typography 
            color="textSecondary" 
            style={{ fontSize: '0.75rem', marginTop: '4px' }}
          >
            Tracking {purchasedStocks.length} stock position{purchasedStocks.length !== 1 ? 's' : ''}
          </Typography>
        )}
      </Box>
    </React.Fragment>
  );
};

export default ImprovedBalance;