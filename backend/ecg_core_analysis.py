#!/usr/bin/env python3
"""
Core ECG Topological Analysis - Production Ready
==================================================

Focused implementation for ventricular tachycardia detection using
topological data analysis without visualization dependencies.
"""

import pandas as pd
import numpy as np
from gtda.time_series import SingleTakensEmbedding
from gtda.homology import VietorisRipsPersistence
from sklearn.decomposition import PCA

class ECGTopologicalAnalyzer:
    """Class for analyzing ECG signals using topological data analysis."""
    
    def __init__(self, embedding_dim=3, time_delay=8, stride=10):
        self.embedding_dim = embedding_dim
        self.time_delay = time_delay
        self.stride = stride
        self.embedder = SingleTakensEmbedding(
            parameters_type="fixed",
            time_delay=time_delay,
            dimension=embedding_dim,
            stride=stride,
        )
        self.persistence = VietorisRipsPersistence(
            homology_dimensions=[0, 1], 
            n_jobs=6
        )
    
    def load_ecg_data(self, file_path):
        """Load ECG data from Excel file."""
        df = pd.read_excel(file_path)
        return df['ECG'].values
    
    def embed_time_series(self, ecg_data):
        """Apply Takens embedding to convert time series to point cloud."""
        embedded_data = self.embedder.fit_transform(ecg_data)
        return embedded_data
    
    def compute_topological_features(self, embedded_data):
        """Compute persistence diagrams for topological analysis."""
        # Reshape for giotto-tda compatibility
        embedded_data_reshaped = embedded_data[None, :, :]
        
        # Compute persistence diagrams
        persistence_diagrams = self.persistence.fit_transform(embedded_data_reshaped)
        
        return persistence_diagrams
    
    def analyze_ecg(self, file_path):
        """Complete ECG analysis pipeline."""
        print(f"Analyzing ECG file: {file_path}")
        
        # Load and embed data
        ecg_data = self.load_ecg_data(file_path)
        print(f"Loaded ECG data with {len(ecg_data)} samples")
        
        embedded_data = self.embed_time_series(ecg_data)
        print(f"Embedded data shape: {embedded_data.shape}")
        
        # Compute topological features
        persistence_diagrams = self.compute_topological_features(embedded_data)
        
        # Extract key topological features
        features = self.extract_features(persistence_diagrams)
        
        print("Analysis complete!")
        return features
    
    def extract_features(self, persistence_diagrams):
        """Extract meaningful features from persistence diagrams."""
        features = {}
        
        # persistence_diagrams is a list of diagrams, one for each homology dimension
        if len(persistence_diagrams) > 0:
            # Process 0-dimensional homology (connected components)
            h0_diagram = persistence_diagrams[0]
            h0_diagram = h0_diagram[h0_diagram[:, 1] != np.inf]
            if len(h0_diagram) > 0:
                features['h0_persistence'] = np.mean(h0_diagram[:, 1] - h0_diagram[:, 0])
                features['h0_num_features'] = len(h0_diagram)
            else:
                features['h0_persistence'] = 0
                features['h0_num_features'] = 0
        else:
            features['h0_persistence'] = 0
            features['h0_num_features'] = 0
        
        if len(persistence_diagrams) > 1:
            # Process 1-dimensional homology (loops)
            h1_diagram = persistence_diagrams[1]
            h1_diagram = h1_diagram[h1_diagram[:, 1] != np.inf]
            if len(h1_diagram) > 0:
                features['h1_persistence'] = np.mean(h1_diagram[:, 1] - h1_diagram[:, 0])
                features['h1_num_features'] = len(h1_diagram)
            else:
                features['h1_persistence'] = 0
                features['h1_num_features'] = 0
        else:
            features['h1_persistence'] = 0
            features['h1_num_features'] = 0
        
        print(f"Extracted features: {features}")
        return features

def analyze_multiple_patients(patient_files):
    """Analyze multiple patient ECG files."""
    analyzer = ECGTopologicalAnalyzer()
    results = {}
    
    for file_path in patient_files:
        try:
            patient_name = file_path.split('/')[-1].replace('.xlsx', '')
            features = analyzer.analyze_ecg(file_path)
            results[patient_name] = features
        except Exception as e:
            print(f"Error analyzing {file_path}: {e}")
    
    return results

def main():
    """Main function for ECG analysis."""
    # List of patient files to analyze
    patient_files = [
        "./Heart Rate/Patient1.xlsx",
        "./Heart Rate/Patient2.xlsx", 
        "./Heart Rate/Patient4.xlsx",
        "./Heart Rate/Patient5.xlsx"
    ]
    
    # Analyze all patients
    results = analyze_multiple_patients(patient_files)
    
    # Print summary
    print("\n" + "="*60)
    print("ECG TOPOLOGICAL ANALYSIS SUMMARY")
    print("="*60)
    
    for patient, features in results.items():
        print(f"\n{patient}:")
        print(f"  H0 Features: {features['h0_num_features']} (avg persistence: {features['h0_persistence']:.4f})")
        print(f"  H1 Features: {features['h1_num_features']} (avg persistence: {features['h1_persistence']:.4f})")
    
    print("\nTopological features extracted for ventricular tachycardia detection.")
    return results

if __name__ == "__main__":
    main()
