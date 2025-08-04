# Scrum AI Agents - Agentic Workflow

An intelligent agentic workflow system for managing Scrum development processes using LangGraph, Firebase, and Pinecone. The system automatically handles project setup, ticket generation, standup management, and cycle progression.

## 🚀 Features

- **Intelligent Project Management**: Automatically stores project descriptions in vector databases and creates summaries
- **Smart Ticket Generation**: Generates and assigns tickets based on developer skills, workload, and project requirements
- **Automated Standup Management**: Waits for developer standups and creates comprehensive summaries
- **Cycle Progression**: Manages multiple scrum cycles with proper timing and progression
- **Vector Search**: Uses Pinecone for semantic search of project context
- **Firebase Integration**: Stores all project data, tickets, and scrum history in Firestore

## 📋 Workflow Overview

The agentic workflow follows this sequence:

1. **Project Context Storage**: Project description is embedded and stored in Pinecone vector database
2. **Context Gathering**: Retrieves developer profiles, scrum history, and existing tickets
3. **Ticket Generation**: Creates intelligent tickets based on project requirements and developer skills
4. **Standup Waiting**: Waits for all developers to submit standups or cycle time to expire
5. **Standup Summarization**: Creates comprehensive summaries of all standups
6. **Cycle Management**: Progresses to next cycle or ends project based on configuration

## 🛠️ Setup

### Prerequisites

- Python 3.8+
- Firebase project with Firestore enabled
- Pinecone account and API key
- Groq API key (or other LLM provider)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd scrum.ai-agents
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**:
   Create a `.env` file in the project root:
   ```env
   # LLM Configuration
   GROQ_API_KEY=your_groq_api_key
   GROQ_MODEL=mixtral-8x7b-32768
   
   # Vector Database
   PINECONE_API_KEY=your_pinecone_api_key
   
   # Firebase Configuration
   GOOGLE_APPLICATION_CREDENTIALS=path/to/serviceAccountKey.json
   ```

4. **Configure Firebase**:
   - Download your Firebase service account key
   - Place it in the project root as `serviceAccountKey.json`
   - Update the `GOOGLE_APPLICATION_CREDENTIALS` path in your `.env` file

## 🏃‍♂️ Usage

### Running the Workflow

1. **Test the setup** (optional):
   ```bash
   python test_workflow.py
   ```

2. **Run the main workflow**:
   ```bash
   python main.py
   ```

### Workflow Configuration

The workflow automatically:
- Creates unique project IDs
- Sets up developer profiles
- **Waits for real standups for 5 minutes per cycle**
- Configures scrum cycle duration (default: 24 hours)
- Manages up to 10 scrum cycles by default

### Standup Submission

The workflow now waits for real standups instead of using dummy data:

1. **During the waiting period** (5 minutes), developers can submit standups
2. **Standup submission** can be done via:
   - Frontend application (if available)
   - Direct Firebase operations
   - Using the `submit_test_standup` tool for testing

3. **Test standup submission**:
   ```bash
   python test_standup_submission.py
   ```

4. **Workflow behavior**:
   - Waits up to 5 minutes for all developers to submit standups
   - Proceeds immediately if all standups are submitted
   - Continues with available standups after timeout

### Customizing the Workflow

You can modify the workflow by editing:

- **Project Description**: Update the `project_description` in `main.py`
- **Developer Profiles**: Modify the `create_sample_dev_profiles()` function
- **Cycle Duration**: Change the `scrum_cycle_duration_minutes` parameter
- **Max Cycles**: Adjust the `max_cycles` parameter

## 📁 Project Structure

```
scrum.ai-agents/
├── agent/
│   └── agenticworkflow.py      # Main workflow implementation
├── agentic/
│   ├── tool/                   # LangChain tools
│   │   ├── firebase_tool.py    # Firebase operations
│   │   ├── scrum_timer.py      # Cycle timing management
│   │   ├── standup_fetcher.py  # Standup handling
│   │   ├── ticket_generator.py # Ticket generation logic
│   │   └── vector_retriever.py # Vector search operations
│   ├── utils/                  # Utility functions
│   │   ├── embedding.py        # Document embedding
│   │   ├── firebase_client.py  # Firebase client setup
│   │   ├── model_loader.py     # LLM model loading
│   │   ├── pinecone_client.py  # Pinecone client setup
│   │   └── text_splitter.py    # Text processing
│   └── prompt_library/
│       └── prompt.py           # System prompts
├── main.py                     # Main execution script
├── test_workflow.py            # Test suite
└── requirements.txt            # Dependencies
```

## 🔧 Tools and Functions

### Firebase Tools
- `write_project_summary()`: Store project summaries
- `get_dev_profiles()`: Retrieve developer information
- `create_ticket()`: Create and assign tickets
- `get_project_tickets()`: Retrieve project tickets
- `save_scrum_cycle_summary()`: Save cycle summaries
- `get_scrum_history()`: Get historical scrum data

### Scrum Timer Tools
- `is_scrum_time_reached()`: Check if cycle time has expired
- `get_cycle_timing_info()`: Get detailed timing information
- `set_cycle_start_time()`: Set cycle start timestamps

### Standup Tools
- `get_all_standups()`: Retrieve all standups for a cycle
- `get_standup_status()`: Check standup completion status
- `create_standup_template()`: Generate standup templates
- `save_standup()`: Save completed standups
- `submit_test_standup()`: Submit test standups for development

### Ticket Generation Tools
- `generate_project_tickets()`: Create tickets based on context
- `analyze_developer_workload()`: Analyze developer capacity
- `optimize_ticket_assignment()`: Optimize ticket assignments
- `create_sprint_plan()`: Generate sprint plans

## 🔄 Workflow Nodes

1. **StoreProjectContext**: Embeds and stores project description
2. **GatherContext**: Collects all necessary project context
3. **GenerateTickets**: Creates and assigns tickets
4. **WaitForStandups**: Waits for standup completion
5. **SummarizeStandups**: Creates cycle summaries
6. **ManageCycle**: Handles cycle progression

## 📊 Data Flow

```
Project Description → Vector DB (Pinecone)
                    ↓
Developer Profiles → Firebase (Firestore)
                    ↓
Ticket Generation → Firebase (Tickets Collection)
                    ↓
Standup Collection → Firebase (Standups Collection)
                    ↓
Summary Creation → Firebase (Scrum Cycles Collection)
                    ↓
Cycle Progression → Next Cycle or End
```

## 🧪 Testing

Run the test suite to verify your setup:

```bash
python test_workflow.py
```

The test suite checks:
- Workflow component creation
- Tool function availability
- Utility function operation
- Mock external service integration

## 🔍 Monitoring and Debugging

The workflow provides detailed logging and state tracking:

- Each node updates the state with progress indicators
- Firebase stores all intermediate and final results
- Cycle summaries include metrics and participant information
- Error handling with detailed exception information

## 🚨 Troubleshooting

### Common Issues

1. **Firebase Connection Error**:
   - Verify service account key path
   - Check Firebase project permissions
   - Ensure Firestore is enabled

2. **Pinecone Connection Error**:
   - Verify API key in environment variables
   - Check index name and dimensions
   - Ensure Pinecone account is active

3. **LLM Provider Error**:
   - Verify API key configuration
   - Check model name availability
   - Ensure sufficient API credits

### Debug Mode

Enable debug logging by setting:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the test suite output
3. Open an issue with detailed error information
4. Include environment and configuration details
