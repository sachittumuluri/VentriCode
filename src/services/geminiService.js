import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('API CODE NEEDED');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export const generateMedicalReport = async (topologicalData) => {
  try {
    const prompt = `
      As a cardiologist, analyze this ECG topological data for ventricular tachycardia detection:
      
      Topological Features:
      - H0 Persistence: ${topologicalData.features.h0_persistence.toFixed(4)}
      - H1 Persistence: ${topologicalData.features.h1_persistence.toFixed(4)}
      - H0 Features Count: ${topologicalData.features.h0_num_features}
      - H1 Features Count: ${topologicalData.features.h1_num_features}
      - Risk Score: ${topologicalData.risk_score.toFixed(3)}
      - Classification: ${topologicalData.classification}
      - Data Points: ${topologicalData.data_points}
      
      Provide a detailed clinical interpretation including:
      1. Risk assessment for ventricular tachycardia
      2. Explanation of topological findings in medical terms
      3. Recommended follow-up actions
      4. Confidence level in diagnosis
      5. Key clinical indicators identified
      
      Format as a professional medical report for cardiologists.
    `;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    return 'AI analysis temporarily unavailable. Please consult with cardiologist directly.';
  }
};

export const analyzeECGWithAI = async (ecgData, patientHistory = '') => {
  try {
    const prompt = `
      As an expert cardiologist, analyze this comprehensive ECG assessment:
      
      ECG Analysis Results:
      ${JSON.stringify(ecgData, null, 2)}
      
      Patient History: ${patientHistory || 'No previous history available'}
      
      Provide:
      1. VT risk probability (0-100%)
      2. Key risk factors identified
      3. Recommended follow-up actions
      4. Confidence level in diagnosis
      5. When to seek immediate medical attention
      6. Lifestyle recommendations based on risk level
      
      Be thorough but concise. Focus on actionable medical insights.
    `;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini AI Analysis Error:', error);
    return 'AI analysis temporarily unavailable.';
  }
};

export const getMedicalConsultation = async (question, patientData) => {
  try {
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
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Medical Consultation Error:', error);
    return 'I apologize, but I cannot provide medical advice at this time. Please consult with your healthcare provider.';
  }
};
