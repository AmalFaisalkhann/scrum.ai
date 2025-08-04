from fastapi import FastAPI
import threading
import time
import os
import sys

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Initialize Firebase first
try:
    from agentic.utils.firebase_client import get_firestore
    db = get_firestore()
    print("✅ Firebase initialized successfully")
except Exception as e:
    print(f"❌ Firebase initialization failed: {e}")
    db = None

app = FastAPI()

# --- Firestore Listener Logic ---
def listen_for_project_state_changes():
    if not db:
        print("❌ Cannot start listener - Firebase not initialized")
        return
        
    def on_snapshot(col_snapshot, changes, read_time):
        for change in changes:
            if change.type.name == "ADDED":
                doc = change.document
                project_data = doc.to_dict()
                # Check if this is a new project with state
                if "state" in project_data and project_data["state"] == "new":
                    handle_new_project(doc.id, project_data)
            elif change.type.name == "MODIFIED":
                doc = change.document
                project_data = doc.to_dict()
                # Check if state changed to "running"
                if "state" in project_data and project_data["state"] == "running":
                    handle_running_project(doc.id, project_data)
    
    projects_ref = db.collection("projects")
    # Listen for changes in the 'projects' collection
    projects_ref.on_snapshot(on_snapshot)

def handle_new_project(project_id, project_data):
    """Handle when a new project is created with state 'new'"""
    print(f"\n[Listener] New project detected: {project_id}")
    # Extract relevant fields
    project_description = project_data.get("description") or project_data.get("name", "")
    team_info = [
        {
            "user": member.get("user", ""),
            "task": member.get("task", ""),
            "count": member.get("count", 0),
            "role": member.get("role", "Developer")
        }
        for member in project_data.get("team", [])
    ]
    
    # Update state to "running" to trigger the workflow
    db.collection("projects").document(project_id).update({
        "state": "running",
        "workflow_started_at": time.time()
    })

def handle_running_project(project_id, project_data):
    """Handle when a project state changes to 'running' - start the agentic workflow"""
    print(f"\n[Listener] Starting workflow for project: {project_id}")
    
    # For now, just mark as completed after a delay
    # In the full version, this would start the actual agentic workflow
    import threading
    
    def complete_project():
        time.sleep(5)  # Simulate workflow processing
        db.collection("projects").document(project_id).update({
            "state": "completed",
            "workflow_completed_at": time.time()
        })
        print(f"[Listener] Workflow complete for project {project_id}.")
    
    # Run workflow in background thread
    workflow_thread = threading.Thread(target=complete_project, daemon=True)
    workflow_thread.start()

# --- Start Firestore listener in background thread ---
def start_listener():
    if db:
        listener_thread = threading.Thread(target=listen_for_project_state_changes, daemon=True)
        listener_thread.start()
        print("✅ Firestore listener started")
    else:
        print("❌ Cannot start listener - Firebase not available")

start_listener()

@app.get("/")
def root():
    status = "connected" if db else "disconnected"
    return {
        "message": f"Scrum AI FastAPI backend is running. Firebase: {status}",
        "firebase_status": status
    }

@app.post("/api/projects/{project_id}/state")
async def update_project_state(project_id: str, state: str):
    """API endpoint to manually update project state"""
    if not db:
        return {"error": "Firebase not available"}
        
    valid_states = ["new", "running", "waiting", "completed"]
    if state not in valid_states:
        return {"error": f"Invalid state. Must be one of: {valid_states}"}
    
    try:
        db.collection("projects").document(project_id).update({
            "state": state,
            "state_updated_at": time.time()
        })
        return {"message": f"Project {project_id} state updated to {state}"}
    except Exception as e:
        return {"error": f"Failed to update project state: {str(e)}"}

@app.get("/api/projects/{project_id}/state")
async def get_project_state(project_id: str):
    """API endpoint to get current project state"""
    if not db:
        return {"error": "Firebase not available"}
        
    try:
        doc = db.collection("projects").document(project_id).get()
        if doc.exists:
            project_data = doc.to_dict()
            return {
                "project_id": project_id,
                "state": project_data.get("state", "unknown"),
                "state_updated_at": project_data.get("state_updated_at")
            }
        else:
            return {"error": "Project not found"}
    except Exception as e:
        return {"error": f"Failed to get project state: {str(e)}"}

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "firebase": "connected" if db else "disconnected",
        "timestamp": time.time()
    } 