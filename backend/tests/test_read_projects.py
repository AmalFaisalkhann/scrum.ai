#!/usr/bin/env python3
"""
Simple script to read all documents from the 'projects' collection in Firestore
"""

import sys
import os
from agentic.utils.firebase_client import get_firestore

def read_all_projects():
    """Read and display all documents from the 'projects' collection"""
    try:
        # Get Firestore client
        db = get_firestore()
        print("✅ Successfully connected to Firestore")
        
        # Reference to the projects collection
        projects_ref = db.collection('projects')
        
        # Get all documents
        docs = projects_ref.stream()
        
        # Convert to list to check if empty
        docs_list = list(docs)
        
        if not docs_list:
            print("📭 No documents found in 'projects' collection")
            return
        
        print(f"📄 Found {len(docs_list)} document(s) in 'projects' collection:")
        print("=" * 50)
        
        # Iterate through documents
        for i, doc in enumerate(docs_list, 1):
            print(f"\n📋 Document {i}:")
            print(f"   ID: {doc.id}")
            print(f"   Data: {doc.to_dict()}")
            print("-" * 30)
            
    except FileNotFoundError as e:
        print(f"❌ Error: {e}")
        print("Make sure serviceAccountKey.json exists in the backend directory")
    except Exception as e:
        print(f"❌ Error reading from Firestore: {e}")
        print(f"Error type: {type(e).__name__}")

def read_specific_project(project_id):
    """Read a specific project by ID"""
    try:
        db = get_firestore()
        print(f"🔍 Looking for project with ID: {project_id}")
        
        # Get specific document
        doc_ref = db.collection('projects').document(project_id)
        doc = doc_ref.get()
        
        if doc.exists:
            print(f"✅ Found project '{project_id}':")
            print(f"   Data: {doc.to_dict()}")
        else:
            print(f"❌ Project '{project_id}' not found")
            
    except Exception as e:
        print(f"❌ Error reading project {project_id}: {e}")

if __name__ == "__main__":
    print("🚀 Firestore Projects Reader")
    print("=" * 30)
    
    if len(sys.argv) > 1:
        # If project ID provided as argument
        project_id = sys.argv[1]
        read_specific_project(project_id)
    else:
        # Read all projects
        read_all_projects() 