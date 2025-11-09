const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const app = express();
const port = 8000;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI('API CODE NEEDED');
const geminiModel = genAI.getGenerativeModel({ model: 'gemini-pro' });

app.use(cors());
app.use(express.json());

// Enhanced statistics endpoint with Gemini insights
app.get('/stats', async (req, res) => {
  try {
    const baseStats = {
      total_analyses: 156,
      normal_cases: 98,
      abnormal_cases: 58,
      system_health: 'operational',
      avg_risk_score: 3.2,
      critical_cases: 12,
      accuracy_rate: 94
    };

    // Use Gemini to provide insights on the statistics
    const geminiPrompt = `
      As a medical data analyst, review these cardiac diagnostic statistics and provide key insights:
      
      Total Analyses: ${baseStats.total_analyses}
      Normal Cases: ${baseStats.normal_cases}
      Abnormal Cases: ${baseStats.abnormal_cases}
      Accuracy Rate: ${baseStats.accuracy_rate}%
      Critical Cases: ${baseStats.critical_cases}
      
      Provide brief insights on:
      1. System performance trends
      2. Risk distribution patterns  
      3. Recommendations for improvement
      
      Keep response under 200 characters for dashboard display.
    `;

    try {
      const geminiResult = await geminiModel.generateContent(geminiPrompt);
      baseStats.ai_insights = geminiResult.response.text().substring(0, 200);
    } catch (error) {
      baseStats.ai_insights = 'System performing within normal parameters';
    }

    res.json(baseStats);
  } catch (error) {
    console.error('Stats error:', error);
    res.json({
      total_analyses: 156,
      normal_cases: 98,
      abnormal_cases: 58,
      system_health: 'operational',
      avg_risk_score: 3.2,
      critical_cases: 12,
      accuracy_rate: 94,
      ai_insights: 'System performing within normal parameters'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Enhanced ECG analysis endpoint using Gemini AI
app.post('/analyze', async (req, res) => {
  try {
    // Generate topological analysis data
    const analysisData = {
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
    };

    // Use Gemini to enhance the analysis
    const geminiPrompt = `
      As a cardiologist expert in topological data analysis, review this ECG analysis and provide enhanced insights:
      
      Patient ID: ${analysisData.patient_id}
      Classification: ${analysisData.classification}
      Risk Score: ${analysisData.risk_score.toFixed(3)}
      H0 Persistence: ${analysisData.features.h0_persistence.toFixed(4)}
      H1 Persistence: ${analysisData.features.h1_persistence.toFixed(4)}
      
      Provide:
      1. Enhanced risk assessment (0-100%)
      2. Clinical confidence level
      3. Key topological indicators
      4. Recommended follow-up timing
      5. Specific concerns to monitor
      
      Return as JSON with keys: enhancedRisk, clinicalConfidence, keyIndicators, followUp, concerns
    `;

    try {
      const geminiResult = await geminiModel.generateContent(geminiPrompt);
      const geminiInsights = geminiResult.response.text();
      
      // Parse Gemini insights (in production, would use structured JSON response)
      analysisData.geminiInsights = geminiInsights;
      analysisData.enhancedByAI = true;
    } catch (geminiError) {
      console.log('Gemini unavailable, using standard analysis');
      analysisData.geminiInsights = 'AI enhancement temporarily unavailable';
      analysisData.enhancedByAI = false;
    }

    setTimeout(() => {
      res.json(analysisData);
    }, 2000); // Simulate processing time
    
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

// Gemini AI medical report generation
app.post('/ai-medical-report', async (req, res) => {
  try {
    const { analysisData } = req.body;
    
    const prompt = `
      As a cardiologist, analyze this ECG topological data for ventricular tachycardia detection:
      
      Topological Features:
      - H0 Persistence: ${analysisData.features?.h0_persistence?.toFixed(4)}
      - H1 Persistence: ${analysisData.features?.h1_persistence?.toFixed(4)}
      - Risk Score: ${analysisData.risk_score?.toFixed(3)}
      - Classification: ${analysisData.classification}
      
      Provide a detailed clinical interpretation including risk assessment and recommendations.
    `;
    
    const result = await geminiModel.generateContent(prompt);
    const medicalReport = result.response.text();
    
    res.json({
      success: true,
      medicalReport: medicalReport,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.json({
      success: false,
      medicalReport: 'AI analysis temporarily unavailable. Please consult with cardiologist directly.',
      error: error.message
    });
  }
});

// Gemini AI medical consultation
app.post('/ai-medical-consultation', async (req, res) => {
  try {
    const { question, patientData } = req.body;
    
    const prompt = `
      As a cardiologist, answer this medical question about ECG results:
      
      Patient Question: "${question}"
      
      Patient Data:
      - Classification: ${patientData.classification}
      - Risk Score: ${patientData.risk_score?.toFixed(3)}
      - H0 Persistence: ${patientData.features?.h0_persistence?.toFixed(4)}
      - H1 Persistence: ${patientData.features?.h1_persistence?.toFixed(4)}
      
      Provide a clear, professional medical answer that a patient can understand.
      Include when they should seek immediate medical attention.
      Do not provide definitive diagnoses - recommend consulting with healthcare provider.
    `;
    
    const result = await geminiModel.generateContent(prompt);
    const answer = result.response.text();
    
    res.json({
      success: true,
      answer: answer,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Gemini Consultation Error:', error);
    res.json({
      success: false,
      answer: 'I apologize, but I cannot provide medical advice at this time. Please consult with your healthcare provider.',
      error: error.message
    });
  }
});

// Snowflake data storage endpoint
app.post('/store-analysis', (req, res) => {
  try {
    const { patientData, analysisResults } = req.body;
    
    console.log('Storing analysis in Snowflake:', {
      patientId: patientData.patient_id,
      classification: analysisResults.classification,
      timestamp: new Date().toISOString()
    });
    
    // Mock Snowflake storage
    res.json({
      success: true,
      message: 'Analysis stored successfully in Snowflake',
      recordId: 'SF_' + Date.now()
    });
  } catch (error) {
    console.error('Snowflake storage error:', error);
    res.json({
      success: false,
      error: error.message
    });
  }
});

// Enhanced cross-patient analytics with Gemini insights
app.get('/cross-patient-analytics', async (req, res) => {
  try {
    const baseAnalytics = {
      totalPatients: 1250,
      avgRiskScore: 12.3,
      highRiskPatients: 187,
      topologicalPatterns: {
        h0PersistenceAvg: 0.1834,
        h1PersistenceAvg: 0.0921,
        correlationWithVT: 0.847
      },
      demographicInsights: {
        ageGroups: {
          '45-60': { count: 450, avgRisk: 8.2 },
          '61-75': { count: 520, avgRisk: 14.7 },
          '75+': { count: 280, avgRisk: 18.9 }
        }
      }
    };

    // Use Gemini to provide medical insights on the analytics
    const geminiPrompt = `
      As a cardiac epidemiologist, analyze this population health data and provide key clinical insights:
      
      Total Patients: ${baseAnalytics.totalPatients}
      High Risk Patients: ${baseAnalytics.highRiskPatients}
      Average Risk Score: ${baseAnalytics.avgRiskScore}
      VT Correlation: ${(baseAnalytics.topologicalPatterns.correlationWithVT * 100).toFixed(1)}%
      
      Age Group Risk Trends:
      - 45-60: ${baseAnalytics.demographicInsights.ageGroups['45-60'].avgRisk}
      - 61-75: ${baseAnalytics.demographicInsights.ageGroups['61-75'].avgRisk}
      - 75+: ${baseAnalytics.demographicInsights.ageGroups['75+'].avgRisk}
      
      Provide 2-3 bullet points of key clinical insights for medical researchers.
    `;

    try {
      const geminiResult = await geminiModel.generateContent(geminiPrompt);
      baseAnalytics.clinicalInsights = geminiResult.response.text();
    } catch (error) {
      baseAnalytics.clinicalInsights = '• Risk increases with age\n• Strong correlation between H1 persistence and VT\n• Early detection critical for high-risk groups';
    }

    res.json(baseAnalytics);
  } catch (error) {
    console.error('Analytics error:', error);
    res.json({ error: error.message });
  }
});

// Vultr cloud metrics endpoint
app.get('/cloud-metrics', (req, res) => {
  try {
    const metrics = {
      cpu: { frontend: 45, backend: 78, database: 32 },
      memory: { frontend: 60, backend: 85, database: 55 },
      gpu: { utilization: 92, memoryUsed: '3.2GB', temperature: '72°C' },
      network: { bandwidthIn: '125 MB/s', bandwidthOut: '89 MB/s', requestsPerSecond: 34 },
      uptime: { frontend: '99.98%', backend: '99.95%', database: '99.99%' }
    };
    
    res.json(metrics);
  } catch (error) {
    console.error('Cloud metrics error:', error);
    res.json({ error: error.message });
  }
});

// Deployment status endpoint
app.get('/deployment-status', (req, res) => {
  try {
    const status = {
      deployed: true,
      url: 'https://ventricode.tech',
      environment: 'production',
      lastDeployed: '2024-11-09T02:30:00Z',
      version: '1.2.0',
      healthChecks: {
        frontend: 'healthy',
        backend: 'healthy',
        database: 'healthy',
        sslCertificate: 'valid'
      }
    };
    
    res.json(status);
  } catch (error) {
    console.error('Deployment status error:', error);
    res.json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Mock server running at http://localhost:${port}`);
});
