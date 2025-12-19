import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import styles from "./PageTemplate.module.css";
import clsx from "clsx";
import {
  Drawer,
  CssBaseline,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Navbar from "../Template/Navbar";
import SecondNavbar from "../Template/SecondNavbar";
import Dashboard from "../Dashboard/Dashboard";
import News from "../News/News";
import Search from "../Search/Search";
import SettingsModal from "./SettingsModal";
import Axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import config from "../../config/Config";
import LoadingSpinner from "../Loading/LoadingSpinner";
import ConnectionStatus from "../Dashboard/ConnectionStatus";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  appBarSpacer: theme.mixins.toolbar,
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
}));

const PageTemplate = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  const { userData, setUserData } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [purchasedStocks, setPurchasedStocks] = useState([]);
  const [portfolioLoading, setPortfolioLoading] = useState(true);
  const [portfolioError, setPortfolioError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("auth-token");
      const user = JSON.parse(localStorage.getItem("user-data"));

      if (token && user) {
        // Remove the token expiration check for now since it's causing issues
        setUserData({ token, user });
        getPurchasedStocks({ token, user });
      } else {
        console.log("No token or user found, navigating to login");
        navigate("/login");
      }
    };

    init();
  }, []);

  const getPurchasedStocks = async (overrideUserData) => {
    const user = overrideUserData?.user || userData?.user;
    const token = overrideUserData?.token || userData?.token;

    if (!user?.id || !token) {
      console.warn("Missing user or token in getPurchasedStocks", { user, token });
      setPortfolioLoading(false);
      setPortfolioError("User not authenticated");
      logout();
      return;
    }

    try {
      setPortfolioLoading(true);
      setPortfolioError(null);

      if (!config?.base_url) {
        throw new Error("API configuration missing");
      }

      const url = `${config.base_url}/api/stock/adduser/${user.id}`;
      console.log(url)
      const headers = {
        "x-auth-token": token,
        "Content-Type": "application/json",
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await Axios.get(url, {
        headers,
        signal: controller.signal,
        timeout: 10000,
      });

      clearTimeout(timeoutId);

      console.log("Portfolio response:", response.data);

      if (response?.data?.status === "success") {
        setPurchasedStocks(response.data.stocks || []);
      } else if (response?.data?.status === "fail") {
        if (response.data.message.includes("Credentials") || response.data.message.includes("Session expired")) {
          throw new Error("Session expired. Please log in again.");
        }
        throw new Error(response.data.message || "Request failed");
      } else if (response?.data?.status === "error") {
        throw new Error(response.data.message || "Server error");
      } else if (Array.isArray(response?.data)) {
        setPurchasedStocks(response.data);
      } else {
        throw new Error("Unexpected response format from server");
      }
    } catch (error) {
      console.error("Portfolio loading error:", error);

      let errorMessage = "Failed to load your portfolio. ";

      if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        errorMessage += "Request timed out. Please check your connection.";
      } else if (error.response?.status === 401 || error.message.includes("Credentials")) {
        errorMessage = "Session expired. Please log in again.";
        logout();
        return;
      } else if (error.response?.status === 404) {
        errorMessage += "Portfolio service not found.";
      } else if (error.response?.status >= 500) {
        errorMessage += "Server error. Please try again later.";
      } else if (error.message.includes("Network Error")) {
        errorMessage += "Network connection failed.";
      } else {
        errorMessage += error.message || "Unknown error occurred.";
      }

      setPortfolioError(errorMessage);
      setPurchasedStocks([]);
    } finally {
      setPortfolioLoading(false);
    }
  };

  useEffect(() => {
    if (
      retryCount < 3 &&
      portfolioError &&
      !portfolioLoading &&
      userData?.token &&
      userData?.user
    ) {
      const timer = setTimeout(() => {
        getPurchasedStocks({ token: userData.token, user: userData.user });
        setRetryCount(retryCount + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [portfolioError, retryCount, userData]);

  const logout = () => {
    console.log("Logout called: removing auth-token from localStorage");
    setUserData({
      token: undefined,
      user: undefined,
    });
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user-data");
    navigate("/login");
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const openSettings = () => {
    setSettingsOpen(true);
  };

  if (!userData?.user) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.root}>
      <CssBaseline />
      <ConnectionStatus />
      <AppBar
        position="absolute"
        className={clsx(
          styles.appBarBackground,
          classes.appBar,
          open && classes.appBarShift
        )}
      >
        <Toolbar className={styles.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              styles.menuButton,
              open && styles.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={styles.title}
          >
            {currentPage === "dashboard" && "Dashboard"}
            {currentPage === "news" && "News"}
            {currentPage === "search" && "Search"}
          </Typography>
          <Typography color="inherit">
            Hello,{" "}
            {userData.user?.username
              ? userData.user.username.charAt(0).toUpperCase() +
              userData.user.username.slice(1)
              : "User"}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={styles.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </List>
        <Divider />
        <List>
          <SecondNavbar logout={logout} openSettings={openSettings} />
        </List>
      </Drawer>
      <main className={clsx(styles.content, open && styles.contentShift)}>
        <div className={classes.appBarSpacer} />
        {currentPage === "dashboard" && (
          <Dashboard
            purchasedStocks={purchasedStocks}
            portfolioLoading={portfolioLoading}
            portfolioError={portfolioError}
            refreshPortfolio={() => {
              setRetryCount(0);
              getPurchasedStocks({ token: userData.token, user: userData.user });
            }}
          />
        )}
        {currentPage === "news" && <News />}
        {currentPage === "search" && (
          <Search
            setPurchasedStocks={setPurchasedStocks}
            purchasedStocks={purchasedStocks}
          />
        )}
        {settingsOpen && <SettingsModal setSettingsOpen={setSettingsOpen} />}
      </main>
    </div>
  );
};

export default PageTemplate;