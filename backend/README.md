# Backend - Ventricular Tachycardia Detection System

This folder contains the core backend algorithms for VentriCode.

## 📁 Files

### Core Analysis Scripts
- `ecg_core_analysis.py` - Production-ready TDA analysis without visualization
- `ecg_topological_analysis.py` - Full-featured analysis with interactive visualizations

### Data Processing
- `Heart Rate/` - Patient ECG data files (Excel format)
- `data_processor.py` - Data loading and preprocessing utilities

### Machine Learning
- `ml_models.py` - Classification models for tachycardia detection
- `feature_extractor.py` - Advanced feature extraction methods

### API
- `api_server.py` - REST API for frontend integration
- `models.py` - Data models and schemas

## 🚀 Running the Backend

### Setup
```bash
# Install dependencies
pip install -r requirements.txt

# Run core analysis
python3 ecg_core_analysis.py

# Run with visualizations
python3 ecg_topological_analysis.py
```

### API Server
```bash
python3 api_server.py
# Server runs on http://localhost:8000
```

## 🔬 Algorithms

### Topological Data Analysis Pipeline
1. **Data Loading**: ECG signals from Excel files
2. **Takens Embedding**: Time series → Point cloud
3. **Vietoris-Rips Complex**: Topological structure construction
4. **Persistent Homology**: Feature computation
5. **Classification**: Normal vs Abnormal detection

### Key Features Extracted
- H0 Persistence (Connected Components)
- H1 Persistence (Loops)
- Betti Numbers
- Persistence Landscapes

## 📊 API Endpoints

- `POST /analyze` - Upload and analyze ECG data
- `GET /results/{patient_id}` - Get analysis results
- `GET /patients` - List all patients
- `GET /health` - Health check

## 🧪 Testing

```bash
python3 -m pytest tests/
```

## 🏥 Medical Integration

The backend provides:
- Real-time ECG analysis
- Topological feature extraction
- Ventricular tachycardia detection
- Patient data management

Ready for integration with medical systems and frontend applications.
