#!/usr/bin/env python3
"""
Quick test to verify Firebase connection is working
"""

from agentic.utils.firebase_client import get_firestore

try:
    print("🔍 Testing Firebase connection...")
    db = get_firestore()
    
    # Get all documents from projects collection
    docs = list(db.collection('projects').stream())
    
    print(f"✅ Found {len(docs)} document(s) in 'projects' collection")
    
    if docs:
        print("\n📄 Document IDs:")
        for i, doc in enumerate(docs, 1):
            print(f"  {i}. {doc.id}")
            
        # Show first document data
        print(f"\n📋 First document data:")
        first_doc = docs[0]
        print(f"   ID: {first_doc.id}")
        print(f"   Data: {first_doc.to_dict()}")
    
    print("\n🎉 Firebase connection is working perfectly!")
    
except Exception as e:
    print(f"❌ Error: {e}")
    print(f"Error type: {type(e).__name__}") 