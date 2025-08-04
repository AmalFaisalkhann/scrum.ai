#!/usr/bin/env python3
"""
Diagnostic script to test Firebase authentication and identify issues
"""

import json
import os
from datetime import datetime
from agentic.utils.firebase_client import get_firestore

def test_firebase_connection():
    """Test Firebase connection and provide detailed error information"""
    print("🔍 Firebase Authentication Diagnostic")
    print("=" * 40)
    
    # Check if service account file exists
    cred_path = os.path.join(os.getcwd(), "serviceAccountKey.json")
    print(f"📁 Service account file path: {cred_path}")
    print(f"📁 File exists: {os.path.exists(cred_path)}")
    
    if not os.path.exists(cred_path):
        print("❌ Service account file not found!")
        return
    
    # Check file size
    file_size = os.path.getsize(cred_path)
    print(f"📏 File size: {file_size} bytes")
    
    # Try to read and validate JSON
    try:
        with open(cred_path, 'r') as f:
            cred_data = json.load(f)
        
        print("✅ JSON is valid")
        print(f"📋 Project ID: {cred_data.get('project_id', 'NOT FOUND')}")
        print(f"📧 Client Email: {cred_data.get('client_email', 'NOT FOUND')}")
        
        # Check required fields
        required_fields = ['type', 'project_id', 'private_key', 'client_email']
        missing_fields = [field for field in required_fields if field not in cred_data]
        
        if missing_fields:
            print(f"❌ Missing required fields: {missing_fields}")
            return
        else:
            print("✅ All required fields present")
            
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON: {e}")
        return
    except Exception as e:
        print(f"❌ Error reading file: {e}")
        return
    
    # Test Firebase connection
    print("\n🚀 Testing Firebase connection...")
    try:
        db = get_firestore()
        print("✅ Firebase client created successfully")
        
        # Try a simple operation
        print("🔍 Testing simple Firestore operation...")
        projects_ref = db.collection('projects')
        
        # Set a timeout for the operation
        import signal
        
        def timeout_handler(signum, frame):
            raise TimeoutError("Operation timed out")
        
        # Try to get documents with a shorter timeout
        try:
            docs = list(projects_ref.limit(1).stream())
            print(f"✅ Successfully read {len(docs)} document(s)")
            if docs:
                print(f"📄 Sample document ID: {docs[0].id}")
        except Exception as e:
            print(f"❌ Error reading documents: {e}")
            print(f"Error type: {type(e).__name__}")
            
    except Exception as e:
        print(f"❌ Error creating Firebase client: {e}")
        print(f"Error type: {type(e).__name__}")

def suggest_solutions():
    """Provide solutions based on common Firebase auth issues"""
    print("\n💡 Suggested Solutions:")
    print("=" * 30)
    print("1. 🔑 Generate a new service account key:")
    print("   - Go to Firebase Console > Project Settings > Service Accounts")
    print("   - Click 'Generate new private key'")
    print("   - Download and replace your serviceAccountKey.json")
    print()
    print("2. 🔐 Check service account permissions:")
    print("   - Ensure the service account has 'Firebase Admin' role")
    print("   - Or at least 'Cloud Datastore User' role")
    print()
    print("3. 🌐 Verify project ID:")
    print("   - Make sure the project_id in serviceAccountKey.json matches your Firebase project")
    print()
    print("4. ⏰ Check if key is expired:")
    print("   - Service account keys can expire")
    print("   - Generate a new key if this one is old")
    print()
    print("5. 🔒 Check Firestore rules:")
    print("   - Ensure Firestore security rules allow read access")
    print("   - Test with a simple read operation first")

if __name__ == "__main__":
    test_firebase_connection()
    suggest_solutions() 