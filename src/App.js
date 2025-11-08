import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Results from './pages/Results';
import Patients from './pages/Patients';

// Medical theme for VentriCode
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Medical Blue
    },
    secondary: {
      main: '#dc004e', // Alert Red
    },
    success: {
      main: '#2e7d32', // Healthy Green
    },
    warning: {
      main: '#ed6c02', // Attention Orange
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Inter, Roboto, sans-serif',
    h4: {
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 500,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/results/:patientId" element={<Results />} />
              <Route path="/patients" element={<Patients />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
