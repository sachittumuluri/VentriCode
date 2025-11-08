import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Results = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Analysis Results
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Patient analysis results will be displayed here.
          This will show topological features and medical interpretations.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Results;
