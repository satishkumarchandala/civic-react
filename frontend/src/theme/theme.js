import { createTheme } from '@mui/material/styles';

// Enhanced theme configuration with modern design
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#667eea', // Modern gradient blue
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#06d6a0', // Modern teal
      light: '#34d399',
      dark: '#059669',
      contrastText: '#ffffff',
    },
    tertiary: {
      main: '#f093fb', // Purple gradient
      light: '#f8b4ff',
      dark: '#e879f9',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    info: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
      elevation1: '#ffffff',
      elevation2: '#f9fafb',
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
      disabled: '#9ca3af',
    },
    grey: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '3rem',
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.25rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.875rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#374151',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: '#6b7280',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      fontSize: '0.875rem',
      letterSpacing: '0.025em',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
      color: '#9ca3af',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
        },
        html: {
          scrollBehavior: 'smooth',
        },
        body: {
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          minHeight: '100vh',
        },
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        '@keyframes slideIn': {
          from: { opacity: 0, transform: 'translateX(-20px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
        '@keyframes pulse': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          background: 'rgba(255, 255, 255, 0.95)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '10px 24px',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            transition: 'left 0.5s',
          },
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
            '&::before': {
              left: '100%',
            },
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
          },
        },
        outlined: {
          border: '2px solid',
          '&:hover': {
            borderWidth: '2px',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            '& fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.1)',
              borderWidth: '2px',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(102, 126, 234, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#667eea',
              borderWidth: '2px',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(102, 126, 234, 0.15)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          fontWeight: 600,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          },
        },
        colorPrimary: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        },
        colorSecondary: {
          background: 'linear-gradient(135deg, #06d6a0 0%, #059669 100%)',
          color: 'white',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        elevation1: {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          background: 'rgba(255, 255, 255, 0.95)',
        },
        elevation2: {
          boxShadow: '0 6px 25px rgba(0, 0, 0, 0.1)',
          background: 'rgba(255, 255, 255, 0.98)',
        },
        elevation3: {
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
          background: 'rgba(255, 255, 255, 1)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'scale(1.1)',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: '2px solid rgba(255, 255, 255, 0.3)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '16px',
          paddingRight: '16px',
          '@media (min-width: 600px)': {
            paddingLeft: '24px',
            paddingRight: '24px',
          },
        },
      },
    },
  },
  spacing: 8, // Default spacing unit
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
});

export default theme;