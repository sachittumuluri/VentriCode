import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Upload = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Upload ECG for Analysis
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          ECG file upload component will be implemented here.
          This will connect to the backend API for topological analysis.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Upload;
