import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv

# Debug: Print current working directory and .env file location
print(f"🔍 [Firebase] Current working directory: {os.getcwd()}")

# Try to load .env file with explicit path
env_path = os.path.join(os.getcwd(), '.env')
print(f"🔍 [Firebase] Looking for .env file at: {env_path}")
print(f"🔍 [Firebase] .env file exists: {os.path.exists(env_path)}")

load_dotenv(env_path)

# Debug: Check if environment variables are loaded
print(f"🔍 [Firebase] Environment variables after load_dotenv:")
print(f"  - GOOGLE_APPLICATION_CREDENTIALS: {os.getenv('GOOGLE_APPLICATION_CREDENTIALS', 'NOT SET')}")


service_account_info ={} #insert serviceAccountKey here 

if not firebase_admin._apps:
    try:
        print("🔍 [Firebase] Attempting to initialize with hardcoded credentials...")
        # First try with hardcoded credentials (the working ones)
        cred = credentials.Certificate(service_account_info)
        firebase_admin.initialize_app(cred)
        print("✅ [Firebase] Firebase initialized with hardcoded credentials")
    except Exception as e:
        print(f"⚠️  [Firebase] Hardcoded credentials failed: {e}")
        # Fallback to file-based credentials
        cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
        if not cred_path:
            current_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            cred_path = os.path.join(current_dir, "serviceAccountKey.json")
        
        print(f"🔍 [Firebase] Trying file-based credentials at: {cred_path}")
        print(f"🔍 [Firebase] Credentials file exists: {os.path.exists(cred_path)}")
        
        if not os.path.exists(cred_path):
            raise FileNotFoundError(f"Firebase service account key file not found at: {cred_path}")
        
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        print("✅ [Firebase] Firebase initialized with file-based credentials")

db = firestore.client()
print("✅ [Firebase] Firestore client created successfully")

def get_firestore():
    return db
