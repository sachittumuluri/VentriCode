# Frontend - VentriCode Web Interface

This folder contains the React.js frontend for VentriCode.

## 🎯 Features

### User Interface
- **Dashboard**: Overview of patient analyses
- **Upload**: ECG file upload interface
- **Visualization**: Interactive ECG and topological plots
- **Results**: Detailed analysis results display
- **Patient Management**: Patient history and tracking

### Components
- **FileUpload**: Drag-and-drop ECG file upload
- **ECGViewer**: Interactive ECG signal visualization
- **TopologyPlot**: 3D point cloud and persistence diagrams
- **ResultsCard**: Analysis results summary
- **PatientList**: Patient history management

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Environment Variables
```bash
REACT_APP_API_URL=http://localhost:8000
REACT_APP_API_KEY=your_api_key_here
```

## 🎨 UI Components

### Upload Interface
- Drag and drop Excel files
- File validation and preview
- Progress indicators

### Visualization Dashboard
- Real-time ECG plotting
- 3D point cloud visualization
- Persistence diagram display
- Interactive controls

### Results Display
- Classification results
- Risk assessment scores
- Topological feature breakdown
- Medical report generation

## 📱 Responsive Design

- **Desktop**: Full-featured interface
- **Tablet**: Optimized touch controls
- **Mobile**: Simplified mobile view

## 🔧 Technical Stack

- **React 18**: Modern React with hooks
- **Material-UI**: Component library
- **D3.js**: Data visualization
- **Plotly.js**: Interactive charts
- **Axios**: HTTP client

## 🎯 User Flow

1. **Login/Authentication**: User authentication
2. **Dashboard**: View recent analyses
3. **Upload**: Select ECG file for analysis
4. **Processing**: Real-time analysis progress
5. **Results**: View detailed results
6. **Export**: Download medical reports

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e
```

## 🚀 Deployment

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod

# Deploy to Netlify
netlify deploy --prod --dir=build
```

## 🎨 Design System

### Color Palette
- Primary: #1976d2 (Medical Blue)
- Secondary: #dc004e (Alert Red)
- Success: #2e7d32 (Healthy Green)
- Warning: #ed6c02 (Attention Orange)

### Typography
- Font: Inter, sans-serif
- Headers: Roboto, sans-serif
- Monospace: Fira Code for data

## 📊 API Integration

### Endpoints Used
- `POST /analyze` - Upload ECG for analysis
- `GET /results/{id}` - Get analysis results
- `GET /patients` - List all patients
- `GET /stats` - System statistics

### Error Handling
- Network error recovery
- User-friendly error messages
- Retry mechanisms

## 🏥 Medical Considerations

- **HIPAA Compliance**: Patient data protection
- **Accessibility**: WCAG 2.1 compliance
- **Medical Standards**: FDA guidelines adherence
- **Data Privacy**: End-to-end encryption

Ready for medical professionals and researchers! 🩺
