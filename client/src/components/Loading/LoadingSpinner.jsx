import React from 'react';
import { CircularProgress, Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import styles from './LoadingSpinner.module.css';


const LoadingSpinner = ({ 
  text = 'Loading...', 
  size = 40, 
  fullScreen = false,
  color = 'primary' 
}) => {
  const content = (
    <Box className={styles.loadingContainer}>
      <CircularProgress 
        size={size} 
        className={styles.spinner}
        color={color}
        thickness={4}
      />
      {text && (
        <Typography variant="body1" className={styles.loadingText}>
          {text}
        </Typography>
      )}
    </Box>
  );

  if (fullScreen) {
    return (
      <div className={styles.fullScreen}>
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
