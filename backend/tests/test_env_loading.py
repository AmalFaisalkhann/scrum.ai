#!/usr/bin/env python3
"""
Test script to verify .env file loading and API key availability
"""

import os
import sys
from dotenv import load_dotenv

def test_env_loading():
    print("🧪 Testing .env file loading...")
    print("=" * 50)
    
    # Print current working directory
    print(f"🔍 Current working directory: {os.getcwd()}")
    print(f"🔍 Python executable: {sys.executable}")
    
    # Check for .env file
    env_path = os.path.join(os.getcwd(), '.env')
    print(f"🔍 Looking for .env file at: {env_path}")
    print(f"🔍 .env file exists: {os.path.exists(env_path)}")
    
    if os.path.exists(env_path):
        print(f"🔍 .env file size: {os.path.getsize(env_path)} bytes")
        
        # Show first few lines of .env file (without revealing full API keys)
        with open(env_path, 'r') as f:
            lines = f.readlines()
            print(f"🔍 .env file has {len(lines)} lines")
            for i, line in enumerate(lines[:3]):  # Show first 3 lines
                if '=' in line:
                    key, value = line.strip().split('=', 1)
                    print(f"  Line {i+1}: {key}={value[:10]}..." if len(value) > 10 else f"  Line {i+1}: {key}={value}")
    
    # Load .env file
    print("\n🔍 Loading .env file...")
    load_dotenv(env_path)
    
    # Check environment variables
    print("\n🔍 Environment variables after load_dotenv:")
    env_vars = {
        'GROQ_API_KEY': os.getenv('GROQ_API_KEY'),
        'PINECONE_API_KEY': os.getenv('PINECONE_API_KEY'),
        'LLM_PROVIDER': os.getenv('LLM_PROVIDER'),
        'GROQ_MODEL': os.getenv('GROQ_MODEL'),
        'OLLAMA_MODEL': os.getenv('OLLAMA_MODEL'),
        'GOOGLE_APPLICATION_CREDENTIALS': os.getenv('GOOGLE_APPLICATION_CREDENTIALS'),
        'OPENAI_API_KEY': os.getenv('OPENAI_API_KEY')
    }
    
    for key, value in env_vars.items():
        if value:
            # Show first 10 characters of API keys for verification
            display_value = value[:10] + "..." if len(value) > 10 else value
            print(f"  ✅ {key}: {display_value}")
        else:
            print(f"  ❌ {key}: NOT SET")
    
    # Test API key validation
    print("\n🔍 API Key validation:")
    groq_key = os.getenv('GROQ_API_KEY')
    if groq_key:
        if groq_key.startswith('gsk_'):
            print("  ✅ GROQ_API_KEY format looks correct (starts with 'gsk_')")
        else:
            print("  ⚠️  GROQ_API_KEY format may be incorrect (should start with 'gsk_')")
    else:
        print("  ❌ GROQ_API_KEY is not set")
    
    pinecone_key = os.getenv('PINECONE_API_KEY')
    if pinecone_key:
        if pinecone_key.startswith('pcsk_'):
            print("  ✅ PINECONE_API_KEY format looks correct (starts with 'pcsk_')")
        else:
            print("  ⚠️  PINECONE_API_KEY format may be incorrect (should start with 'pcsk_')")
    else:
        print("  ❌ PINECONE_API_KEY is not set")
    
    print("\n" + "=" * 50)
    
    # Test model loading
    print("🧪 Testing model loading...")
    try:
        from agentic.utils.model_loader import load_model
        print("✅ Model loader imported successfully")
        
        model = load_model()
        print("✅ Model loaded successfully")
        print(f"🔍 Model type: {type(model)}")
        
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return False
    
    return True

if __name__ == "__main__":
    success = test_env_loading()
    if success:
        print("\n🎉 All tests passed! Environment is configured correctly.")
    else:
        print("\n💥 Tests failed. Please check your configuration.")
        sys.exit(1) 