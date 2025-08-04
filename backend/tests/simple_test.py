#!/usr/bin/env python3
"""
Simple test to quickly check Firebase connection
"""

import firebase_admin
from firebase_admin import credentials, firestore
import threading
import time

def timeout_handler():
    print("❌ Operation timed out after 10 seconds")
    import os
    os._exit(1)

# Set a 10-second timeout
timer = threading.Timer(10.0, timeout_handler)
timer.start()

try:
    print("🚀 Testing Firebase connection...")
    
    # Clear any existing apps
    if firebase_admin._apps:
        firebase_admin.delete_app(firebase_admin.get_app())
    
    # Use the same credentials as your test_hardcoded.py
    service_account_info = {
        "type": "service_account",
        "project_id": "scrum-92451",
        "private_key_id": "68a349c98a9acfee60a078593515cfe9bd4595dc",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCmf+fyCXuarZPA\nlJ397JtGPsqrf5C+eBPu5uyGIZqBAvdlUozUHR27bpE9RRH1wATSRcZOWpYN4ZTz\n9oiBhZTGYoniVAvTLoEocQ0mryem/qxTtDh2dF5tYJ9M+i+vKKhEI+u9D+d4Ewqc\nVAKD5TTBmSH5HNQ/Y4TWjSvWyDyrxldFPIqcZnUB/p7XdFYr0RwOZZC8O/25QfU5\nucb8FllpSPYgOnpdGecxZQd24gwUXmQo3b5OJGN7GQPHiU0BdC9YFKR3lNpFTkRE\neMf9bjiqRLYHoWoo1SbWJAtRj9be3sNgkhPcKpH4i3wP4dXfB68vK2FR/KlbvNmo\nnPBvnJa9AgMBAAECggEAKnPWagos7+VuFN5P4lyfwqtj9ZJTD52CR5mtmQ2cXWSq\nO7Vunu7Fk/K/KYYg7C4HjK2pwHSsaeGonwOvDodGxcZ+La0MTs4+tFcO6Vwjmhq5\nSaZb9yf4o57NP01TNzAAp08ZXl1dwWnpfK6W7ZZVez9WQDQvkfIH/sSD9wGbJpjE\ngTQLcqLclAri7CJG4277DY37V4wAzIC84HcOKC4xnXzLL87bm8DJtopGrXB83Zmy\nCoBGogZx8H0MohIWdYdaPNrgF4yBylCtIduN7qxZoYGvCwfZaZXHySrRm8Z+6d40\nBJhewoVfNzDzcrpps7QfKVzcDcmJxBg2VWpc4JbIaQKBgQDRMdhsPHl5gosbuuo9\nDXFtdEHePE4SxnNIeu4rQUH1gGzQi3nHWLeTfWGY0ljWF3WjYxEwMnwHQGoQhQ7p\nRQZoChoaQ6B/KAydESsZNaLJvN4t8V6w8ap5HKiSDxLotRZQQrslZbISlwwK9z3A\n09pW1HyjT+1avImeUJw9j8wHDwKBgQDLwJetJfMPrQ1fhb1vh2FURCWVToQ75HmI\n6IdNLgBU5pYXuPAzZAmCQZJpeAdCs8ryCg+UK5L5TtRgI2XSYllgKoLAlUJQp0Dd\nbPVCCM8i2X6q8dijznsmV00qC5wM49BjJAXh4vdSbEABqYqNXdEavpHbeWEnf/KD\nSwAkiQvlcwKBgF0LO4RgnXLjEjZCO37uJL4XEFjlH6CQLaRWMOqCOvETrtJOxtpY\nZkYuZSNQo3yNsJ/8Jx/1xF6BUuuIEurD7aaGn7eAzrjfukR951puFbp+y59JlOFE\ni5sUmRFlrPZd3M/T7mMiyUIldpDGCOxkDd/C4LDOkvZhlyAYIHXtKEUXAoGBAJBS\nQd2GdO1UoZVYsP8PwLQkdQ6WB/o4cpG0Syoy/E8m6YeyGon8QPP/qEqGl3X6zjS1\nRaWpW7i1yp6yVAw6V55TXjw1PTzNy5dL90kn3jiMIDnLhq04s2hMDD9M6+MBdvjS\nakw/LPo37PqAccCChHvSIpR4HIYTDd9Lv7UhUcjbAoGBALdpyqKlVczmBoDiNvdo\n34ZwJPdEryJpn1tGd9tJQLjHaB/XRJLM9LM4Hzdrz+UBg3887XELgcfDueuCfACK\nkeHhugoZvgsfWc5Obg8eSdX/cZMxU2rlhvywQNDVxG0Bg+JvPcDSgECqvf/HrV/v\nITs3HocdCJNEbCQuMo0ClnRd\n-----END PRIVATE KEY-----\n",
        "client_email": "firebase-adminsdk-fbsvc@scrum-92451.iam.gserviceaccount.com",
        "client_id": "106014544502345898090",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40scrum-92451.iam.gserviceaccount.com",
        "universe_domain": "googleapis.com"
    }
    
    # Initialize Firebase
    cred = credentials.Certificate(service_account_info)
    app = firebase_admin.initialize_app(cred)
    print("✅ Firebase initialized successfully")
    
    # Test Firestore
    db = firestore.client()
    print("✅ Firestore client created")
    
    # Try a simple operation
    print("🔍 Testing read operation...")
    projects_ref = db.collection('projects')
    docs = list(projects_ref.limit(1).stream())
    
    # Cancel the timer since we succeeded
    timer.cancel()
    
    print(f"✅ Successfully read {len(docs)} document(s)")
    if docs:
        print(f"📄 Sample document ID: {docs[0].id}")
    
    print("\n🎉 SUCCESS! Your Firebase connection is working!")
    
except Exception as e:
    timer.cancel()  # Cancel the timer
    print(f"❌ Error: {e}")
    print(f"Error type: {type(e).__name__}")
    
    if "Invalid JWT Signature" in str(e):
        print("\n🔍 This confirms the JWT signature issue persists.")
        print("💡 The problem is with the service account key itself.")
        print("   Try generating a completely new key from a different account.") 