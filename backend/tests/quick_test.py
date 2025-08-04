#!/usr/bin/env python3
"""
Quick test to verify new service account key works
"""

import firebase_admin
from firebase_admin import credentials, firestore
import os

def quick_test():
    print("🚀 Quick Firebase Test")
    print("=" * 25)
    
    # Check if already initialized
    if firebase_admin._apps:
        print("⚠️  Firebase already initialized, reinitializing...")
        firebase_admin.delete_app(firebase_admin.get_app())
    
    try:
        # Initialize with new credentials
        cred = credentials.Certificate("serviceAccountKey.json")
        app = firebase_admin.initialize_app(cred)
        print("✅ Firebase initialized successfully")
        
        # Test Firestore connection
        db = firestore.client()
        print("✅ Firestore client created")
        
        # Try a simple read operation
        print("🔍 Testing read operation...")
        projects_ref = db.collection('projects')
        docs = list(projects_ref.limit(1).stream())
        print(f"✅ Successfully read {len(docs)} document(s)")
        
        if docs:
            print(f"📄 Sample document ID: {docs[0].id}")
        
        print("\n🎉 All tests passed! Your Firebase connection is working.")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print(f"Error type: {type(e).__name__}")

if __name__ == "__main__":
    quick_test() 