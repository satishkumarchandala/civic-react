import React from 'react'
import { CircularProgress, Box, Typography, keyframes } from '@mui/material'

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`

export function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: 3,
        p: 4,
        minHeight: '200px',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        border: '1px solid rgba(255, 255, 255, 0.2)',
        animation: `${pulse} 2s ease-in-out infinite`,
      }}
    >
      <CircularProgress 
        size={50} 
        sx={{
          color: 'primary.main',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          }
        }}
      />
      <Typography 
        variant="body1" 
        color="text.secondary"
        sx={{
          fontWeight: 500,
          textAlign: 'center',
        }}
      >
        {message}
      </Typography>
    </Box>
  )
}
