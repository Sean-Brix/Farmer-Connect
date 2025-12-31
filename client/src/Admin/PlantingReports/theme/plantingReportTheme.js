/**
 * PlantingReport Theme Configuration
 * Custom Material-UI theme for responsive design
 */

import { createTheme } from '@mui/material/styles';

export const plantingReportTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Blue for Request state
      light: '#42a5f5',
      dark: '#1565c0'
    },
    secondary: {
      main: '#ed6c02', // Orange for Planted state
      light: '#ff9800',
      dark: '#e65100'
    },
    success: {
      main: '#2e7d32', // Green for Completed state
      light: '#4caf50',
      dark: '#1b5e20'
    },
    error: {
      main: '#d32f2f', // Red for Deleted state
      light: '#ef5350',
      dark: '#c62828'
    },
    warning: {
      main: '#ed6c02'
    },
    info: {
      main: '#1976d2'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontSize: '2rem',
      fontWeight: 600,
      '@media (min-width:600px)': {
        fontSize: '2.375rem'
      }
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 600,
      '@media (min-width:600px)': {
        fontSize: '1.75rem'
      }
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 600,
      '@media (min-width:600px)': {
        fontSize: '1.5rem'
      }
    },
    body1: {
      fontSize: '1rem'
    },
    body2: {
      fontSize: '0.875rem'
    },
    caption: {
      fontSize: '0.75rem'
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 768, // Tablet
      lg: 1024, // Desktop
      xl: 1280
    }
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
          minHeight: 44, // Touch-friendly
          '@media (max-width:767px)': {
            fontSize: '0.875rem'
          }
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true
      },
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            minHeight: 44 // Touch-friendly
          }
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '12px 16px',
          '@media (max-width:767px)': {
            padding: '8px 12px',
            fontSize: '0.875rem'
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          minHeight: 32
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          '@media (max-width:767px)': {
            margin: 16,
            width: 'calc(100% - 32px)',
            maxHeight: 'calc(100% - 32px)'
          }
        }
      }
    }
  }
});

export default plantingReportTheme;
