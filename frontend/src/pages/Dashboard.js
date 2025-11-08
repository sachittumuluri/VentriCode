import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Assessment,
  People,
  TrendingUp,
  MedicalServices,
  CloudUpload,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_analyses: 0,
    normal_cases: 0,
    abnormal_cases: 0,
    system_health: 'operational',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:8000/stats');
      setStats(response.data);
    } catch (err) {
      setError('Failed to fetch statistics');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{ height: '100%', boxShadow: 3 }}>
      <CardContent>
        <Box display="flex" alignItems="center">
          <Box sx={{ mr: 2, color }}>
            {icon}
          </Box>
          <Box>
            <Typography variant="h4" component="div" fontWeight="bold">
              {value}
            </Typography>
            <Typography variant="h6" color="textSecondary">
              {title}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {subtitle}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        VentriCode Dashboard
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Real-time ventricular tachycardia detection using topological data analysis
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Analyses"
            value={stats.total_analyses}
            icon={<Assessment />}
            color="primary.main"
            subtitle="ECG signals processed"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Normal Cases"
            value={stats.normal_cases}
            icon={<MedicalServices />}
            color="success.main"
            subtitle="Healthy heart rhythms"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Abnormal Cases"
            value={stats.abnormal_cases}
            icon={<TrendingUp />}
            color="warning.main"
            subtitle="Detected abnormalities"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="System Health"
            value={stats.system_health}
            icon={<People />}
            color="info.main"
            subtitle="All systems operational"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Recent Analyses
            </Typography>
            <Typography variant="body2" color="textSecondary">
              View and manage recent ECG analyses and their results.
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => navigate('/patients')}
            >
              View All Patients
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<CloudUpload />}
                onClick={() => navigate('/upload')}
                size="large"
              >
                Upload New ECG
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/patients')}
                size="large"
              >
                View Patient History
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            About VentriCode
          </Typography>
          <Typography variant="body2" paragraph>
            VentriCode uses advanced topological data analysis to detect ventricular tachycardia 
            from ECG signals. Our system analyzes the topological features of cardiac signals 
            to identify abnormal patterns that may indicate serious heart conditions.
          </Typography>
          <Typography variant="body2">
            <strong>Key Features:</strong> Real-time analysis, high accuracy, HIPAA compliant, 
            and designed for medical professionals.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;
