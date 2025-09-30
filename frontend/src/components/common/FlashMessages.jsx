import React from 'react'
import { Alert, Snackbar, Stack, Slide } from '@mui/material'
import { useApp } from '../../context/AppContext'

export function FlashMessages() {
  const { flashMessages } = useApp()

  if (!flashMessages.length) return null

  return (
    <Stack 
      spacing={1} 
      sx={{ 
        position: 'fixed', 
        top: 16, 
        right: 16, 
        zIndex: 9999,
        maxWidth: '400px' 
      }}
    >
      {flashMessages.map((msg, index) => (
        <Slide 
          key={msg.id} 
          direction="left" 
          in={true}
          timeout={300 + index * 100}
        >
          <Alert 
            severity={msg.type === 'error' ? 'error' : msg.type === 'success' ? 'success' : 'info'}
            variant="filled"
            sx={{ 
              boxShadow: 3,
              '& .MuiAlert-message': {
                fontSize: '0.875rem'
              }
            }}
          >
            {msg.message}
          </Alert>
        </Slide>
      ))}
    </Stack>
  )
}
