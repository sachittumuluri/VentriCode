import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Switch,
  FormControlLabel,
  Chip,
  Divider,
  Alert,
} from '@mui/material';
import {
  Timeline,
  Assessment,
  MedicalServices,
  Science,
  Visibility,
  PlayArrow,
  Pause,
  Refresh,
  Compare,
  Favorite,
  Speed,
  FavoriteBorder,
} from '@mui/icons-material';
import Plot from 'react-plotly.js';

const Patients = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedPatient, setSelectedPatient] = useState('patient_001');
  const [isPlaying, setIsPlaying] = useState(false);
  const [heartRate, setHeartRate] = useState(75);
  const [showVT, setShowVT] = useState(false);
  const [treatmentStage, setTreatmentStage] = useState('before');
  const [simulationSpeed, setSimulationSpeed] = useState(1);

  // Sample patient data
  const patients = [
    { id: 'patient_001', name: 'John Smith', age: 65, condition: 'VT History' },
    { id: 'patient_002', name: 'Sarah Johnson', age: 58, condition: 'Normal Sinus' },
    { id: 'patient_003', name: 'Michael Chen', age: 72, condition: 'Atrial Fibrillation' },
  ];

  // Generate 3D heart model data
  const generateHeartModel = () => {
    const theta = [];
    const phi = [];
    const r = [];
    
    for (let i = 0; i < 100; i++) {
      theta.push(i * 0.1);
      phi.push(i * 0.15);
      r.push(3 + Math.sin(i * 0.2) * 0.5);
    }
    
    const x = r.map((val, i) => val * Math.sin(phi[i]) * Math.cos(theta[i]));
    const y = r.map((val, i) => val * Math.sin(phi[i]) * Math.sin(theta[i]));
    const z = r.map((val, i) => val * Math.cos(phi[i]));
    
    return { x, y, z };
  };

  // Generate ECG signal data
  const generateECGSignal = (isVT = false) => {
    const time = [];
    const amplitude = [];
    
    for (let i = 0; i < 200; i++) {
      time.push(i * 10);
      if (isVT) {
        // VT pattern: rapid, irregular
        amplitude.push(Math.sin(i * 0.8) * 1.5 + Math.random() * 0.5);
      } else {
        // Normal pattern: regular P-QRS-T
        const cycle = i % 20;
        if (cycle < 3) amplitude.push(0.1); // P wave
        else if (cycle < 5) amplitude.push(0); // PR interval
        else if (cycle < 8) amplitude.push(1.2); // QRS complex
        else if (cycle < 12) amplitude.push(-0.3); // T wave
        else amplitude.push(0); // Baseline
      }
    }
    
    return { time, amplitude };
  };

  // Generate treatment comparison data
  const generateTreatmentData = () => {
    const beforeData = generateECGSignal(true);
    const afterData = generateECGSignal(false);
    
    return {
      before: beforeData,
      after: afterData,
    };
  };

  const heartData = generateHeartModel();
  const ecgData = generateECGSignal(showVT);
  const treatmentData = generateTreatmentData();

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Advanced Cardiac Visualization Center
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Interactive 3D heart modeling, arrhythmia simulation, and treatment comparison tools
      </Typography>

      {/* Patient Selection */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Select Patient</InputLabel>
              <Select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
              >
                {patients.map((patient) => (
                  <MenuItem key={patient.id} value={patient.id}>
                    {patient.name} ({patient.age}) - {patient.condition}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FavoriteBorder color="primary" />
              <Typography variant="body2">
                Heart Rate: <strong>{heartRate} bpm</strong>
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Chip 
              label={showVT ? "VT Mode" : "Normal Rhythm"} 
              color={showVT ? "warning" : "success"}
              icon={<Favorite />}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Main Visualization Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={handleTabChange}>
            <Tab label="3D Heart Model" icon={<Visibility />} />
            <Tab label="Arrhythmia Simulator" icon={<Timeline />} />
            <Tab label="Treatment Comparison" icon={<Compare />} />
          </Tabs>
        </Box>

        {/* Tab 1: 3D Heart Model */}
        <TabPanel value={currentTab} index={0}>
          <Typography variant="h6" gutterBottom>
            Interactive 3D Cardiac Anatomy
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Explore the heart's structure in three dimensions. Rotate, zoom, and examine cardiac anatomy.
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card variant="outlined">
                <CardContent>
                  <Plot
                    data={[
                      {
                        type: 'scatter3d',
                        mode: 'markers',
                        x: heartData.x,
                        y: heartData.y,
                        z: heartData.z,
                        marker: {
                          size: 5,
                          color: heartData.z,
                          colorscale: 'Reds',
                          showscale: true,
                          colorbar: { title: 'Depth' }
                        },
                        name: 'Heart Tissue'
                      }
                    ]}
                    layout={{
                      title: '3D Heart Model - Interactive Visualization',
                      scene: {
                        xaxis: { title: 'X (mm)' },
                        yaxis: { title: 'Y (mm)' },
                        zaxis: { title: 'Z (mm)' },
                        camera: {
                          eye: { x: 1.5, y: 1.5, z: 1.5 }
                        }
                      },
                      height: 500,
                      margin: { l: 0, r: 0, t: 40, b: 0 }
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    Anatomy Controls
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={showVT}
                          onChange={(e) => setShowVT(e.target.checked)}
                        />
                      }
                      label="Show VT Affected Regions"
                    />
                    
                    <Box>
                      <Typography variant="body2" gutterBottom>
                        Heart Rate: {heartRate} bpm
                      </Typography>
                      <Slider
                        value={heartRate}
                        onChange={(e, val) => setHeartRate(val)}
                        min={40}
                        max={200}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                    
                    <Button
                      variant="contained"
                      startIcon={<Refresh />}
                      onClick={() => {
                        setHeartRate(75);
                        setShowVT(false);
                      }}
                    >
                      Reset View
                    </Button>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Anatomical Information
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Chambers:</strong> 4 (2 atria, 2 ventricles)<br />
                    <strong>Valves:</strong> 4 (mitral, aortic, tricuspid, pulmonary)<br />
                    <strong>VT Origin:</strong> {showVT ? "Right Ventricle" : "N/A"}<br />
                    <strong>Conduction:</strong> Normal sinus rhythm
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 2: Arrhythmia Simulator */}
        <TabPanel value={currentTab} index={1}>
          <Typography variant="h6" gutterBottom>
            Arrhythmia Simulation & Teaching Tool
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Visualize different cardiac arrhythmias and their ECG patterns in real-time.
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle2">
                      Live ECG Simulation
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        startIcon={isPlaying ? <Pause /> : <PlayArrow />}
                        onClick={() => setIsPlaying(!isPlaying)}
                        size="small"
                      >
                        {isPlaying ? 'Pause' : 'Play'}
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={() => {
                          setIsPlaying(false);
                          setHeartRate(75);
                          setShowVT(false);
                        }}
                        size="small"
                      >
                        Reset
                      </Button>
                    </Box>
                  </Box>
                  
                  <Plot
                    data={[
                      {
                        x: ecgData.time,
                        y: ecgData.amplitude,
                        type: 'scatter',
                        mode: 'lines',
                        name: 'ECG Signal',
                        line: { 
                          color: showVT ? '#ff6b6b' : '#51cf66',
                          width: 2
                        }
                      }
                    ]}
                    layout={{
                      title: showVT ? 'Ventricular Tachycardia Pattern' : 'Normal Sinus Rhythm',
                      xaxis: { title: 'Time (ms)' },
                      yaxis: { title: 'Amplitude (mV)' },
                      height: 400,
                      plot_bgcolor: '#f8f9fa',
                      paper_bgcolor: '#ffffff',
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    Simulation Controls
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={showVT}
                          onChange={(e) => setShowVT(e.target.checked)}
                        />
                      }
                      label="Ventricular Tachycardia"
                    />
                    
                    <Box>
                      <Typography variant="body2" gutterBottom>
                        Heart Rate: {heartRate} bpm
                      </Typography>
                      <Slider
                        value={heartRate}
                        onChange={(e, val) => setHeartRate(val)}
                        min={40}
                        max={200}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" gutterBottom>
                        Speed: {simulationSpeed}x
                      </Typography>
                      <Slider
                        value={simulationSpeed}
                        onChange={(e, val) => setSimulationSpeed(val)}
                        min={0.5}
                        max={3}
                        step={0.5}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Arrhythmia Information
                  </Typography>
                  <Alert severity={showVT ? "warning" : "success"} sx={{ mb: 2 }}>
                    <strong>{showVT ? "VT Detected" : "Normal Rhythm"}</strong>
                  </Alert>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Rate:</strong> {heartRate} bpm<br />
                    <strong>Rhythm:</strong> {showVT ? "Regular but rapid" : "Regular"}<br />
                    <strong>QRS Width:</strong> {showVT ? "Wide (>120ms)" : "Normal (<100ms)"}<br />
                    <strong>Clinical Significance:</strong> {showVT ? "Life-threatening" : "Normal"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 3: Treatment Comparison */}
        <TabPanel value={currentTab} index={2}>
          <Typography variant="h6" gutterBottom>
            Treatment Comparison: Before & After Therapy
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Compare ECG patterns before and after treatment to visualize therapeutic effectiveness.
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="subtitle2">
                      Treatment Progress Analysis
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip 
                        label="Before Treatment" 
                        color={treatmentStage === 'before' ? 'primary' : 'default'}
                        onClick={() => setTreatmentStage('before')}
                      />
                      <Chip 
                        label="After Treatment" 
                        color={treatmentStage === 'after' ? 'success' : 'default'}
                        onClick={() => setTreatmentStage('after')}
                      />
                      <Chip 
                        label="Side-by-Side" 
                        color={treatmentStage === 'comparison' ? 'info' : 'default'}
                        onClick={() => setTreatmentStage('comparison')}
                      />
                    </Box>
                  </Box>
                  
                  {treatmentStage === 'comparison' ? (
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" align="center" color="error">
                          Before Treatment (VT)
                        </Typography>
                        <Plot
                          data={[
                            {
                              x: treatmentData.before.time,
                              y: treatmentData.before.amplitude,
                              type: 'scatter',
                              mode: 'lines',
                              name: 'VT Pattern',
                              line: { color: '#ff6b6b', width: 2 }
                            }
                          ]}
                          layout={{
                            title: 'Pre-Treatment ECG',
                            xaxis: { title: 'Time (ms)' },
                            yaxis: { title: 'Amplitude (mV)' },
                            height: 300,
                            plot_bgcolor: '#f8f9fa',
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" align="center" color="success.main">
                          After Treatment (Normal)
                        </Typography>
                        <Plot
                          data={[
                            {
                              x: treatmentData.after.time,
                              y: treatmentData.after.amplitude,
                              type: 'scatter',
                              mode: 'lines',
                              name: 'Normal Rhythm',
                              line: { color: '#51cf66', width: 2 }
                            }
                          ]}
                          layout={{
                            title: 'Post-Treatment ECG',
                            xaxis: { title: 'Time (ms)' },
                            yaxis: { title: 'Amplitude (mV)' },
                            height: 300,
                            plot_bgcolor: '#f8f9fa',
                          }}
                        />
                      </Grid>
                    </Grid>
                  ) : (
                    <Plot
                      data={[
                        {
                          x: treatmentStage === 'before' ? treatmentData.before.time : treatmentData.after.time,
                          y: treatmentStage === 'before' ? treatmentData.before.amplitude : treatmentData.after.amplitude,
                          type: 'scatter',
                          mode: 'lines',
                          name: treatmentStage === 'before' ? 'VT Pattern' : 'Normal Rhythm',
                          line: { 
                            color: treatmentStage === 'before' ? '#ff6b6b' : '#51cf66',
                            width: 2
                          }
                        }
                      ]}
                      layout={{
                        title: treatmentStage === 'before' ? 'Pre-Treatment ECG (VT)' : 'Post-Treatment ECG (Normal)',
                        xaxis: { title: 'Time (ms)' },
                        yaxis: { title: 'Amplitude (mV)' },
                        height: 400,
                        plot_bgcolor: '#f8f9fa',
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    Treatment Metrics
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Heart Rate Reduction
                      </Typography>
                      <Typography variant="h6" color="success.main">
                        -45 bpm
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Rhythm Regularity
                      </Typography>
                      <Typography variant="h6" color="success.main">
                        +85%
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        QRS Normalization
                      </Typography>
                      <Typography variant="h6" color="success.main">
                        +92%
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Symptom Improvement
                      </Typography>
                      <Typography variant="h6" color="success.main">
                        +78%
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    Treatment Details
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Therapy:</strong> Radiofrequency Ablation<br />
                    <strong>Date:</strong> {new Date().toLocaleDateString()}<br />
                    <strong>Duration:</strong> 3.2 hours<br />
                    <strong>Success Rate:</strong> 94%<br />
                    <strong>Complications:</strong> None<br />
                    <strong>Follow-up:</strong> 3 months
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Clinical Notes
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Patient responded well to RF ablation therapy. VT episodes eliminated successfully. 
                    Continued monitoring shows stable sinus rhythm. Medication reduced to maintenance dose.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* Educational Content */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Educational Resources
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Science color="primary" sx={{ mb: 1 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Understanding VT
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Learn about ventricular tachycardia mechanisms, causes, and clinical significance in cardiac health.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <MedicalServices color="success" sx={{ mb: 1 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Treatment Options
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Explore various treatment modalities including medications, ablation, and device therapy.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Assessment color="warning" sx={{ mb: 1 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Diagnostic Tools
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Understand ECG interpretation, electrophysiology studies, and advanced monitoring techniques.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Patients;
