import React from 'react'
import { Container, Box, Fade } from '@mui/material'
import { Header } from './Header'
import { FlashMessages } from '../common/FlashMessages'

export function Layout({ children }) {
  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(6, 214, 160, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(240, 147, 251, 0.1) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
          zIndex: 0,
        }
      }}
    >
      <FlashMessages />
      <Header />
      <Box
        component="main"
        sx={{
          position: 'relative',
          zIndex: 1,
          minHeight: 'calc(100vh - 64px)',
          paddingTop: 3,
          paddingBottom: 6,
        }}
      >
        <Container 
          maxWidth="xl" 
          sx={{ 
            px: { xs: 2, sm: 3 },
            animation: 'fadeIn 0.6s ease-out',
          }}
        >
          <Fade in={true} timeout={800}>
            <Box sx={{ pt: '90px' }}>
              {children}
            </Box>
          </Fade>
        </Container>
      </Box>
      
      {/* Floating background elements */}
      <Box
        sx={{
          position: 'fixed',
          top: '10%',
          left: '5%',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
          animation: 'pulse 4s ease-in-out infinite',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'fixed',
          top: '60%',
          right: '8%',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(6, 214, 160, 0.1), rgba(5, 150, 105, 0.1))',
          animation: 'pulse 6s ease-in-out infinite',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'fixed',
          bottom: '20%',
          left: '15%',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.1), rgba(232, 121, 249, 0.1))',
          animation: 'pulse 5s ease-in-out infinite',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
    </Box>
  )
}
