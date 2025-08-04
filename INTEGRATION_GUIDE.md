# Scrum AI Integration Guide

This guide explains how to run the integrated Scrum AI system with the new real developer integration features.

## 🚀 Quick Start

### 1. Start the Backend (FastAPI)

```bash
cd backend
python run_backend.py
```

The backend will be available at: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- Health Check: http://localhost:8000/

### 2. Start the Frontend (React)

```bash
npm start
```

The frontend will be available at: http://localhost:3000

## 🔧 New Features Integrated

### Manager Dashboard (`/manager` route)

The manager dashboard now includes:

1. **Enhanced Project Creation**
   - Click "Create New Project" button
   - Select developers from a dropdown with real user data
   - Create projects with developer profiles stored in Firebase

2. **Project Status Viewing**
   - Click "View Status" on any project
   - See real-time project state, tickets, and standups
   - View developer-specific information

3. **Real Developer Integration**
   - Projects now use real developer profiles from Firebase
   - Backend workflow assigns tickets to actual developers
   - Standup collection waits for real developer submissions

## 📁 Key Files Modified

### Frontend
- `src/Dashboard/Manager.js` - Integrated new components
- `src/Dashboard/CreateProject.js` - New project creation with developer selection
- `src/Dashboard/ProjectStatus.js` - Project status viewing
- `src/Dashboard/StandupSubmission.js` - Developer standup submission
- `src/AddProjectinWorkspace.js` - Enhanced with developer profile creation

### Backend
- `backend/app.py` - Added CORS support and new API endpoints
- `backend/agent/agenticworkflow.py` - Updated to use real developer profiles
- `backend/run_backend.py` - New startup script

## 🔌 API Endpoints

The backend provides these endpoints:

- `GET /api/projects/{project_id}/state` - Get project state and details
- `GET /api/projects/{project_id}/standups` - Get all standups for a project
- `GET /api/projects/{project_id}/tickets` - Get all tickets for a project
- `POST /api/projects/{project_id}/state` - Update project state

## 🎯 Usage Workflow

### For Managers:
1. Navigate to `/manager`
2. Click "Create New Project"
3. Fill in project details and select developers
4. Create the project
5. View project status and manage the team

### For Developers:
1. Navigate to `/Developer` (if implemented)
2. View assigned tickets
3. Submit daily standups
4. Track project progress

## 🐛 Troubleshooting

### Backend Issues:
- Ensure `.env` file is properly configured with API keys
- Check that Firebase credentials are set up correctly
- Verify all Python dependencies are installed: `pip install -r requirements.txt`

### Frontend Issues:
- Ensure backend is running on port 8000
- Check browser console for CORS errors
- Verify Firebase configuration in `src/firebase.js`

### Integration Issues:
- Both frontend and backend must be running simultaneously
- Check that CORS is properly configured in the backend
- Verify API endpoints are accessible at http://localhost:8000

## 🔄 Data Flow

1. **Project Creation**: Manager creates project with selected developers
2. **Developer Profiles**: Stored in Firebase under project sub-collection
3. **Workflow Trigger**: Backend detects new project and starts agentic workflow
4. **Ticket Assignment**: Real developers receive actual tickets
5. **Standup Collection**: System waits for real developer submissions
6. **Status Updates**: Frontend displays real-time project status

## 📊 Monitoring

- Backend logs show workflow progress and developer assignments
- Frontend displays real-time project status
- Firebase Firestore contains all project data and developer profiles
- API endpoints provide programmatic access to project data

## 🚨 Important Notes

- The system now waits for real standups instead of using dummy data
- Developer profiles must exist in Firebase before project creation
- Backend workflow requires valid API keys (Groq, Pinecone, Firebase)
- CORS is configured for localhost development only 