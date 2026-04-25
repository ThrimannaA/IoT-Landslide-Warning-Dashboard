# import sys
# sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# import joblib
# import numpy as np
# import pandas as pd
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import requests
# import os
# from datetime import datetime, timedelta
# import json

# app = Flask(__name__)
# CORS(app)

# # ========== LOAD TRAINED MODELS ==========
# MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models', 'best_model.pkl')
# SCALER_PATH = os.path.join(os.path.dirname(__file__), 'models', 'scaler.pkl')

# print("Loading ML models...")
# try:
#     model = joblib.load(MODEL_PATH)
#     scaler = joblib.load(SCALER_PATH)
#     print(f"[OK] Model loaded: {type(model).__name__}")
#     print(f"[OK] Scaler loaded: {type(scaler).__name__}")
# except Exception as e:
#     print(f"[WARN] Error loading models: {e}")
#     model = None
#     scaler = None

# FEATURES = ['Rotation X', 'Rotation Y', 'Rotation Z', 'Vibration', 'Soil20cm', 'CrackWidth']

# # ========== FIREBASE CONFIG (YOUR EXISTING CONFIG) ==========
# FIREBASE_CONFIG = {
#     "apiKey": "AIzaSyD5IShpVHM9Dy4C4Cg15j-5ik1e6Cvy0I4",
#     "authDomain": "iotbda-11609.firebaseapp.com",
#     "databaseURL": "https://iotbda-11609-default-rtdb.firebaseio.com",
#     "projectId": "iotbda-11609",
#     "storageBucket": "iotbda-11609.firebasestorage.app",
#     "messagingSenderId": "806540556560",
#     "appId": "1:806540556560:web:07f223b9e755fa8552cd95",
# }

# FIREBASE_DB_URL = FIREBASE_CONFIG['databaseURL']

# def get_latest_readings(limit=50):
#     """Fetch latest sensor readings from Firebase, sorted by timestamp descending"""
#     try:
#         # Fetch a larger pool to ensure we get truly latest by timestamp
#         fetch_limit = max(limit * 2, 100)
#         url = f"{FIREBASE_DB_URL}/sensor_readings.json?orderBy=\"$key\"&limitToLast={fetch_limit}"
#         response = requests.get(url)
#         data = response.json()
        
#         if not data:
#             return []
        
#         readings = []
#         for key, reading in data.items():
#             readings.append({
#                 'timestamp': reading.get('timestamp'),
#                 'rotation_x': reading.get('rotation_x', 0),
#                 'rotation_y': reading.get('rotation_y', 0),
#                 'rotation_z': reading.get('rotation_z', 0),
#                 'vibration': abs(reading.get('acceleration_x', 0)),
#                 'soil_20cm': reading.get('soil_20cm', 0),
#                 'crack_width': reading.get('crack_width', 0),
#                 'temperature': reading.get('temperature', 0),
#                 'humidity': reading.get('humidity', 0),
#                 'node_name': reading.get('node_name', 'Unknown')
#             })
        
#         # Sort by timestamp descending — parse date string for proper ordering
#         def parse_ts(r):
#             try:
#                 from datetime import datetime
#                 ts = r.get('timestamp', '')
#                 # Handle formats like "4/15/2025 9:18" or "3/27/2025 6:49"
#                 return datetime.strptime(ts, '%m/%d/%Y %H:%M')
#             except Exception:
#                 return datetime.min
        
#         readings.sort(key=parse_ts, reverse=True)
#         return readings[:limit]
        
#     except Exception as e:
#         print(f"Error fetching from Firebase: {e}")
#         return []

# def prepare_features(reading):
#     """Extract features in correct order for model"""
#     return np.array([[
#         reading.get('rotation_x', 0),
#         reading.get('rotation_y', 0),
#         reading.get('rotation_z', 0),
#         reading.get('vibration', 0),
#         reading.get('soil_20cm', 0),
#         reading.get('crack_width', 0)
#     ]])

# def predict_risk(reading):
#     """Predict risk level for a single reading using trained ML model"""
#     if model is None or scaler is None:
#         # Fallback rule-based (only if model not loaded)
#         soil = reading.get('soil_20cm', 0)
#         crack = reading.get('crack_width', 0)
#         tilt = abs(reading.get('rotation_x', 0))
        
#         if soil > 80 or crack > 5 or tilt > 8:
#             risk_level = 'CRITICAL'
#             confidence = 85
#         elif soil > 60 or crack > 3.5 or tilt > 5:
#             risk_level = 'WARNING'
#             confidence = 75
#         else:
#             risk_level = 'LOW'
#             confidence = 90
        
#         return {
#             'risk_level': risk_level,
#             'confidence': confidence,
#             'fallback_mode': True
#         }
    
#     features = prepare_features(reading)
#     features_scaled = scaler.transform(features)
    
#     pred_class = model.predict(features_scaled)[0]
    
#     if hasattr(model, 'predict_proba'):
#         probabilities = model.predict_proba(features_scaled)[0]
#         confidence = max(probabilities) * 100
#     else:
#         probabilities = [0.33, 0.33, 0.34]
#         confidence = 95.0
    
#     risk_map = {0: 'LOW', 1: 'WARNING', 2: 'CRITICAL'}
#     risk_level = risk_map.get(pred_class, 'UNKNOWN')
    
#     return {
#         'risk_level': risk_level,
#         'confidence': round(confidence, 1),
#         'probabilities': {
#             'low': round(probabilities[0] * 100, 1),
#             'warning': round(probabilities[1] * 100, 1),
#             'critical': round(probabilities[2] * 100, 1)
#         } if len(probabilities) == 3 else None,
#         'fallback_mode': False
#     }

# # ========== CORRECT ML-BASED FORECASTING METHOD ==========
# def create_lag_features(readings, current_idx, lag_steps=[1, 2, 3, 4, 5]):
#     """
#     Create lag features from historical readings for time-series prediction.
#     This allows the ML model to learn temporal patterns.
#     """
#     if current_idx < max(lag_steps):
#         return None
    
#     lag_features = {}
#     for lag in lag_steps:
#         past_reading = readings[current_idx - lag]
#         lag_features[f'soil_lag_{lag}'] = past_reading.get('soil_20cm', 0)
#         lag_features[f'crack_lag_{lag}'] = past_reading.get('crack_width', 0)
#         lag_features[f'tilt_lag_{lag}'] = abs(past_reading.get('rotation_x', 0))
#         lag_features[f'vibration_lag_{lag}'] = past_reading.get('vibration', 0)
    
#     # Calculate rolling statistics (trend features)
#     recent_soil = [readings[current_idx - i].get('soil_20cm', 0) for i in range(1, 6)]
#     recent_crack = [readings[current_idx - i].get('crack_width', 0) for i in range(1, 6)]
    
#     lag_features['soil_trend'] = np.polyfit(range(5), recent_soil, 1)[0]
#     lag_features['crack_trend'] = np.polyfit(range(5), recent_crack, 1)[0]
#     lag_features['soil_acceleration'] = lag_features['soil_trend'] - (recent_soil[0] - recent_soil[1]) if len(recent_soil) > 1 else 0
    
#     return lag_features

# def predict_future_risk_ml(readings, hours_ahead=1):
#     """
#     PREDICT FUTURE RISK USING ML MODEL WITH LAG FEATURES
#     This uses the trained model to forecast future states, not linear extrapolation.
#     """
#     if len(readings) < 10:
#         return None
    
#     # Method 1: Use current ML model on current data (baseline)
#     latest = readings[0]  # Most recent reading
#     current_risk = predict_risk(latest)
    
#     # Method 2: For forecasting, we need to predict future feature values
#     # Since we don't have a separate time-series model, we use trend analysis
#     # on each feature and then apply the ML model on predicted features
    
#     # Calculate rate of change for each feature from last 10 readings
#     recent_10 = readings[:10]
    
#     predicted_features = {}
#     for feature in ['soil_20cm', 'crack_width', 'rotation_x', 'rotation_y', 'rotation_z', 'vibration']:
#         values = [r.get(feature, 0) for r in recent_10]
        
#         # Calculate exponential moving average trend
#         if len(values) >= 5:
#             # Weighted trend: more recent values have higher weight
#             weights = np.array([0.1, 0.15, 0.2, 0.25, 0.3])
#             recent_values = values[:5]
#             avg_change = np.average([recent_values[i] - recent_values[i+1] for i in range(4)], weights=weights[:-1])
#         else:
#             avg_change = 0
        
#         # Predict future value
#         current_val = latest.get(feature, 0)
#         predicted_val = current_val + (avg_change * hours_ahead)
        
#         # Apply bounds
#         if feature == 'soil_20cm':
#             predicted_val = max(0, min(100, predicted_val))
#         elif feature == 'crack_width':
#             predicted_val = max(0, predicted_val)
#         elif 'rotation' in feature:
#             predicted_val = max(-180, min(180, predicted_val))
#         elif feature == 'vibration':
#             predicted_val = max(0, predicted_val)
        
#         predicted_features[feature] = predicted_val
    
#     # Create predicted reading
#     predicted_reading = {
#         'rotation_x': predicted_features['rotation_x'],
#         'rotation_y': predicted_features['rotation_y'],
#         'rotation_z': predicted_features['rotation_z'],
#         'vibration': predicted_features['vibration'],
#         'soil_20cm': predicted_features['soil_20cm'],
#         'crack_width': predicted_features['crack_width']
#     }
    
#     # Apply ML model on predicted features
#     future_risk = predict_risk(predicted_reading)
    
#     # Calculate trend direction for each feature
#     soil_vals = [r.get('soil_20cm', 0) for r in recent_10[:5]]
#     crack_vals = [r.get('crack_width', 0) for r in recent_10[:5]]
#     tilt_vals = [abs(r.get('rotation_x', 0)) for r in recent_10[:5]]
    
#     soil_trend = 'increasing' if len(soil_vals) > 1 and soil_vals[0] > soil_vals[1] + 1 else 'decreasing' if len(soil_vals) > 1 and soil_vals[0] < soil_vals[1] - 1 else 'stable'
#     crack_trend = 'increasing' if len(crack_vals) > 1 and crack_vals[0] > crack_vals[1] + 0.1 else 'decreasing' if len(crack_vals) > 1 and crack_vals[0] < crack_vals[1] - 0.1 else 'stable'
#     tilt_trend = 'increasing' if len(tilt_vals) > 1 and tilt_vals[0] > tilt_vals[1] + 0.5 else 'decreasing' if len(tilt_vals) > 1 and tilt_vals[0] < tilt_vals[1] - 0.5 else 'stable'
    
#     return {
#         'current_risk': current_risk,
#         'predicted_risk': future_risk,
#         'hours_ahead': hours_ahead,
#         'trend_direction': {
#             'soil': soil_trend,
#             'crack': crack_trend,
#             'tilt': tilt_trend
#         },
#         'method': 'ML_model_on_predicted_features'
#     }

# # ========== SIMPLE FORECAST (For when you just need current risk only) ==========
# @app.route('/api/ml/current-risk', methods=['GET'])
# def current_risk():
#     """Predict risk for latest sensor reading using ML model"""
#     readings = get_latest_readings(1)
    
#     if not readings:
#         return jsonify({'error': 'No sensor data available'}), 404
    
#     latest = readings[0]
#     # Debug: log actual values being used
#     print(f"[DEBUG] Latest reading -> timestamp={latest.get('timestamp')}, "
#           f"soil={latest.get('soil_20cm')}, crack={latest.get('crack_width')}, "
#           f"tilt_x={latest.get('rotation_x')}, vibration={latest.get('vibration')}")
#     result = predict_risk(latest)
#     print(f"[DEBUG] Predicted risk: {result['risk_level']} (confidence={result.get('confidence')})")
#     result['timestamp'] = latest.get('timestamp')
#     result['node_name'] = latest.get('node_name')
#     result['soil'] = latest.get('soil_20cm', 0)
#     result['crack'] = latest.get('crack_width', 0)
#     result['tilt'] = abs(latest.get('rotation_x', 0))
    
#     return jsonify(result)

# # ========== ML-BASED FORECAST ENDPOINT ==========
# @app.route('/api/ml/forecast', methods=['GET'])
# def forecast():
#     """Get ML-based risk forecast for next hours"""
#     readings = get_latest_readings(30)  # Need last 30 for trend calculation
    
#     if len(readings) < 10:
#         return jsonify({'error': 'Insufficient data for ML forecast (need at least 10 readings)'}), 404
    
#     hours = int(request.args.get('hours', 1))
    
#     # Use ML-based forecasting method
#     forecast_result = predict_future_risk_ml(readings, hours)
    
#     if not forecast_result:
#         return jsonify({'error': 'Could not generate ML forecast'}), 500
    
#     return jsonify({
#         'current': forecast_result['current_risk'],
#         'forecast': {
#             'predicted_risk': forecast_result['predicted_risk'],
#             'hours_ahead': forecast_result['hours_ahead'],
#             'trend_direction': forecast_result['trend_direction'],
#             'method': forecast_result['method']
#         },
#         'readings_used': len(readings)
#     })

# # ========== HISTORICAL RISK (USES ML MODEL ON EACH READING) ==========
# @app.route('/api/ml/historical-risk', methods=['GET'])
# def historical_risk():
#     """Get ML model predictions for last N readings"""
#     limit = int(request.args.get('limit', 30))
#     readings = get_latest_readings(limit)
    
#     if not readings:
#         return jsonify({'error': 'No sensor data available'}), 404
    
#     results = []
#     for reading in readings:
#         pred = predict_risk(reading)
#         results.append({
#             'timestamp': reading.get('timestamp'),
#             'risk_level': pred['risk_level'],
#             'confidence': pred['confidence'],
#             'soil': reading.get('soil_20cm', 0),
#             'crack': reading.get('crack_width', 0),
#             'tilt': abs(reading.get('rotation_x', 0)),
#             'vibration': reading.get('vibration', 0)  
#         })
    
#     results.reverse()  # Chronological order
    
#     return jsonify({
#         'historical_risk': results,
#         'total': len(results),
#         'ml_model_used': type(model).__name__ if model else 'Rule-based'
#     })

# @app.route('/api/ml/feature-importance', methods=['GET'])
# def feature_importance():
#     """Get feature importance from trained ML model"""
#     if model is None:
#         default_importance = [
#             {'feature': 'Soil20cm', 'importance': 0.35},
#             {'feature': 'CrackWidth', 'importance': 0.25},
#             {'feature': 'Rotation X', 'importance': 0.18},
#             {'feature': 'Vibration', 'importance': 0.12},
#             {'feature': 'Rotation Y', 'importance': 0.06},
#             {'feature': 'Rotation Z', 'importance': 0.04}
#         ]
#         return jsonify({'feature_importance': default_importance, 'source': 'default'})
    
#     if hasattr(model, 'feature_importances_'):
#         importances = model.feature_importances_
#         importance_list = [
#             {'feature': FEATURES[i], 'importance': float(importances[i])}
#             for i in range(len(FEATURES))
#         ]
#         importance_list.sort(key=lambda x: x['importance'], reverse=True)
#         return jsonify({'feature_importance': importance_list, 'source': 'model'})
#     elif hasattr(model, 'coef_'):
#         coefs = np.abs(model.coef_).mean(axis=0)
#         importance_list = [
#             {'feature': FEATURES[i], 'importance': float(coefs[i])}
#             for i in range(len(FEATURES))
#         ]
#         importance_list.sort(key=lambda x: x['importance'], reverse=True)
#         return jsonify({'feature_importance': importance_list, 'source': 'coefficients'})
    
#     return jsonify({'error': 'Feature importance not available'})

# @app.route('/api/ml/health', methods=['GET'])
# def health():
#     """Health check endpoint"""
#     return jsonify({
#         'status': 'ok',
#         'model_type': type(model).__name__ if model else 'RuleBased',
#         'fallback_mode': model is None,
#         'features': FEATURES,
#         'forecast_method': 'ML_model_on_predicted_features',
#         'timestamp': datetime.now().isoformat()
#     })

# @app.route('/api/ml/predict', methods=['POST'])
# def predict_endpoint():
#     """Predict risk from provided sensor data using ML model"""
#     data = request.json
    
#     if not data:
#         return jsonify({'error': 'No data provided'}), 400
    
#     reading = {
#         'rotation_x': data.get('rotation_x', 0),
#         'rotation_y': data.get('rotation_y', 0),
#         'rotation_z': data.get('rotation_z', 0),
#         'vibration': data.get('vibration', 0),
#         'soil_20cm': data.get('soil_20cm', 0),
#         'crack_width': data.get('crack_width', 0)
#     }
    
#     result = predict_risk(reading)
#     return jsonify(result)

# if __name__ == '__main__':
#     print("\n" + "="*60)
#     print("SiteSense ML Service Starting...")
#     print("="*60)
#     print(f"Firebase DB URL: {FIREBASE_DB_URL}")
#     print(f"ML Model: {type(model).__name__ if model else 'Not loaded (using rule-based fallback)'}")
#     print(f"Features: {FEATURES}")
#     print(f"Forecast Method: ML_model_on_predicted_features")
#     print("\nReady! Available endpoints:")
#     print("   GET  /api/ml/current-risk")
#     print("   GET  /api/ml/forecast?hours=X")
#     print("   GET  /api/ml/historical-risk?limit=N")
#     print("   GET  /api/ml/feature-importance")
#     print("   POST /api/ml/predict")
#     print("   GET  /api/ml/health")
#     print("\n" + "="*60)
    
#     app.run(host='0.0.0.0', port=5000, debug=False, use_reloader=False)


import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import joblib
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from datetime import datetime, timedelta
import json

app = Flask(__name__)
CORS(app)

# ========== LOAD TRAINED MODELS ==========
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models', 'best_model.pkl')
SCALER_PATH = os.path.join(os.path.dirname(__file__), 'models', 'scaler.pkl')

print("Loading ML models...")
try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    print(f"[OK] Model loaded: {type(model).__name__}")
    print(f"[OK] Scaler loaded: {type(scaler).__name__}")
except Exception as e:
    print(f"[WARN] Error loading models: {e}")
    model = None
    scaler = None

FEATURES = ['Rotation X', 'Rotation Y', 'Rotation Z', 'Vibration', 'Soil20cm', 'CrackWidth']

# ========== FIREBASE CONFIG ==========
FIREBASE_CONFIG = {
    "apiKey": "AIzaSyD5IShpVHM9Dy4C4Cg15j-5ik1e6Cvy0I4",
    "authDomain": "iotbda-11609.firebaseapp.com",
    "databaseURL": "https://iotbda-11609-default-rtdb.firebaseio.com",
    "projectId": "iotbda-11609",
    "storageBucket": "iotbda-11609.firebasestorage.app",
    "messagingSenderId": "806540556560",
    "appId": "1:806540556560:web:07f223b9e755fa8552cd95",
}

FIREBASE_DB_URL = FIREBASE_CONFIG['databaseURL']

def get_latest_readings(limit=50):
    """Fetch LATEST sensor readings from Firebase (newest first)"""
    try:
        # Fetch more to ensure we get truly latest
        fetch_limit = max(limit * 2, 100)
        url = f"{FIREBASE_DB_URL}/sensor_readings.json"
        response = requests.get(url)
        data = response.json()
        
        if not data:
            print("[WARN] No data found in Firebase")
            return []
        
        readings = []
        for key, reading in data.items():
            # Parse timestamp correctly
            ts_str = reading.get('timestamp', '')
            try:
                # Handle format like "3/27/2025 6:49" or "4/15/2025 9:18"
                if '/' in ts_str and ':' in ts_str:
                    timestamp = datetime.strptime(ts_str, '%m/%d/%Y %H:%M')
                else:
                    timestamp = datetime.min
            except Exception:
                timestamp = datetime.min
            
            readings.append({
                'timestamp': ts_str,
                'timestamp_obj': timestamp,
                'rotation_x': reading.get('rotation_x', 0),
                'rotation_y': reading.get('rotation_y', 0),
                'rotation_z': reading.get('rotation_z', 0),
                'vibration': abs(reading.get('acceleration_x', 0)),
                'soil_20cm': reading.get('soil_20cm', 0),
                'crack_width': reading.get('crack_width', 0),
                'temperature': reading.get('temperature', 0),
                'humidity': reading.get('humidity', 0),
                'node_name': reading.get('node_name', 'Unknown')
            })
        
        # Sort by timestamp DESCENDING (newest first)
        readings.sort(key=lambda x: x['timestamp_obj'], reverse=True)
        
        # Debug: print latest reading info
        if readings:
            latest = readings[0]
            print(f"[DEBUG] Latest reading from Firebase: timestamp={latest['timestamp']}, "
                  f"soil={latest['soil_20cm']}%, crack={latest['crack_width']}mm, "
                  f"tilt={abs(latest['rotation_x'])}°, vibration={latest['vibration']}g")
        
        return readings[:limit]
        
    except Exception as e:
        print(f"[ERROR] Error fetching from Firebase: {e}")
        return []

def get_single_latest_reading():
    """Get ONLY the most recent reading (for current risk display)"""
    readings = get_latest_readings(1)
    if readings:
        return readings[0]
    return None

def prepare_features(reading):
    """Extract features in correct order for model"""
    return np.array([[
        reading.get('rotation_x', 0),
        reading.get('rotation_y', 0),
        reading.get('rotation_z', 0),
        reading.get('vibration', 0),
        reading.get('soil_20cm', 0),
        reading.get('crack_width', 0)
    ]])

def predict_risk(reading):
    """Predict risk level for a single reading using trained ML model"""
    if model is None or scaler is None:
        # Fallback rule-based
        soil = reading.get('soil_20cm', 0)
        crack = reading.get('crack_width', 0)
        tilt = abs(reading.get('rotation_x', 0))
        
        if soil > 80 or crack > 5 or tilt > 8:
            risk_level = 'CRITICAL'
            confidence = 85
        elif soil > 60 or crack > 3.5 or tilt > 5:
            risk_level = 'WARNING'
            confidence = 75
        else:
            risk_level = 'LOW'
            confidence = 90
        
        return {
            'risk_level': risk_level,
            'confidence': confidence,
            'fallback_mode': True
        }
    
    features = prepare_features(reading)
    features_scaled = scaler.transform(features)
    
    pred_class = model.predict(features_scaled)[0]
    
    if hasattr(model, 'predict_proba'):
        probabilities = model.predict_proba(features_scaled)[0]
        confidence = max(probabilities) * 100
    else:
        probabilities = [0.33, 0.33, 0.34]
        confidence = 95.0
    
    risk_map = {0: 'LOW', 1: 'WARNING', 2: 'CRITICAL'}
    risk_level = risk_map.get(pred_class, 'UNKNOWN')
    
    return {
        'risk_level': risk_level,
        'confidence': round(confidence, 1),
        'probabilities': {
            'low': round(probabilities[0] * 100, 1),
            'warning': round(probabilities[1] * 100, 1),
            'critical': round(probabilities[2] * 100, 1)
        } if len(probabilities) == 3 else None,
        'fallback_mode': False
    }

def predict_future_risk_ml(readings, hours_ahead=1):
    """Predict future risk using trend analysis + ML model"""
    if len(readings) < 10:
        return None
    
    latest = readings[0]
    current_risk = predict_risk(latest)
    
    recent_10 = readings[:10]
    
    predicted_features = {}
    for feature in ['soil_20cm', 'crack_width', 'rotation_x', 'rotation_y', 'rotation_z', 'vibration']:
        values = [r.get(feature, 0) for r in recent_10]
        
        if len(values) >= 5:
            weights = np.array([0.1, 0.15, 0.2, 0.25, 0.3])
            recent_values = values[:5]
            avg_change = np.average([recent_values[i] - recent_values[i+1] for i in range(4)], weights=weights[:-1])
        else:
            avg_change = 0
        
        current_val = latest.get(feature, 0)
        predicted_val = current_val + (avg_change * hours_ahead)
        
        if feature == 'soil_20cm':
            predicted_val = max(0, min(100, predicted_val))
        elif feature == 'crack_width':
            predicted_val = max(0, predicted_val)
        elif 'rotation' in feature:
            predicted_val = max(-180, min(180, predicted_val))
        elif feature == 'vibration':
            predicted_val = max(0, predicted_val)
        
        predicted_features[feature] = predicted_val
    
    predicted_reading = {
        'rotation_x': predicted_features['rotation_x'],
        'rotation_y': predicted_features['rotation_y'],
        'rotation_z': predicted_features['rotation_z'],
        'vibration': predicted_features['vibration'],
        'soil_20cm': predicted_features['soil_20cm'],
        'crack_width': predicted_features['crack_width']
    }
    
    future_risk = predict_risk(predicted_reading)
    
    soil_vals = [r.get('soil_20cm', 0) for r in recent_10[:5]]
    crack_vals = [r.get('crack_width', 0) for r in recent_10[:5]]
    tilt_vals = [abs(r.get('rotation_x', 0)) for r in recent_10[:5]]
    
    soil_trend = 'increasing' if len(soil_vals) > 1 and soil_vals[0] > soil_vals[1] + 1 else 'decreasing' if len(soil_vals) > 1 and soil_vals[0] < soil_vals[1] - 1 else 'stable'
    crack_trend = 'increasing' if len(crack_vals) > 1 and crack_vals[0] > crack_vals[1] + 0.1 else 'decreasing' if len(crack_vals) > 1 and crack_vals[0] < crack_vals[1] - 0.1 else 'stable'
    tilt_trend = 'increasing' if len(tilt_vals) > 1 and tilt_vals[0] > tilt_vals[1] + 0.5 else 'decreasing' if len(tilt_vals) > 1 and tilt_vals[0] < tilt_vals[1] - 0.5 else 'stable'
    
    return {
        'current_risk': current_risk,
        'predicted_risk': future_risk,
        'hours_ahead': hours_ahead,
        'trend_direction': {
            'soil': soil_trend,
            'crack': crack_trend,
            'tilt': tilt_trend
        },
        'method': 'ML_model_on_predicted_features'
    }

# ========== API ENDPOINTS ==========

@app.route('/api/ml/current-risk', methods=['GET'])
def current_risk():
    """Predict risk for LATEST sensor reading only"""
    latest = get_single_latest_reading()
    
    if not latest:
        return jsonify({'error': 'No sensor data available'}), 404
    
    print(f"[INFO] Current risk request - using latest reading: {latest['timestamp']}")
    
    result = predict_risk(latest)
    result['timestamp'] = latest.get('timestamp')
    result['node_name'] = latest.get('node_name')
    result['soil'] = latest.get('soil_20cm', 0)
    result['crack'] = latest.get('crack_width', 0)
    result['tilt'] = abs(latest.get('rotation_x', 0))
    result['vibration'] = latest.get('vibration', 0)
    
    print(f"[INFO] Current risk prediction: {result['risk_level']} (confidence: {result.get('confidence')}%)")
    
    return jsonify(result)

@app.route('/api/ml/forecast', methods=['GET'])
def forecast():
    """Get ML-based risk forecast for next hours using LATEST data"""
    hours = int(request.args.get('hours', 1))
    
    # Get last 30 readings for trend calculation
    readings = get_latest_readings(30)
    
    if len(readings) < 10:
        return jsonify({'error': f'Insufficient data for forecast. Need at least 10 readings, have {len(readings)}'}), 404
    
    print(f"[INFO] Forecast request - using {len(readings)} readings, predicting {hours} hours ahead")
    
    forecast_result = predict_future_risk_ml(readings, hours)
    
    if not forecast_result:
        return jsonify({'error': 'Could not generate ML forecast'}), 500
    
    return jsonify({
        'current': forecast_result['current_risk'],
        'forecast': {
            'predicted_risk': forecast_result['predicted_risk'],
            'hours_ahead': forecast_result['hours_ahead'],
            'trend_direction': forecast_result['trend_direction'],
            'method': forecast_result['method']
        },
        'readings_used': len(readings)
    })

@app.route('/api/ml/historical-risk', methods=['GET'])
def historical_risk():
    """Get ML model predictions for last N readings (for historical chart)"""
    limit = int(request.args.get('limit', 30))
    readings = get_latest_readings(limit)
    
    if not readings:
        return jsonify({'error': 'No sensor data available'}), 404
    
    results = []
    for reading in readings:
        pred = predict_risk(reading)
        results.append({
            'timestamp': reading.get('timestamp'),
            'risk_level': pred['risk_level'],
            'confidence': pred['confidence'],
            'soil': reading.get('soil_20cm', 0),
            'crack': reading.get('crack_width', 0),
            'tilt': abs(reading.get('rotation_x', 0)),
            'vibration': reading.get('vibration', 0)
        })
    
    # Keep chronological order for chart (oldest first)
    results.reverse()
    
    print(f"[INFO] Historical risk request - returning {len(results)} readings (oldest to newest)")
    
    return jsonify({
        'historical_risk': results,
        'total': len(results),
        'ml_model_used': type(model).__name__ if model else 'Rule-based'
    })

@app.route('/api/ml/feature-importance', methods=['GET'])
def feature_importance():
    """Get feature importance from trained ML model"""
    if model is None:
        default_importance = [
            {'feature': 'Soil20cm', 'importance': 0.35},
            {'feature': 'CrackWidth', 'importance': 0.25},
            {'feature': 'Rotation X', 'importance': 0.18},
            {'feature': 'Vibration', 'importance': 0.12},
            {'feature': 'Rotation Y', 'importance': 0.06},
            {'feature': 'Rotation Z', 'importance': 0.04}
        ]
        return jsonify({'feature_importance': default_importance, 'source': 'default'})
    
    if hasattr(model, 'feature_importances_'):
        importances = model.feature_importances_
        importance_list = [
            {'feature': FEATURES[i], 'importance': float(importances[i])}
            for i in range(len(FEATURES))
        ]
        importance_list.sort(key=lambda x: x['importance'], reverse=True)
        return jsonify({'feature_importance': importance_list, 'source': 'model'})
    elif hasattr(model, 'coef_'):
        coefs = np.abs(model.coef_).mean(axis=0)
        importance_list = [
            {'feature': FEATURES[i], 'importance': float(coefs[i])}
            for i in range(len(FEATURES))
        ]
        importance_list.sort(key=lambda x: x['importance'], reverse=True)
        return jsonify({'feature_importance': importance_list, 'source': 'coefficients'})
    
    return jsonify({'error': 'Feature importance not available'})

@app.route('/api/ml/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'model_type': type(model).__name__ if model else 'RuleBased',
        'fallback_mode': model is None,
        'features': FEATURES,
        'forecast_method': 'ML_model_on_predicted_features',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/ml/predict', methods=['POST'])
def predict_endpoint():
    """Predict risk from provided sensor data using ML model"""
    data = request.json
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    reading = {
        'rotation_x': data.get('rotation_x', 0),
        'rotation_y': data.get('rotation_y', 0),
        'rotation_z': data.get('rotation_z', 0),
        'vibration': data.get('vibration', 0),
        'soil_20cm': data.get('soil_20cm', 0),
        'crack_width': data.get('crack_width', 0)
    }
    
    result = predict_risk(reading)
    return jsonify(result)

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 SiteSense ML Service Starting...")
    print("="*60)
    print(f"📊 Firebase DB URL: {FIREBASE_DB_URL}")
    print(f"🤖 ML Model: {type(model).__name__ if model else 'Not loaded (using rule-based fallback)'}")
    print(f"📈 Features: {FEATURES}")
    print(f"🔮 Forecast Method: ML_model_on_predicted_features")
    
    # Test Firebase connection on startup
    print("\n[INFO] Testing Firebase connection...")
    test_reading = get_single_latest_reading()
    if test_reading:
        print(f"[OK] Firebase connected! Latest reading: {test_reading['timestamp']}")
        print(f"    Soil: {test_reading['soil_20cm']}%, Crack: {test_reading['crack_width']}mm")
    else:
        print("[WARN] No readings found in Firebase. Please load data first.")
    
    print("\n✅ Ready! Available endpoints:")
    print("   GET  /api/ml/current-risk - Current risk from LATEST reading")
    print("   GET  /api/ml/forecast?hours=X - ML-based forecast")
    print("   GET  /api/ml/historical-risk?limit=N - Historical ML predictions")
    print("   GET  /api/ml/feature-importance - Model explainability")
    print("   POST /api/ml/predict - Predict custom data")
    print("   GET  /api/ml/health - Health check")
    print("\n" + "="*60)
    
    app.run(host='0.0.0.0', port=5000, debug=False, use_reloader=False)