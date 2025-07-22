import React from "react";
import styles from "../Template/PageTemplate.module.css";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Container, Grid, Paper } from "@material-ui/core";
import Chart from "./Chart";
import Balance from "./Balance";
import EnhancedPurchases from "./EnhancedPurchases";
import Copyright from "../Template/Copyright";
import RealtimeDemo from "./RealtimeDemo";
import LoadingSpinner from "../Loading/LoadingSpinner";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 350,
  },
}));

const Dashboard = ({ purchasedStocks, portfolioLoading, portfolioError, refreshPortfolio }) => {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <Container maxWidth="lg" className={styles.container}>
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper className={fixedHeightPaper}>
            <Chart />
          </Paper>
        </Grid>
        {/* Balance */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper className={fixedHeightPaper}>
            <Balance 
              purchasedStocks={purchasedStocks} 
              portfolioLoading={portfolioLoading}
            />
          </Paper>
        </Grid>
        {/* Recent Purchases */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <EnhancedPurchases 
              purchasedStocks={purchasedStocks} 
              portfolioLoading={portfolioLoading}
              portfolioError={portfolioError}
              refreshPortfolio={refreshPortfolio}
            />
          </Paper>
        </Grid>
        <RealtimeDemo />
      </Grid>
      <Box pt={4}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default Dashboard;
