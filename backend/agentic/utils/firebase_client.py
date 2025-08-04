import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv

load_dotenv()

cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
if not cred_path:
    # Use the serviceAccountKey.json file in the backend directory
    current_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    cred_path = os.path.join(current_dir, "serviceAccountKey.json")

if not firebase_admin._apps:
    if not os.path.exists(cred_path):
        raise FileNotFoundError(f"Firebase service account key file not found at: {cred_path}")
    
    cred = credentials.Certificate(cred_path)
    # Initialize the Firebase Admin SDK
    firebase_admin.initialize_app(cred)

db = firestore.client()

def get_firestore():
    return db
