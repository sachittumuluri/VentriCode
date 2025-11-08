#!/usr/bin/env python3
"""
ECG Topological Analysis for Ventricular Tachycardia Detection
==============================================================

This script analyzes ECG signals using topological data analysis techniques
to detect ventricular tachycardia patterns through persistent homology.
"""

import pandas as pd
import numpy as np
import plotly.graph_objects as go
from gtda.time_series import SingleTakensEmbedding
from gtda.plotting import plot_point_cloud
from gtda.homology import VietorisRipsPersistence
from sklearn.decomposition import PCA

def load_ecg_data(file_path):
    """Load ECG data from Excel file."""
    df = pd.read_excel(file_path)
    return df['ECG'].tolist()

def create_time_indices(data_length, step=4):
    """Create time indices for ECG data."""
    return list(range(0, data_length, step))

def plot_ecg_signal(time_indices, ecg_data, title="ECG Signal"):
    """Plot ECG signal using Plotly."""
    fig = go.Figure(data=go.Scatter(x=time_indices, y=ecg_data))
    fig.update_layout(
        xaxis_title="Timestamp", 
        yaxis_title="Amplitude",
        title=title
    )
    fig.show()

def embed_time_series(ecg_data, embedding_dim=3, time_delay=8, stride=10):
    """Apply Takens embedding to convert time series to point cloud."""
    embedder = SingleTakensEmbedding(
        parameters_type="fixed",
        n_jobs=2,
        time_delay=time_delay,
        dimension=embedding_dim,
        stride=stride,
    )
    
    embedded_data = embedder.fit_transform(ecg_data)
    print(f"Shape of embedded time series: {embedded_data.shape}")
    return embedded_data

def plot_point_cloud_3d(embedded_data, title="Point Cloud"):
    """Plot 3D point cloud of embedded time series."""
    plot_point_cloud(embedded_data)

def apply_pca_reduction(embedded_data, n_components=3):
    """Apply PCA for dimensionality reduction and visualization."""
    pca = PCA(n_components=n_components)
    reduced_data = pca.fit_transform(embedded_data)
    return reduced_data

def compute_persistence_diagrams(embedded_data, homology_dimensions=[0, 1]):
    """Compute persistence diagrams using Vietoris-Rips complex."""
    # Reshape data for giotto-tda compatibility
    embedded_data_reshaped = embedded_data[None, :, :]
    
    persistence = VietorisRipsPersistence(
        homology_dimensions=homology_dimensions, 
        n_jobs=6
    )
    
    print("Computing persistence diagram for ECG signal")
    persistence_diagrams = persistence.fit_transform(embedded_data_reshaped)
    
    # Plot the persistence diagram
    persistence.fit_transform_plot(embedded_data_reshaped)
    
    return persistence_diagrams

def analyze_ecg_for_tachycardia(ecg_file_path):
    """Complete pipeline for ECG analysis and tachycardia detection."""
    print(f"Analyzing ECG file: {ecg_file_path}")
    
    # Load ECG data
    ecg_data = load_ecg_data(ecg_file_path)
    time_indices = create_time_indices(len(ecg_data))
    
    # Plot original ECG signal
    plot_ecg_signal(time_indices, ecg_data, "Original ECG Signal")
    
    # Apply Takens embedding
    embedded_data = embed_time_series(ecg_data)
    
    # Visualize point cloud
    plot_point_cloud_3d(embedded_data, "ECG Point Cloud (Takens Embedding)")
    
    # Apply PCA for better visualization
    pca_reduced = apply_pca_reduction(embedded_data)
    plot_point_cloud_3d(pca_reduced, "ECG Point Cloud (PCA Reduced)")
    
    # Compute persistence diagrams for topological analysis
    persistence_diagrams = compute_persistence_diagrams(embedded_data)
    
    print("ECG analysis complete!")
    print("Topological features can now be used for ventricular tachycardia detection.")
    
    return persistence_diagrams

def main():
    """Main function to run ECG analysis."""
    # Example usage with patient data
    ecg_file = "./Heart Rate/Patient1.xlsx"
    
    try:
        results = analyze_ecg_for_tachycardia(ecg_file)
        return results
    except FileNotFoundError:
        print(f"Error: Could not find {ecg_file}")
        print("Please ensure the ECG file exists in the correct location.")
        return None

if __name__ == "__main__":
    main()
