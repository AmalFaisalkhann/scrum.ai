import os
from dotenv import load_dotenv
import sys

# LangChain LLM wrappers
from langchain_groq import ChatGroq
from langchain_community.chat_models import ChatOllama

# Debug: Print current working directory and .env file location
print(f"🔍 Current working directory: {os.getcwd()}")
print(f"🔍 Python executable: {sys.executable}")

# Try to load .env file with explicit path
env_path = os.path.join(os.getcwd(), '.env')
print(f"🔍 Looking for .env file at: {env_path}")
print(f"🔍 .env file exists: {os.path.exists(env_path)}")

# Load .env file
load_dotenv(env_path)

# Debug: Check if environment variables are loaded
print(f"🔍 Environment variables after load_dotenv:")
print(f"  - GROQ_API_KEY: {'SET' if os.getenv('GROQ_API_KEY') else 'NOT SET'}")
print(f"  - PINECONE_API_KEY: {'SET' if os.getenv('PINECONE_API_KEY') else 'NOT SET'}")
print(f"  - LLM_PROVIDER: {os.getenv('LLM_PROVIDER', 'NOT SET')}")
print(f"  - GROQ_MODEL: {os.getenv('GROQ_MODEL', 'NOT SET')}")

# If GROQ_API_KEY is not set, try alternative loading methods
if not os.getenv('GROQ_API_KEY'):
    print("⚠️  GROQ_API_KEY not found, trying alternative loading methods...")
    
    # Try loading from parent directory
    parent_env_path = os.path.join(os.path.dirname(os.getcwd()), '.env')
    print(f"🔍 Trying parent directory .env: {parent_env_path}")
    print(f"🔍 Parent .env exists: {os.path.exists(parent_env_path)}")
    
    if os.path.exists(parent_env_path):
        load_dotenv(parent_env_path)
        print(f"🔍 GROQ_API_KEY after parent load: {'SET' if os.getenv('GROQ_API_KEY') else 'NOT SET'}")
    
    # Try loading from current directory without explicit path
    load_dotenv()
    print(f"🔍 GROQ_API_KEY after default load: {'SET' if os.getenv('GROQ_API_KEY') else 'NOT SET'}")

def load_model():
    """
    Load LLM from Groq or Ollama based on environment config.
    Returns a LangChain-compatible chat model.
    """
    provider = os.getenv("LLM_PROVIDER", "groq")
    print(f"🔍 Loading model with provider: {provider}")

    if provider == "groq":
        groq_api_key = os.getenv("GROQ_API_KEY")
        groq_model = os.getenv("GROQ_MODEL", "mixtral-8x7b-32768")
        
        print(f"🔍 Groq configuration:")
        print(f"  - API Key: {'SET' if groq_api_key else 'NOT SET'}")
        print(f"  - Model: {groq_model}")
        
        if not groq_api_key:
            print("❌ GROQ_API_KEY is not set. Please check your .env file.")
            print("🔍 Available environment variables:")
            for key, value in os.environ.items():
                if 'API' in key.upper() or 'KEY' in key.upper():
                    print(f"  - {key}: {'SET' if value else 'NOT SET'}")
            raise ValueError("GROQ_API_KEY is not set.")
        
        print(f"🔌 Loading Groq model: {groq_model}")
        try:
            model = ChatGroq(
                model_name=groq_model,
                temperature=0.2,
                api_key=groq_api_key
            )
            print("✅ Groq model loaded successfully")
            return model
        except Exception as e:
            print(f"❌ Error loading Groq model: {e}")
            raise

    elif provider == "ollama":
        ollama_model = os.getenv("OLLAMA_MODEL", "deepseek-coder:14b-instruct-fp16")
        print(f"💻 Loading Ollama model: {ollama_model}")
        return ChatOllama(
            model=ollama_model,
            temperature=0.2
        )

    else:
        raise ValueError(f"Unknown LLM provider: {provider}")
