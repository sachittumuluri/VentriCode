import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Patients = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Patient Management
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Patient history and management interface will be implemented here.
          This will show all analyzed patients and their medical records.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Patients;
