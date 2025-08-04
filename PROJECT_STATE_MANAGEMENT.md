# Project State Management System

## Overview

The Scrum.AI application now includes a comprehensive project state management system that tracks the lifecycle of projects through different states and automatically triggers the agentic workflow based on state changes.

## Project States

### 1. **New** (Orange Badge)
- **Description**: Project has just been added to the system
- **Trigger**: When a project is created via the frontend
- **Action**: Automatically transitions to "Running" state

### 2. **Running** (Blue Badge)
- **Description**: Project is actively being processed by the agentic workflow
- **Trigger**: When state changes from "New" to "Running"
- **Action**: Starts the LangGraph agentic workflow automatically

### 3. **Waiting** (Red Badge)
- **Description**: Project is waiting for standups or scrum cycle completion
- **Trigger**: When there are errors in the workflow or waiting for user input
- **Action**: Manual intervention may be required

### 4. **Completed** (Green Badge)
- **Description**: Project has been successfully completed
- **Trigger**: When the agentic workflow finishes successfully
- **Action**: Project is marked as complete

## Backend Implementation

### FastAPI Endpoints

#### `GET /api/projects/{project_id}/state`
- **Purpose**: Get the current state of a project
- **Response**: 
```json
{
  "project_id": "string",
  "state": "new|running|waiting|completed",
  "state_updated_at": "timestamp"
}
```

#### `POST /api/projects/{project_id}/state`
- **Purpose**: Update the state of a project
- **Body**: 
```json
{
  "state": "new|running|waiting|completed"
}
```

### Firestore Listener

The backend includes a Firestore listener that monitors project state changes:

1. **New Project Detection**: When a project with state "new" is added, it automatically transitions to "running"
2. **Workflow Trigger**: When state changes to "running", the agentic workflow is automatically started
3. **State Updates**: The workflow updates the project state based on progress and completion

## Frontend Implementation

### Project Creation

When creating a new project, users can now select an initial state:

```javascript
const [formData, setFormData] = useState({ 
  name: '', 
  id: '', 
  timeline: '', 
  state: 'new' 
});
```

### State Display

Projects display their current state with color-coded badges:

- **Orange**: New
- **Blue**: Running  
- **Red**: Waiting
- **Green**: Completed

### State Management

Users can manually update project states through dropdown selectors, but the backend automatically manages state transitions during workflow execution.

## Workflow Integration

### State-Driven Workflow

The agentic workflow is now triggered by state changes rather than just project creation:

1. **Project Created** → State: "new"
2. **Backend Detects** → State: "running" (triggers workflow)
3. **Workflow Running** → State: "running"
4. **Workflow Complete** → State: "completed"
5. **Error/Issue** → State: "waiting"

### Error Handling

If the workflow encounters errors, the project state is automatically set to "waiting" with an error message, allowing for manual intervention.

## Configuration

### Backend URL

Update the API base URL in `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:8000'; // Update to match your FastAPI server
```

### State Validation

The backend validates state values against the allowed states: `["new", "running", "waiting", "completed"]`

## Usage

### Creating a Project

1. Navigate to the Manager dashboard
2. Fill in project details (name, description, timeline)
3. Select initial state (defaults to "new")
4. Click "Create"

### Monitoring Project Progress

1. View project list to see current states
2. State badges provide visual indication of progress
3. Backend status indicator shows connection to FastAPI server

### Manual State Updates

1. Click on a project to select it
2. Use the state dropdown to change the state
3. Changes are immediately reflected in Firestore and sent to backend

## Benefits

1. **Clear Project Lifecycle**: Visual tracking of project progress
2. **Automated Workflow**: No manual intervention required for normal flow
3. **Error Recovery**: Clear indication when projects need attention
4. **Real-time Updates**: State changes are reflected immediately
5. **Backend Integration**: Seamless integration with agentic workflow

## Troubleshooting

### Backend Connection Issues

If the backend status shows "Disconnected":
1. Ensure FastAPI server is running
2. Check the API_BASE_URL configuration
3. Verify network connectivity

### State Not Updating

If project states are not updating:
1. Check Firestore permissions
2. Verify backend logs for errors
3. Ensure project documents have the required fields

### Workflow Not Triggering

If the agentic workflow is not starting:
1. Check that project state is set to "running"
2. Verify backend listener is active
3. Check backend logs for workflow errors 