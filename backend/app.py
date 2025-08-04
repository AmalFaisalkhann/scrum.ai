from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import threading
from agent.agenticworkflow import ScrumGraphBuilder
from agentic.utils.firebase_client import get_firestore
import time

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db = get_firestore()

# --- Firestore Listener Logic ---
def listen_for_project_state_changes():
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
    
    # Extract project information
    project_name = project_data.get("name", "")
    project_description = project_data.get("description", "")
    
    # Get real developer profiles from the project
    dev_profiles = []
    try:
        dev_profiles_ref = db.collection("projects").document(project_id).collection("dev_profiles")
        dev_docs = dev_profiles_ref.stream()
        
        for dev_doc in dev_docs:
            dev_data = dev_doc.to_dict()
            dev_profiles.append({
                "id": dev_data.get("id"),
                "name": dev_data.get("name"),
                "email": dev_data.get("email"),
                "role": dev_data.get("role"),
                "user_id": dev_data.get("user_id"),
                "tech": dev_data.get("tech", []),
                "experience_years": dev_data.get("experience_years", 1)
            })
        
        print(f"[Listener] Found {len(dev_profiles)} developer profiles")
        for dev in dev_profiles:
            print(f"  - {dev['name']} ({dev['email']}) - {dev['role']}")
            
    except Exception as e:
        print(f"[Listener] Error fetching developer profiles: {e}")
        # Fallback to empty profiles
        dev_profiles = []
    
    # Store developer profiles in the main project document for workflow access
    db.collection("projects").document(project_id).update({
        "dev_profiles": dev_profiles,
        "project_name": project_name,
        "project_description": project_description
    })
    
    # Update state to "running" to trigger the workflow
    db.collection("projects").document(project_id).update({
        "state": "running",
        "workflow_started_at": time.time()
    })

def handle_running_project(project_id, project_data):
    """Handle when a project state changes to 'running' - start the agentic workflow"""
    print(f"\n[Listener] Starting workflow for project: {project_id}")
    
    # Extract project information
    project_name = project_data.get("name", "")
    project_description = project_data.get("description", "")
    dev_profiles = project_data.get("dev_profiles", [])
    
    print(f"[Listener] Project: {project_name}")
    print(f"[Listener] Description: {project_description[:100]}...")
    print(f"[Listener] Developers: {len(dev_profiles)}")
    
    # Create a comprehensive project description for the workflow
    full_description = f"""
Project Title: {project_name}

Project Description:
{project_description}

Team Members:
{chr(10).join([f"- {dev['name']} ({dev['email']}) - {dev['role']} - Experience: {dev['experience_years']} years" for dev in dev_profiles])}

Tech Stack: {', '.join(set([tech for dev in dev_profiles for tech in dev.get('tech', [])]))}
"""
    
    # --- Run the agentic workflow ---
    workflow = ScrumGraphBuilder()
    graph = workflow()
    initial_state = {
        "project_id": project_id,
        "project_description": full_description,
        "dev_profiles": dev_profiles,
        "scrum_cycle": 0,
        "done": False
    }
    
    NUM_CYCLES = 3
    state = initial_state
    
    try:
        for cycle in range(NUM_CYCLES):
            print(f"\n[Listener] Running cycle {cycle} for project {project_id}")
            if cycle == 0:
                state = graph.invoke(state)
            else:
                state = graph.invoke({**state, "next_node": "GatherContext"})
            # Optionally, fetch standups or other info here
            state = graph.invoke({**state, "done": False})
        
        # Write results back to Firestore (e.g., summary)
        for cycle in range(NUM_CYCLES):
            scrum_cycle_doc = db.collection("projects").document(project_id).collection("scrum_cycles").document(f"cycle_{cycle}").get()
            if scrum_cycle_doc.exists:
                summary = scrum_cycle_doc.to_dict().get("summary", "No summary found.")
                db.collection("projects").document(project_id).update({f"cycle_{cycle}_summary": summary})
        
        # Update project state to "completed"
        db.collection("projects").document(project_id).update({
            "state": "completed",
            "workflow_completed_at": time.time()
        })
        
        print(f"[Listener] Workflow completed for project {project_id}")
        
    except Exception as e:
        print(f"[Listener] Error in workflow for project {project_id}: {e}")
        # Update project state to "error"
        db.collection("projects").document(project_id).update({
            "state": "error",
            "error_message": str(e),
            "workflow_error_at": time.time()
        })

def start_listener():
    """Start the Firestore listener in a separate thread"""
    listener_thread = threading.Thread(target=listen_for_project_state_changes, daemon=True)
    listener_thread.start()
    print("Firestore listener started")

# Start the listener when the app starts
start_listener()

@app.get("/")
def root():
    return {"message": "Scrum AI Backend is running"}

@app.post("/api/projects/{project_id}/state")
async def update_project_state(project_id: str, state: str):
    """Update project state manually"""
    try:
        db.collection("projects").document(project_id).update({
            "state": state,
            "updated_at": time.time()
        })
        return {"success": True, "message": f"Project {project_id} state updated to {state}"}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.get("/api/projects/{project_id}/state")
async def get_project_state(project_id: str):
    """Get current project state"""
    try:
        doc = db.collection("projects").document(project_id).get()
        if doc.exists:
            data = doc.to_dict()
            return {
                "success": True,
                "project_id": project_id,
                "state": data.get("state", "unknown"),
                "name": data.get("name", ""),
                "description": data.get("description", ""),
                "dev_profiles": data.get("dev_profiles", []),
                "created_at": data.get("created_at"),
                "workflow_started_at": data.get("workflow_started_at"),
                "workflow_completed_at": data.get("workflow_completed_at")
            }
        else:
            return {"success": False, "error": "Project not found"}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.get("/api/projects/{project_id}/standups")
async def get_project_standups(project_id: str):
    """Get all standups for a project"""
    try:
        standups = []
        standups_ref = db.collection("projects").document(project_id).collection("standups")
        docs = standups_ref.stream()
        
        for doc in docs:
            standup_data = doc.to_dict()
            standup_data["id"] = doc.id
            standups.append(standup_data)
        
        return {
            "success": True,
            "project_id": project_id,
            "standups": standups,
            "count": len(standups)
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.get("/api/projects/{project_id}/tickets")
async def get_project_tickets(project_id: str):
    """Get all tickets for a project"""
    try:
        tickets = []
        tickets_ref = db.collection("projects").document(project_id).collection("tickets")
        docs = tickets_ref.stream()
        
        for doc in docs:
            ticket_data = doc.to_dict()
            ticket_data["id"] = doc.id
            tickets.append(ticket_data)
        
        return {
            "success": True,
            "project_id": project_id,
            "tickets": tickets,
            "count": len(tickets)
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.get("/api/projects/state")
async def get_all_projects_state():
    """Get all projects with their state"""
    try:
        projects = []
        projects_ref = db.collection("projects")
        docs = projects_ref.stream()
        
        for doc in docs:
            project_data = doc.to_dict()
            project_data["project_id"] = doc.id
            projects.append(project_data)
        
        return {
            "success": True,
            "projects": projects,
            "count": len(projects)
        }
    except Exception as e:
        return {"success": False, "error": str(e)}
