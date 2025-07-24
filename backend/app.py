from fastapi import FastAPI
import threading
from agent.agenticworkflow import ScrumGraphBuilder
from agentic.utils.firebase_client import get_firestore
import time

app = FastAPI()

db = get_firestore()

# --- Firestore Listener Logic ---
def listen_for_new_projects():
    def on_snapshot(col_snapshot, changes, read_time):
        for change in changes:
            if change.type.name == "ADDED":
                doc = change.document
                project_data = doc.to_dict()
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
                # Always use Firestore doc id as project_id
                project_id = doc.id
                print(f"\n[Listener] New project detected: {project_id}")
                # --- Run the agentic workflow ---
                workflow = ScrumGraphBuilder()
                graph = workflow()
                initial_state = {
                    "project_id": project_id,
                    "project_description": project_description,
                    "team_info": team_info,
                    "scrum_cycle": 0,
                    "done": False
                }
                NUM_CYCLES = 3
                state = initial_state
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
                print(f"[Listener] Workflow complete for project {project_id}.")
    
    projects_ref = db.collection("projects")
    # Listen for new documents in the 'projects' collection
    projects_ref.on_snapshot(on_snapshot)

# --- Start Firestore listener in background thread ---
def start_listener():
    listener_thread = threading.Thread(target=listen_for_new_projects, daemon=True)
    listener_thread.start()

start_listener()

@app.get("/")
def root():
    return {"message": "Scrum AI FastAPI backend is running and listening to Firestore 'projects' collection."}
