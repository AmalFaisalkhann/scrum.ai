#!/usr/bin/env python3
"""
Test script to verify Groq API key functionality
"""

import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq

def test_groq_api():
    print("🧪 Testing Groq API key...")
    print("=" * 50)
    
    # Load environment variables
    load_dotenv()
    
    # Get API key
    groq_api_key = os.getenv('GROQ_API_KEY')
    groq_model = os.getenv('GROQ_MODEL', 'llama3-8b-8192')
    
    print(f"🔍 API Key: {groq_api_key[:10]}..." if groq_api_key else "❌ NOT SET")
    print(f"🔍 Model: {groq_model}")
    
    if not groq_api_key:
        print("❌ GROQ_API_KEY is not set")
        return False
    
    try:
        # Create Groq client
        print("🔍 Creating Groq client...")
        llm = ChatGroq(
            model_name=groq_model,
            temperature=0.2,
            api_key=groq_api_key
        )
        print("✅ Groq client created successfully")
        
        # Test API call
        print("🔍 Testing API call...")
        test_prompt = "Say 'Hello, this is a test' and nothing else."
        response = llm.invoke(test_prompt)
        
        print(f"✅ API call successful!")
        print(f"🔍 Response: {response.content}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print(f"🔍 Error type: {type(e).__name__}")
        
        # Check if it's an authentication error
        if "401" in str(e) or "Invalid API Key" in str(e):
            print("🔍 This appears to be an authentication error.")
            print("🔍 Please check:")
            print("  1. Your Groq API key is correct")
            print("  2. Your Groq API key is not expired")
            print("  3. You have sufficient credits in your Groq account")
            print("  4. The API key has the correct permissions")
        
        return False

if __name__ == "__main__":
    success = test_groq_api()
    if success:
        print("\n🎉 Groq API test passed!")
    else:
        print("\n💥 Groq API test failed!")
        exit(1) 