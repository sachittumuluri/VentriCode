import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
} from '@mui/material';
import { CloudUpload, Assessment, MedicalServices } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const Upload = () => {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      setError(null);
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles: 1,
  });

  const analyzeECG = async () => {
    if (!uploadedFile) return;

    setUploading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', uploadedFile);

    try {
      const response = await axios.post('http://localhost:8000/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setResult(null);
    setError(null);
  };

  const ResultCard = ({ data }) => (
    <Card sx={{ mt: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
          Analysis Results
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Patient ID
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {data.patient_id}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Classification
            </Typography>
            <Chip 
              label={data.classification} 
              color={data.classification === 'Normal' ? 'success' : 'warning'}
              sx={{ fontWeight: 'bold' }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Risk Score
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {data.risk_score.toFixed(4)}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Data Points Analyzed
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {data.data_points}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        
        <Typography variant="h6" gutterBottom>
          Topological Features
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Assessment sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body2">
                <strong>H0 Features:</strong> {data.features.h0_num_features}
              </Typography>
            </Box>
            <Typography variant="body2" color="textSecondary" sx={{ ml: 3 }}>
              Avg Persistence: {data.features.h0_persistence.toFixed(4)}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <MedicalServices sx={{ mr: 1, color: 'secondary.main' }} />
              <Typography variant="body2">
                <strong>H1 Features:</strong> {data.features.h1_num_features}
              </Typography>
            </Box>
            <Typography variant="body2" color="textSecondary" sx={{ ml: 3 }}>
              Avg Persistence: {data.features.h1_persistence.toFixed(4)}
            </Typography>
          </Grid>
        </Grid>

        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          <strong>Medical Interpretation:</strong> {data.classification === 'Normal' 
            ? 'The ECG signal shows normal topological patterns consistent with healthy cardiac rhythm.' 
            : 'The ECG signal exhibits abnormal topological features that may indicate ventricular tachycardia. Further medical evaluation recommended.'}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Upload ECG for Topological Analysis
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Upload your ECG data (Excel format) to analyze ventricular tachycardia patterns using algebraic topology
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed',
            borderColor: isDragActive ? 'primary.main' : 'grey.300',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: isDragActive ? 'primary.50' : 'grey.50',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'primary.100',
              borderColor: 'primary.main',
            },
          }}
        >
          <input {...getInputProps()} />
          <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {isDragActive ? 'Drop ECG file here' : 'Drag & Drop ECG file here'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            or click to browse files
          </Typography>
          <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
            Supported formats: .xlsx, .xls (Excel files with ECG column)
          </Typography>
        </Box>

        {uploadedFile && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="textSecondary">
              Selected file: <strong>{uploadedFile.name}</strong> ({(uploadedFile.size / 1024).toFixed(1)} KB)
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Assessment />}
                onClick={analyzeECG}
                disabled={uploading}
                size="large"
              >
                {uploading ? 'Analyzing...' : 'Analyze ECG'}
              </Button>
              <Button
                variant="outlined"
                onClick={resetUpload}
                disabled={uploading}
              >
                Clear
              </Button>
            </Box>
          </Box>
        )}

        {uploading && (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <CircularProgress />
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Performing topological data analysis...
            </Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>

      {result && <ResultCard data={result} />}

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          About the Analysis
        </Typography>
        <Typography variant="body2" paragraph>
          Our system uses <strong>Topological Data Analysis (TDA)</strong> to detect ventricular tachycardia patterns in ECG signals.
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>Key Features Analyzed:</strong>
        </Typography>
        <ul>
          <li><strong>H0 Persistence:</strong> Connected components - measures signal complexity</li>
          <li><strong>H1 Persistence:</strong> Loops - measures periodic structure</li>
          <li><strong>Betti Numbers:</strong> Topological invariants for pattern recognition</li>
        </ul>
        <Typography variant="body2" color="textSecondary">
          The algorithm applies Takens embedding to convert time series into point clouds, then computes Vietoris-Rips persistence to identify abnormal cardiac patterns.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Upload;
