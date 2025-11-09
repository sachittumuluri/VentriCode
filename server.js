const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

// Mock statistics endpoint
app.get('/stats', (req, res) => {
  res.json({
    total_analyses: 156,
    normal_cases: 98,
    abnormal_cases: 58,
    system_health: 'operational',
    avg_risk_score: 3.2,
    critical_cases: 12,
    accuracy_rate: 94
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Mock ECG analysis endpoint
app.post('/analyze', (req, res) => {
  // Simulate processing delay
  setTimeout(() => {
    res.json({
      patient_id: 'PT' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
      classification: Math.random() > 0.5 ? 'Normal' : 'Ventricular Tachycardia',
      risk_score: Math.random() * 30 + 5,
      data_points: 2500,
      features: {
        h0_num_features: Math.floor(Math.random() * 10) + 5,
        h0_persistence: Math.random() * 0.3 + 0.1,
        h1_num_features: Math.floor(Math.random() * 5),
        h1_persistence: Math.random() * 0.2 + 0.05
      },
      confidence: (Math.random() * 0.2 + 0.8).toFixed(3),
      processing_time: (Math.random() * 2 + 1).toFixed(2) + 's'
    });
  }, 2000); // 2 second delay to simulate processing
});

app.listen(port, () => {
  console.log(`Mock server running at http://localhost:${port}`);
});
