# VentriCode - Ventricular Tachycardia Detection System

## Overview
VentriCode is a cutting-edge medical diagnostic system that uses topological data analysis (TDA) to detect ventricular tachycardia from ECG signals.

## 🏗️ Repository Structure

### Backend (Main Branch)
- Core TDA algorithms for ECG analysis
- Topological feature extraction
- Data processing pipelines
- Machine learning models

### Frontend Branch (`frontend`)
- Web interface for ECG upload
- Real-time visualization
- Patient dashboard
- Results display

## 🚀 Quick Start

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/sidjainnn/VentriCode.git
cd VentriCode

# Install dependencies
pip install -r requirements.txt

# Run analysis
python3 ecg_core_analysis.py
```

### Frontend Setup
```bash
# Switch to frontend branch
git checkout frontend

# Install frontend dependencies
npm install

# Start development server
npm start
```

## 📊 Features

### Backend
- ✅ Topological Data Analysis (TDA) for ECG signals
- ✅ Persistent homology computation
- ✅ Feature extraction for ventricular tachycardia detection
- ✅ Multi-patient batch processing
- ✅ Cross-platform compatibility

### Frontend (In Development)
- 🔄 Interactive ECG visualization
- 🔄 Patient management system
- 🔄 Real-time analysis results
- 🔄 Medical report generation

## 🧬 Medical Application

Our system analyzes ECG signals using advanced mathematical techniques:
- **Takens Embedding**: Converts time series to point clouds
- **Vietoris-Rips Persistence**: Computes topological features
- **Persistent Homology**: Identifies abnormal cardiac patterns

## 📈 Sample Results

| Patient | H0 Features | Avg Persistence | Status |
|---------|-------------|-----------------|---------|
| Patient1 | 136 | 0.1317 | Normal |
| Patient2 | 146 | 0.2246 | Abnormal |
| Patient4 | 132 | 0.1314 | Normal |
| Patient5 | 302 | 0.1159 | Abnormal |

## 👥 Team Structure

### Backend Team
- Work on `main` branch
- Core algorithms and data processing
- API development
- Machine learning models

### Frontend Team  
- Work on `frontend` branch
- User interface development
- Visualization components
- User experience design

## 🛠️ Tech Stack

### Backend
- Python 3.9+
- NumPy, Pandas, Scikit-learn
- Scikit-TDA, Giotto-TDA
- Plotly, Matplotlib

### Frontend
- React.js
- Material-UI
- D3.js for visualizations
- Node.js backend

## 🏥 Hackathon Application

This system is designed for medical hackathons with focus on:
- Real-world medical data analysis
- Innovative diagnostic techniques
- Interdisciplinary collaboration
- Healthcare impact

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit your changes
4. Push to the branch
5. Create Pull Request

---

**VentriCode** - Where Topology Meets Cardiology 🫀
