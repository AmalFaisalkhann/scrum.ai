#!/usr/bin/env python3
"""
Simple test script to verify Firebase connection
"""

import sys
import os

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_firebase_connection():
    """Test Firebase connection"""
    try:
        print("Testing Firebase connection...")
        
        # Import and test Firebase client
        from agentic.utils.firebase_client import get_firestore
        
        db = get_firestore()
        print("✅ Firebase client initialized successfully")
        
        # Test a simple Firestore operation
        test_collection = db.collection('test_connection')
        test_doc = test_collection.document('test_doc')
        
        # Try to read (this will fail if connection is bad)
        test_doc.get()
        print("✅ Firestore read operation successful")
        
        print("🎉 Firebase connection test passed!")
        return True
        
    except Exception as e:
        print(f"❌ Firebase connection test failed: {str(e)}")
        print(f"Error type: {type(e).__name__}")
        return False

if __name__ == "__main__":
    success = test_firebase_connection()
    sys.exit(0 if success else 1) 