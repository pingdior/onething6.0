import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true, error: null, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // 可以在这里记录错误到错误跟踪服务
    console.error("Uncaught error:", error, errorInfo);
  }
  
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            bgcolor: '#f5f5f5',
            p: 2
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              maxWidth: 600,
              width: '100%',
              borderRadius: 2
            }}
          >
            <Typography variant="h5" color="error" gutterBottom>
              出错了
            </Typography>
            
            <Typography variant="body1" paragraph>
              应用程序遇到了意外错误，请尝试刷新页面。
            </Typography>
            
            {this.state.error && (
              <Box
                sx={{
                  bgcolor: '#f8f8f8',
                  p: 2,
                  borderRadius: 1,
                  overflow: 'auto',
                  maxHeight: 200,
                  mb: 3,
                  fontFamily: 'monospace',
                  fontSize: '0.85rem'
                }}
              >
                <Typography variant="body2" color="error">
                  {this.state.error.toString()}
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 1 }}>
                  {this.state.errorInfo?.componentStack}
                </Typography>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => window.location.reload()}
              >
                刷新页面
              </Button>
              <Button 
                variant="outlined"
                onClick={this.handleReset}
              >
                尝试恢复
              </Button>
            </Box>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 