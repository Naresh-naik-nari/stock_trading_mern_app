import React from "react";
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent,
  Container 
} from "@material-ui/core";
import { 
  ErrorOutline, 
  Refresh, 
  Home 
} from "@material-ui/icons";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md" style={{ marginTop: '2rem' }}>
          <Card 
            style={{ 
              background: 'linear-gradient(135deg, #fff5f5, #ffebee)',
              border: '2px solid #f44336',
              borderRadius: '16px'
            }}
          >
            <CardContent style={{ padding: '3rem', textAlign: 'center' }}>
              <ErrorOutline 
                style={{ 
                  fontSize: '4rem', 
                  color: '#f44336', 
                  marginBottom: '1rem' 
                }} 
              />
              
              <Typography 
                variant="h4" 
                gutterBottom 
                style={{ 
                  color: '#f44336', 
                  fontWeight: 600,
                  marginBottom: '1rem'
                }}
              >
                Oops! Something went wrong
              </Typography>
              
              <Typography 
                variant="body1" 
                color="textSecondary" 
                style={{ 
                  marginBottom: '2rem',
                  lineHeight: 1.6,
                  fontSize: '1.1rem'
                }}
              >
                We encountered an unexpected error. This might be a temporary issue.
                <br />
                Please try refreshing the page or return to the homepage.
              </Typography>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <Box 
                  style={{
                    backgroundColor: '#f5f5f5',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '2rem',
                    textAlign: 'left',
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    maxHeight: '200px',
                    overflow: 'auto'
                  }}
                >
                  <Typography variant="subtitle2" style={{ marginBottom: '0.5rem', color: '#f44336' }}>
                    Error Details (Development Mode):
                  </Typography>
                  <div>{this.state.error.toString()}</div>
                  {this.state.errorInfo.componentStack && (
                    <div style={{ marginTop: '0.5rem', color: '#666' }}>
                      {this.state.errorInfo.componentStack}
                    </div>
                  )}
                </Box>
              )}

              <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Refresh />}
                  onClick={this.handleReload}
                  style={{
                    backgroundColor: '#f44336',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem'
                  }}
                >
                  Refresh Page
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<Home />}
                  onClick={this.handleGoHome}
                  style={{
                    borderColor: '#f44336',
                    color: '#f44336',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem'
                  }}
                >
                  Go Home
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;