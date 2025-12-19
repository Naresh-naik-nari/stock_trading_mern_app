import React from "react";
import { Box, Typography, Fade, LinearProgress } from "@material-ui/core";
import { TrendingUp, ShowChart, Assessment } from "@material-ui/icons";
import "./ImprovedLoadingSpinner.css";

const ImprovedLoadingSpinner = ({ 
  fullScreen = false, 
  text = "Loading...", 
  size = 60,
  showIcon = true 
}) => {
  if (!fullScreen) {
    // Simple loading for non-fullscreen
    return (
      <Box className="simple-loader">
        <div className="spinner-ring"></div>
        <Typography variant="body2" color="textSecondary" style={{ marginTop: '1rem' }}>
          {text}
        </Typography>
      </Box>
    );
  }

  return (
    <Fade in timeout={500}>
      <div className="professional-fullscreen-loader">
        {/* Background with gradient */}
        <div className="loader-background"></div>
        
        {/* Main content */}
        <div className="loader-content">
          {/* Logo/Brand section */}
          <div className="brand-section">
            <div className="logo-container">
              <TrendingUp className="main-logo" />
              <ShowChart className="accent-icon accent-1" />
              <Assessment className="accent-icon accent-2" />
            </div>
            <Typography variant="h4" className="brand-title">
              Stock Trading Simulator
            </Typography>
            <Typography variant="subtitle1" className="brand-subtitle">
              Professional Trading Platform
            </Typography>
          </div>

          {/* Loading animation */}
          <div className="loading-section">
            <div className="custom-spinner">
              <div className="spinner-outer"></div>
              <div className="spinner-inner"></div>
              <div className="spinner-center">
                <TrendingUp className="center-icon" />
              </div>
            </div>
            
            <Typography variant="h6" className="loading-text">
              {text}
            </Typography>
            
            <div className="progress-container">
              <LinearProgress 
                className="custom-progress"
                variant="indeterminate"
              />
            </div>
          </div>

          {/* Status indicators */}
          <div className="status-section">
            <div className="status-item">
              <div className="status-dot connecting"></div>
              <span>Connecting to markets</span>
            </div>
            <div className="status-item">
              <div className="status-dot loading"></div>
              <span>Loading portfolio data</span>
            </div>
            <div className="status-item">
              <div className="status-dot ready"></div>
              <span>Preparing interface</span>
            </div>
          </div>

          {/* Footer */}
          <div className="loader-footer">
            <Typography variant="caption" className="footer-text">
              Powered by advanced trading algorithms
            </Typography>
          </div>
        </div>
      </div>
    </Fade>
  );
};

export default ImprovedLoadingSpinner;