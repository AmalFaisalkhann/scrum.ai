import os
from pinecone import Pinecone, ServerlessSpec

def init_pinecone(index_name="projectembeddings"):
    print(f"🔍 Initializing Pinecone with index: {index_name}")
    
    pinecone_api_key = os.getenv("PINECONE_API_KEY")
    print(f"🔍 PINECONE_API_KEY: {'SET' if pinecone_api_key else 'NOT SET'}")
    
    if not pinecone_api_key:
        print("❌ PINECONE_API_KEY is not set. Please check your .env file.")
        raise ValueError("PINECONE_API_KEY is not set.")
    
    try:
        pc = Pinecone(api_key=pinecone_api_key)
        print("✅ Pinecone client initialized successfully")
        
        # Check if index exists, if not create it
        existing_indexes = pc.list_indexes().names()
        print(f"🔍 Existing indexes: {existing_indexes}")
        
        if index_name not in existing_indexes:
            print(f"🔍 Creating new index: {index_name}")
            pc.create_index(
                name=index_name,
                dimension=384,  # MiniLM dimension
                metric='cosine'
            )
            print(f"✅ Index {index_name} created successfully")
        else:
            print(f"✅ Index {index_name} already exists")
        
        index = pc.Index(index_name)
        print(f"✅ Successfully connected to index: {index_name}")
        return index
        
    except Exception as e:
        print(f"❌ Error initializing Pinecone: {e}")
        raise
