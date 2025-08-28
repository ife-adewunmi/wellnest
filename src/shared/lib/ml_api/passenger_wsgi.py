# Passenger WSGI entrypoint for FastAPI on shared hosting
# cPanel settings:
# - Application startup file: passenger_wsgi.py
# - Application entry point: application

import os
import sys
# Try the correct import for converting ASGI to WSGI
try:
    from a2wsgi import ASGIMiddleware
    ASGI_TO_WSGI_AVAILABLE = True
except ImportError:
    ASGI_TO_WSGI_AVAILABLE = False

# Ensure the module path includes the app directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

# Import FastAPI app
from app import app as fastapi_app

# Convert ASGI to WSGI
if ASGI_TO_WSGI_AVAILABLE:
    application = ASGIMiddleware(fastapi_app)
else:
    # Fallback: try direct assignment (some hosts support ASGI directly)
    application = fastapi_app
