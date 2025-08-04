import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { submit_test_standup } from "../services/firebaseActions";
import "./StandupSubmission.css";

const StandupSubmission = ({ projectId, cycleNumber, onStandupSubmitted }) => {
  const [yesterdayWork, setYesterdayWork] = useState("");
  const [todayPlan, setTodayPlan] = useState("");
  const [blockers, setBlockers] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [availableProjects, setAvailableProjects] = useState([]);
  const [currentCycle, setCurrentCycle] = useState(0);

  useEffect(() => {
    // Load available projects for the current user
    loadUserProjects();
  }, []);

  const loadUserProjects = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/projects/state`);
      const data = await response.json();
      
      if (data.success) {
        // Filter projects where user is a developer
        const userProjects = data.projects.filter(project => {
          const devProfiles = project.dev_profiles || [];
          return devProfiles.some(dev => 
            dev.user_id === auth.currentUser?.uid || 
            dev.id === auth.currentUser?.uid ||
            dev.email === auth.currentUser?.email
          );
        });
        setAvailableProjects(userProjects);
        
        if (userProjects.length > 0) {
          setSelectedProject(userProjects[0].project_id);
        }
      }
    } catch (error) {
      console.error("Error loading projects:", error);
    }
  };

  useEffect(() => {
    // Check if user has already submitted a standup for this cycle
    if (selectedProject) {
      checkExistingStandup();
    }
  }, [selectedProject, currentCycle]);

  const checkExistingStandup = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/projects/${selectedProject}/standups`);
      const data = await response.json();
      
      if (data.success) {
        const userStandup = data.standups.find(standup => 
          (standup.dev_id === auth.currentUser?.uid || 
           standup.dev_id === auth.currentUser?.email) &&
          standup.cycle === currentCycle
        );
        
        if (userStandup) {
          setSubmitted(true);
          setYesterdayWork(userStandup.yesterday_work || "");
          setTodayPlan(userStandup.today_plan || "");
          setBlockers(userStandup.blockers || "");
        } else {
          setSubmitted(false);
          setYesterdayWork("");
          setTodayPlan("");
          setBlockers("");
        }
      }
    } catch (error) {
      console.error("Error checking existing standup:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedProject) {
      alert("Please select a project.");
      return;
    }
    
    if (!yesterdayWork.trim() || !todayPlan.trim()) {
      alert("Please fill in both 'Yesterday's Work' and 'Today's Plan' fields.");
      return;
    }

    setLoading(true);
    try {
      const devId = auth.currentUser?.uid || auth.currentUser?.email;
      
      // Use the submit_test_standup function
      await submit_test_standup({
        project_id: selectedProject,
        cycle_number: currentCycle,
        dev_id: devId,
        yesterday_work: yesterdayWork,
        today_plan: todayPlan,
        blockers: blockers || "No blockers"
      });

      setSubmitted(true);
      alert("Standup submitted successfully!");
      
      if (onStandupSubmitted) {
        onStandupSubmitted();
      }
    } catch (error) {
      console.error("Error submitting standup:", error);
      alert("Failed to submit standup: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!selectedProject) {
      alert("Please select a project.");
      return;
    }
    
    if (!yesterdayWork.trim() || !todayPlan.trim()) {
      alert("Please fill in both 'Yesterday's Work' and 'Today's Plan' fields.");
      return;
    }

    setLoading(true);
    try {
      const devId = auth.currentUser?.uid || auth.currentUser?.email;
      
      // For now, we'll use the same function to update
      await submit_test_standup({
        project_id: selectedProject,
        cycle_number: currentCycle,
        dev_id: devId,
        yesterday_work: yesterdayWork,
        today_plan: todayPlan,
        blockers: blockers || "No blockers"
      });

      alert("Standup updated successfully!");
    } catch (error) {
      console.error("Error updating standup:", error);
      alert("Failed to update standup: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!auth.currentUser) {
    return <div className="standup-submission-container">Please log in to submit standups.</div>;
  }

  return (
    <div className="standup-submission-container">
      <div className="standup-header">
        <h2>Daily Standup Submission</h2>
        <div className="standup-info">
          <span className="user-info">{auth.currentUser.email}</span>
        </div>
      </div>

      {availableProjects.length === 0 ? (
        <div className="no-projects">
          <p>You are not assigned to any projects yet.</p>
          <p>Contact your manager to be added to a project.</p>
        </div>
      ) : (
        <>
          {submitted && (
            <div className="submitted-notice">
              ✓ Standup submitted for Cycle {currentCycle}
            </div>
          )}

          <form onSubmit={submitted ? handleUpdate : handleSubmit} className="standup-form">
            <div className="form-group">
              <label htmlFor="projectSelect">Select Project *</label>
              <select
                id="projectSelect"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                required
              >
                <option value="">Choose a project...</option>
                {availableProjects.map((project) => (
                  <option key={project.project_id} value={project.project_id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="cycleSelect">Select Cycle *</label>
              <select
                id="cycleSelect"
                value={currentCycle}
                onChange={(e) => setCurrentCycle(parseInt(e.target.value))}
                required
              >
                <option value={0}>Cycle 0</option>
                <option value={1}>Cycle 1</option>
                <option value={2}>Cycle 2</option>
              </select>
            </div>
        <div className="form-group">
          <label htmlFor="yesterdayWork">
            What did you work on yesterday? *
          </label>
          <textarea
            id="yesterdayWork"
            value={yesterdayWork}
            onChange={(e) => setYesterdayWork(e.target.value)}
            placeholder="Describe the work you completed yesterday..."
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="todayPlan">
            What will you work on today? *
          </label>
          <textarea
            id="todayPlan"
            value={todayPlan}
            onChange={(e) => setTodayPlan(e.target.value)}
            placeholder="Describe your plan for today..."
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="blockers">
            Any blockers or issues?
          </label>
          <textarea
            id="blockers"
            value={blockers}
            onChange={(e) => setBlockers(e.target.value)}
            placeholder="Describe any blockers or issues you're facing..."
            rows="3"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="submit-button"
        >
          {loading ? "Submitting..." : (submitted ? "Update Standup" : "Submit Standup")}
        </button>
      </form>

      <div className="standup-tips">
        <h3>Standup Tips:</h3>
        <ul>
          <li>Be specific about what you accomplished</li>
          <li>Mention any progress on assigned tickets</li>
          <li>Include any collaboration or pair programming</li>
          <li>Be honest about blockers - the team can help!</li>
        </ul>
      </div>
        </>
      )}
    </div>
  );
};

export default StandupSubmission; 