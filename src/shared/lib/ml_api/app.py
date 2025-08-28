import os
import sys
from typing import Any, Dict, List, Optional, Union
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load required packages for model loading
try:
    import pickle
    import numpy as np
    BASIC_PACKAGES_AVAILABLE = True
    logger.info("Basic model loading packages loaded successfully")
except ImportError as e:
    logger.error(f"CRITICAL: Basic packages not available: {e}. API will not function properly.")
    pickle = None
    np = None
    BASIC_PACKAGES_AVAILABLE = False

# Try to load pandas (optional - we can fall back to numpy)
try:
    import pandas as pd
    PANDAS_AVAILABLE = True
    logger.info("Pandas loaded successfully")
except ImportError:
    pd = None
    PANDAS_AVAILABLE = False
    logger.warning("Pandas not available - will use numpy arrays as fallback")

app = FastAPI(title="WellNest ML API", version="1.0.0")

# CORS configuration
ALLOWED_ORIGIN = os.getenv("ALLOWED_ORIGIN", "*")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[ALLOWED_ORIGIN] if ALLOWED_ORIGIN != "*" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictRequest(BaseModel):
    """Simplified prediction request model - accepts any JSON structure"""
    class Config:
        extra = "allow"  # Allow any additional fields

class PredictResponse(BaseModel):
    """Standardized prediction response"""
    prediction: float
    proba: Optional[float] = None
    stress_level: Optional[float] = None

# Global model instance
_model = None
_model_loaded = False

# Model configuration - FIX: Use correct filename
MODEL_PATH = os.getenv("MODEL_PATH", "model.pkl")  # Changed from Mental_stress.pkl
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FULL_MODEL_PATH = os.path.join(BASE_DIR, MODEL_PATH)

def load_model():
    """Load the ML model from disk using pickle. Called once at startup."""
    global _model, _model_loaded
    
    if _model_loaded:
        return _model
    
    try:
        if not BASIC_PACKAGES_AVAILABLE:
            logger.error("CRITICAL: Required packages not available. Model cannot be loaded.")
            _model = None
        elif not os.path.exists(FULL_MODEL_PATH):
            logger.error(f"CRITICAL: Model file not found at {FULL_MODEL_PATH}")
            _model = None
        else:
            logger.info(f"Loading model from {FULL_MODEL_PATH} using pickle")
            with open(FULL_MODEL_PATH, 'rb') as model_file:
                _model = pickle.load(model_file)
            logger.info(f"Model loaded successfully. Type: {type(_model)}")
            
            # Validate the loaded model
            if not hasattr(_model, 'predict'):
                logger.error("CRITICAL: Loaded model does not have predict method")
                _model = None
            else:
                logger.info("Model validation successful")
                
    except Exception as e:
        logger.error(f"CRITICAL: Error loading model: {e}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        _model = None
    finally:
        _model_loaded = True
    
    return _model


@app.on_event("startup")
async def startup_event():
    """Initialize the application on startup"""
    logger.info("Starting WellNest ML API...")
    model = load_model()
    if model is None:
        logger.error("WARNING: Model failed to load at startup")
    else:
        logger.info("Model loaded successfully at startup")
    logger.info("Startup complete")


@app.get("/")
async def root():
    return {"service": "WellNest ML API", "status": "ok"}


@app.get("/healthz")
async def healthz():
    model_status = "loaded" if _model is not None else "not_loaded"
    return {"status": "ok", "model_status": model_status}


@app.post("/predict")
async def predict(request: Dict[str, Any]):
    """
    Unified prediction endpoint that accepts JSON directly and uses the ML model.
    
    Accepts:
    - Direct feature object: {"Gender": "Female", "SME": 8.0, ...}
    - Features array: {"features": [1.0, 2.0, 3.0, ...]}
    
    Returns:
    - Dict with prediction, proba, and stress_level from the actual ML model
    """
    try:
        logger.info(f"Received prediction request: {request}")
        
        # FIX: Use the global model that was loaded at startup
        global _model
        
        # If model not loaded at startup, try to load it now
        if _model is None:
            logger.warning("Model not loaded at startup, attempting to load now...")
            load_model()
        
        # Ensure model is loaded
        if _model is None:
            logger.error("ML model is not loaded")
            raise HTTPException(status_code=500, detail="ML model is not available. Please check server configuration.")
        
        if not hasattr(_model, 'predict'):
            logger.error("Loaded model does not have predict method")
            raise HTTPException(status_code=500, detail="Invalid ML model loaded")
        
        # Extract features from the request
        features = extract_features_from_request(request)
        logger.info(f"Extracted features: {features}")
        
        if not features or len(features) == 0:
            raise HTTPException(status_code=400, detail="No valid features could be extracted from request")
        
        # Use the loaded model for prediction
        result = predict_with_model(features)
        logger.info(f"Model prediction successful: {result}")
        
        # Convert PredictResponse to dict for JSON serialization
        response_dict = {
            "prediction": result.prediction,
            "proba": result.proba,
            "stress_level": result.stress_level
        }
        
        return response_dict
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        logger.error(f"Prediction endpoint error: {e}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


def extract_features_from_request(request: Union[Dict[str, Any], List]) -> Dict[str, Any]:
    """
    Extract features in the exact format the model expects.
    
    The model expects a DataFrame-like structure with these columns:
    - 'Social Media Usage (hours/day)' (numeric)
    - 'Sleep Duration (hours/night)' (numeric) 
    - 'Screen Time Before Sleep (hours)' (numeric)
    - 'sleep_to_screen_ratio' (numeric)
    - 'Dominant Daily Emotion' (categorical)
    
    Args:
        request: Can be dict with features or dict with feature object
        
    Returns:
        Dict with the exact features the model expects
    """
    if isinstance(request, list):
        # For direct arrays, we can't map to named features properly
        raise ValueError("Direct feature arrays not supported. Please use named feature format.")
    
    if isinstance(request, dict):
        # Check if it's a pre-formatted features array
        if "features" in request and isinstance(request["features"], list):
            raise ValueError("Raw features array not supported. Please use named feature format.")
        
        # Extract the exact features the model expects
        features = {
            'Social Media Usage (hours/day)': float(request.get('Social Media Usage (hours/day)', 0.0)),
            'Sleep Duration (hours/night)': float(request.get('Sleep Duration (hours/night)', 8.0)),
            'Screen Time Before Sleep (hours)': float(request.get('Screen Time Before Sleep (hours)', 0.0)),
            'sleep_to_screen_ratio': float(request.get('sleep_to_screen_ratio', 1.0)),
            'Dominant Daily Emotion': str(request.get('Dominant Daily Emotion', 'Neutral'))
        }
        
        logger.info(f"Extracted model features: {features}")
        return features
    
    # Fallback
    raise ValueError("Invalid request format. Please provide a dictionary with named features.")


def encode_categorical_feature(feature_name: str, value: str) -> float:
    """
    Encode categorical string features to numeric values.
    
    Args:
        feature_name: Name of the feature (for context-specific encoding)
        value: String value to encode
        
    Returns:
        Numeric representation of the categorical value
    """
    value_lower = value.lower().strip()
    
    # Gender encoding
    if 'gender' in feature_name.lower():
        return 1.0 if value_lower == 'male' else 0.0
    
    # Emotion encoding
    if 'emotion' in feature_name.lower():
        emotion_mapping = {
            'happy': 4.0,
            'neutral': 3.0,
            'sad': 2.0,
            'anxious': 1.0,
            'angry': 0.0
        }
        return emotion_mapping.get(value_lower, 2.0)  # Default to neutral
    
    # Boolean-like strings
    if value_lower in ['yes', 'true', '1']:
        return 1.0
    elif value_lower in ['no', 'false', '0']:
        return 0.0
    
    # Try to convert to float directly
    try:
        return float(value)
    except ValueError:
        # For unknown strings, use a simple hash-based encoding
        return float(len(value) % 10)


def predict_with_model(features: Dict[str, Any]) -> PredictResponse:
    """
    Make prediction using the loaded ML model.
    
    Args:
        features: Dictionary with named features for the model
        
    Returns:
        PredictResponse with prediction results
    """
    # FIX: Check global model instead of just packages
    global _model
    
    if not BASIC_PACKAGES_AVAILABLE:
        raise ValueError("Required packages not available")
    
    if _model is None:
        raise ValueError("Model not available")
    
    try:
        # Convert features dict to format suitable for sklearn pipeline
        if PANDAS_AVAILABLE:
            # Use DataFrame (preferred)
            X = pd.DataFrame([features])
            logger.info(f"Making prediction with DataFrame shape: {X.shape}")
            logger.info(f"DataFrame columns: {list(X.columns)}")
        else:
            # Fallback: try to create a structured array
            # This may not work with all sklearn pipelines, but worth trying
            feature_values = [list(features.values())]
            X = np.array(feature_values)
            logger.info(f"Making prediction with numpy array shape: {X.shape}")
        
        logger.info(f"Input features: {features}")
        
        # Make prediction
        prediction = float(_model.predict(X)[0])
        logger.info(f"Raw prediction: {prediction}")
        
        # Try to get prediction probability if available
        proba = None
        if hasattr(_model, 'predict_proba'):
            try:
                proba_array = _model.predict_proba(X)[0]
                proba = float(proba_array.max())
                logger.info(f"Prediction probability: {proba}")
            except Exception as e:
                logger.warning(f"Could not get prediction probability: {e}")
        
        return PredictResponse(
            prediction=prediction,
            proba=proba,
            stress_level=prediction  # Assuming prediction represents stress level
        )
        
    except Exception as e:
        logger.error(f"Model prediction error: {e}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise ValueError(f"Model prediction failed: {e}")


if __name__ == "__main__":
    # Optional: local dev only; not used on shared hosting
    try:
        import uvicorn  # type: ignore
        uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
    except Exception:
        pass