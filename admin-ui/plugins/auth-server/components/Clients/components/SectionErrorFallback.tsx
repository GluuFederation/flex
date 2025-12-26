import React from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Typography, Button, Alert } from '@mui/material'
import { ErrorOutline, Refresh } from '@mui/icons-material'

interface SectionErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

const SectionErrorFallback: React.FC<SectionErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
        p: 3,
      }}
    >
      <ErrorOutline sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
      <Typography variant="h6" color="error" gutterBottom>
        {t('messages.section_error')}
      </Typography>
      <Alert severity="error" sx={{ mb: 2, maxWidth: 500 }}>
        {error.message}
      </Alert>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<Refresh />}
        onClick={resetErrorBoundary}
      >
        {t('actions.try_again')}
      </Button>
    </Box>
  )
}

export default SectionErrorFallback
