#!/usr/bin/env python3
"""
VentriCode API Server
REST API for ECG topological analysis
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import numpy as np
import io
from typing import Dict, List, Optional
import uuid
from datetime import datetime

from ecg_core_analysis import ECGTopologicalAnalyzer

app = FastAPI(
    title="VentriCode API",
    description="Ventricular Tachycardia Detection using Topological Data Analysis",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global analyzer instance
analyzer = ECGTopologicalAnalyzer()

# In-memory storage (replace with database in production)
patient_results: Dict[str, Dict] = {}

@app.get("/")
async def root():
    """Welcome endpoint"""
    return {
        "message": "VentriCode API",
        "description": "Ventricular Tachycardia Detection System",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "VentriCode API"
    }

@app.post("/analyze")
async def analyze_ecg(file: UploadFile = File(...)):
    """
    Upload and analyze ECG data
    
    Args:
        file: Excel file containing ECG data
        
    Returns:
        Analysis results with topological features
    """
    try:
        # Validate file type
        if not file.filename.endswith(('.xlsx', '.xls')):
            raise HTTPException(status_code=400, detail="File must be Excel format (.xlsx or .xls)")
        
        # Read file contents
        contents = await file.read()
        
        # Create temporary file-like object
        file_obj = io.BytesIO(contents)
        
        # Load ECG data
        df = pd.read_excel(file_obj)
        
        # Validate ECG column exists
        if 'ECG' not in df.columns:
            raise HTTPException(status_code=400, detail="Excel file must contain 'ECG' column")
        
        # Extract ECG data
        ecg_data = df['ECG'].values
        
        # Perform topological analysis
        embedded_data = analyzer.embed_time_series(ecg_data)
        persistence_diagrams = analyzer.compute_topological_features(embedded_data)
        features = analyzer.extract_features(persistence_diagrams)
        
        # Generate patient ID
        patient_id = str(uuid.uuid4())[:8]
        
        # Classify based on features (simple threshold-based classification)
        risk_score = features['h0_persistence'] * features['h0_num_features']
        classification = "Normal" if risk_score < 20 else "Potential Abnormality"
        
        # Store results
        result = {
            "patient_id": patient_id,
            "filename": file.filename,
            "timestamp": datetime.now().isoformat(),
            "features": features,
            "risk_score": float(risk_score),
            "classification": classification,
            "data_points": len(ecg_data),
            "embedded_shape": embedded_data.shape
        }
        
        patient_results[patient_id] = result
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.get("/results/{patient_id}")
async def get_results(patient_id: str):
    """
    Get analysis results for a specific patient
    
    Args:
        patient_id: Unique patient identifier
        
    Returns:
        Patient analysis results
    """
    if patient_id not in patient_results:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    return patient_results[patient_id]

@app.get("/patients")
async def get_patients():
    """
    Get list of all analyzed patients
    
    Returns:
        List of patient summaries
    """
    patients = []
    for patient_id, result in patient_results.items():
        patients.append({
            "patient_id": patient_id,
            "filename": result["filename"],
            "timestamp": result["timestamp"],
            "classification": result["classification"],
            "risk_score": result["risk_score"]
        })
    
    return {"patients": patients}

@app.delete("/results/{patient_id}")
async def delete_results(patient_id: str):
    """
    Delete patient results
    
    Args:
        patient_id: Unique patient identifier
        
    Returns:
        Confirmation message
    """
    if patient_id not in patient_results:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    del patient_results[patient_id]
    return {"message": f"Patient {patient_id} results deleted"}

@app.get("/stats")
async def get_stats():
    """
    Get system statistics
    
    Returns:
        System usage and analysis statistics
    """
    total_patients = len(patient_results)
    normal_count = sum(1 for r in patient_results.values() if r["classification"] == "Normal")
    abnormal_count = total_patients - normal_count
    
    return {
        "total_analyses": total_patients,
        "normal_cases": normal_count,
        "abnormal_cases": abnormal_count,
        "system_health": "operational"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
