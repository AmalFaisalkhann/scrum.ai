#!/usr/bin/env python3
"""
Test script to demonstrate standup submission during workflow execution
"""

import time
import threading
from agentic.tool.standup_fetcher import submit_test_standup
from agentic.utils.firebase_client import get_firestore

def submit_standups_for_project(project_id: str, cycle_number: int, delay_seconds: int = 30):
    """
    Submit standups for all developers in a project after a delay
    This simulates real developers submitting their standups
    """
    print(f"⏰ Will submit standups for cycle {cycle_number} in {delay_seconds} seconds...")
    time.sleep(delay_seconds)
    
    # Get all developers for the project
    db = get_firestore()
    dev_docs = db.collection("projects").document(project_id).collection("dev_profiles").stream()
    devs = [doc.to_dict() for doc in dev_docs]
    
    print(f"📝 Submitting standups for {len(devs)} developers...")
    
    for dev in devs:
        dev_id = dev.get("id")
        dev_name = dev.get("name", dev_id)
        
        # Submit standup with realistic content
        yesterday_work = f"Worked on {dev.get('role', 'development')} tasks and reviewed assigned tickets"
        today_plan = f"Continue with current sprint tasks and collaborate with team"
        blockers = "No blockers at the moment"
        
        result = submit_test_standup.invoke({
            "project_id": project_id,
            "cycle_number": cycle_number,
            "dev_id": dev_id,
            "yesterday_work": yesterday_work,
            "today_plan": today_plan,
            "blockers": blockers
        })
        
        print(f"✅ {dev_name}: {result}")
    
    print(f"🎉 All standups submitted for cycle {cycle_number}!")

def monitor_standup_status(project_id: str, cycle_number: int):
    """
    Monitor standup status for a project
    """
    from agentic.tool.standup_fetcher import get_standup_status
    
    while True:
        try:
            status = get_standup_status.invoke({
                "project_id": project_id,
                "cycle_number": cycle_number
            })
            
            print(f"📊 Status: {status['submitted_standups']}/{status['total_developers']} standups submitted")
            
            if status['is_complete']:
                print("🎉 All standups are complete!")
                break
                
            time.sleep(5)  # Check every 5 seconds
            
        except KeyboardInterrupt:
            print("\n⏹️  Monitoring stopped by user")
            break
        except Exception as e:
            print(f"❌ Error monitoring status: {e}")
            break

if __name__ == "__main__":
    print("🧪 Standup Submission Test")
    print("=" * 50)
    
    # Example usage
    project_id = input("Enter project ID: ").strip()
    cycle_number = int(input("Enter cycle number: ").strip())
    delay_seconds = int(input("Enter delay before submission (seconds): ").strip())
    
    print(f"\n🚀 Starting standup submission test...")
    print(f"📋 Project: {project_id}")
    print(f"🔄 Cycle: {cycle_number}")
    print(f"⏰ Delay: {delay_seconds} seconds")
    
    # Start standup submission in a separate thread
    submission_thread = threading.Thread(
        target=submit_standups_for_project,
        args=(project_id, cycle_number, delay_seconds)
    )
    submission_thread.start()
    
    # Monitor status in main thread
    print(f"\n👀 Monitoring standup status...")
    monitor_standup_status(project_id, cycle_number)
    
    print("\n✅ Test complete!") 