#!/usr/bin/env python3
"""
Machine Learning Models for Ventricular Tachycardia Detection
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os

class VentricularTachycardiaClassifier:
    """Classifier for ventricular tachycardia detection using topological features."""
    
    def __init__(self, model_type='random_forest'):
        self.model_type = model_type
        self.scaler = StandardScaler()
        self.model = None
        self.feature_names = ['h0_persistence', 'h0_num_features', 'h1_persistence', 'h1_num_features']
        
        # Initialize model
        if model_type == 'random_forest':
            self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        elif model_type == 'svm':
            self.model = SVC(kernel='rbf', probability=True, random_state=42)
        else:
            raise ValueError(f"Unsupported model type: {model_type}")
    
    def prepare_features(self, features_list):
        """Prepare features for ML model."""
        X = []
        for features in features_list:
            feature_vector = [
                features.get('h0_persistence', 0),
                features.get('h0_num_features', 0),
                features.get('h1_persistence', 0),
                features.get('h1_num_features', 0)
            ]
            X.append(feature_vector)
        
        return np.array(X)
    
    def train(self, features_list, labels):
        """
        Train the classifier.
        
        Args:
            features_list: List of feature dictionaries
            labels: List of corresponding labels (0=Normal, 1=Abnormal)
        """
        X = self.prepare_features(features_list)
        y = np.array(labels)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train model
        self.model.fit(X_train_scaled, y_train)
        
        # Evaluate
        y_pred = self.model.predict(X_test_scaled)
        accuracy = accuracy_score(y_test, y_pred)
        
        print(f"Model trained with accuracy: {accuracy:.4f}")
        print("Classification Report:")
        print(classification_report(y_test, y_pred))
        
        return accuracy
    
    def predict(self, features):
        """
        Predict class for single patient.
        
        Args:
            features: Feature dictionary
            
        Returns:
            Prediction probabilities and class
        """
        X = self.prepare_features([features])
        X_scaled = self.scaler.transform(X)
        
        prediction = self.model.predict(X_scaled)[0]
        probabilities = self.model.predict_proba(X_scaled)[0]
        
        return {
            'prediction': int(prediction),
            'probabilities': {
                'normal': float(probabilities[0]),
                'abnormal': float(probabilities[1])
            },
            'confidence': float(max(probabilities))
        }
    
    def save_model(self, filepath):
        """Save trained model to file."""
        model_data = {
            'model': self.model,
            'scaler': self.scaler,
            'model_type': self.model_type,
            'feature_names': self.feature_names
        }
        joblib.dump(model_data, filepath)
        print(f"Model saved to {filepath}")
    
    def load_model(self, filepath):
        """Load trained model from file."""
        if os.path.exists(filepath):
            model_data = joblib.load(filepath)
            self.model = model_data['model']
            self.scaler = model_data['scaler']
            self.model_type = model_data['model_type']
            self.feature_names = model_data['feature_names']
            print(f"Model loaded from {filepath}")
        else:
            raise FileNotFoundError(f"Model file not found: {filepath}")

def create_sample_dataset():
    """Create sample dataset for demonstration."""
    # Sample features based on our analysis results
    normal_features = [
        {'h0_persistence': 0.1317, 'h0_num_features': 136, 'h1_persistence': 0, 'h1_num_features': 0},
        {'h0_persistence': 0.1314, 'h0_num_features': 132, 'h1_persistence': 0, 'h1_num_features': 0},
        {'h0_persistence': 0.1250, 'h0_num_features': 128, 'h1_persistence': 0, 'h1_num_features': 0},
        {'h0_persistence': 0.1300, 'h0_num_features': 140, 'h1_persistence': 0, 'h1_num_features': 0},
        {'h0_persistence': 0.1180, 'h0_num_features': 125, 'h1_persistence': 0, 'h1_num_features': 0},
    ]
    
    abnormal_features = [
        {'h0_persistence': 0.2246, 'h0_num_features': 146, 'h1_persistence': 0, 'h1_num_features': 0},
        {'h0_persistence': 0.1159, 'h0_num_features': 302, 'h1_persistence': 0, 'h1_num_features': 0},
        {'h0_persistence': 0.2100, 'h0_num_features': 180, 'h1_persistence': 0, 'h1_num_features': 0},
        {'h0_persistence': 0.1950, 'h0_num_features': 165, 'h1_persistence': 0, 'h1_num_features': 0},
        {'h0_persistence': 0.2500, 'h0_num_features': 200, 'h1_persistence': 0, 'h1_num_features': 0},
    ]
    
    features = normal_features + abnormal_features
    labels = [0] * len(normal_features) + [1] * len(abnormal_features)
    
    return features, labels

def main():
    """Main function to train and test the classifier."""
    print("Training Ventricular Tachycardia Classifier...")
    
    # Create sample dataset
    features, labels = create_sample_dataset()
    
    # Initialize and train classifier
    classifier = VentricularTachycardiaClassifier(model_type='random_forest')
    accuracy = classifier.train(features, labels)
    
    # Test with sample data
    test_features = {'h0_persistence': 0.15, 'h0_num_features': 150, 'h1_persistence': 0, 'h1_num_features': 0}
    result = classifier.predict(test_features)
    
    print(f"\nTest prediction: {result}")
    
    # Save model
    classifier.save_model('backend/models/vt_classifier.joblib')

if __name__ == "__main__":
    main()
