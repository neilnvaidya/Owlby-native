# Owlby Native

## Project Overview

Owlby Native is a mobile learning application that provides personalized educational experiences through AI-powered conversations. The application allows users to explore various topics, track their learning progress, and receive tailored content based on their interests and learning style.

### Core Concept

The app is designed to create an interactive, free-flowing learning experience where:

1. Users can have natural conversations with an AI about anything they want to learn
2. The AI adapts to the user's interests and learning style over time
3. Topics are not pre-selected but emerge organically from conversations
4. When the AI detects a new focus or topic in the conversation, a branch is created
5. Specialized learning modes can be activated at any point, creating new branches
6. Learning paths are not predictions but records of the user's learning journey
7. The app tracks learning progress and adapts content based on user performance
8. Learning sessions are summarized and stored for future reference
9. No chat histories are retained for privacy reasons, only summaries and learning insights
10. Each user has their personal AI assistant that knows their learning style but not specific personal information

### Key Features

- **Natural Conversations**: Free-flowing discussions with an AI about any topic
- **Organic Topic Discovery**: Topics emerge naturally from conversations rather than being pre-selected
- **Learning Path Visualization**: See how your learning journey has evolved over time
- **Adaptive Learning**: The AI adjusts its communication style based on your learning preferences
- **Privacy-Focused**: No chat histories are stored, only summaries and learning insights
- **Personalized Experience**: Your AI assistant learns your preferences while respecting your privacy

## Architecture

The project consists of two main components:

1. **Mobile App (React Native/Expo)**: The frontend application that users interact with
2. **Backend Server (Node.js/Express)**: The API server that handles authentication, data storage, and AI interactions

### Backend Architecture

The backend is built with:
- **Node.js/Express**: Web server framework
- **TypeScript**: For type safety and better developer experience
- **Supabase**: PostgreSQL database with built-in authentication
- **JWT**: For secure authentication
- **RESTful API**: For communication with the mobile app

### Database Schema

The database includes the following tables:
- **users**: Stores user information (id, google_id, email, name)
- **topics**: Stores learning topics (id, name, category, description)
- **sessions**: Tracks learning sessions (id, user_id, topic_id, start_time, end_time, duration, summary, complexity_level)
- **learning_paths**: Stores learning paths created for users (id, user_id, session_id, topic_id, name, description)
- **learning_nodes**: Stores nodes within learning paths (id, path_id, parent_id, content_type, content_summary, complexity_level)
- **user_learning_profiles**: Stores user learning preferences and progress (id, user_id, language_level, math_level, science_level, history_level, preferred_topics, challenging_concepts, learning_style, attention_span)
- **session_learning_insights**: Stores insights from learning sessions (id, session_id, user_id, topics_covered, concepts_mastered, concepts_needing_review, language_complexity, engagement_level)

### Data Flow

1. User authenticates with Google OAuth
2. User engages in free-flowing conversation with the AI about any topic
3. As the conversation progresses, the AI detects topic changes or specialized learning modes
4. When a new topic or mode is detected, a branch is created in the learning path
5. The session continues with the AI adapting to the user's learning style
6. When the session ends, it is summarized and stored
7. Learning insights are generated and stored
8. User learning profile is updated based on insights
9. The AI uses this information to create a more personalized experience in future sessions

## Development Plan

### MVP (Minimum Viable Product)

The MVP focuses on delivering the core experience of free-flowing, privacy-focused learning with AI.

#### Core Chat Experience
- Simple, clean chat interface
- Basic conversation with AI
- Topic detection during conversation
- Session summaries at end of conversations

#### Basic Learning Path
- Simple visual representation of topics discussed
- Basic branching structure
- Ability to return to previous topics

#### Essential Privacy Features
- No chat history storage
- Basic session summaries only
- Simple user preferences storage

#### Minimal User Profile
- Basic authentication
- Learning style preferences
- Session history (topics only)

### Extension Features (Post-MVP)

#### Advanced Learning Path Features
- Interactive visualization
- Topic relationships and connections
- Custom path organization
- Share learning paths

#### Enhanced AI Adaptation
- Advanced learning style detection
- Dynamic difficulty adjustment
- Multi-modal learning support
- Specialized learning modes

#### Advanced Analytics
- Detailed learning insights
- Progress tracking
- Engagement metrics
- Learning style analysis

#### Social Features
- Share insights (not conversations)
- Community topic discovery
- Anonymous learning path sharing
- Collaborative learning options

#### Advanced Privacy Controls
- Customizable data retention
- Export/delete data
- Privacy analytics
- Enhanced security features

## Ordered Implementation Plan

This plan is organized to allow for frequent testing and incremental development.

### Phase 1: Foundation & Authentication

#### 1.1 Backend Foundation (BE)
- ✅ Basic Express server setup with TypeScript
- ✅ Database connection with Supabase
- ✅ Authentication routes (Google OAuth)
- ✅ JWT token generation and verification
- ✅ User model with CRUD operations
- ✅ Topic model with CRUD operations
- ✅ Session model with CRUD operations
- ✅ Learning Path model with CRUD operations
- ✅ Learning Node model with CRUD operations
- ✅ User Learning Profile model with CRUD operations
- ✅ Session Learning Insights model with CRUD operations
- ✅ API routes for all models
- ✅ Authentication middleware
- ✅ Error handling middleware
- ✅ Health check endpoint

#### 1.2 Fix Type Mismatch Issues (BE)
- Fix type mismatch between string and number for user IDs in JWT functions
- Update JWT token generation and verification to use consistent types

#### 1.3 Basic Authentication UI (FE)
- Create login screen with Google OAuth button and Implement email/password authentication
- Implement loading screen during authentication
- Add error handling for authentication failures
- Implement authentication flow (token storage, API request handling)

#### 1.4 User Profile Backend (BE)
- Implement user profile creation on first login
- Add endpoint for updating user learning preferences
- Add endpoint for retrieving user profile

#### 1.5 User Profile UI (FE)
- Create user profile screen
- Implement form for setting learning preferences
- Add save preferences functionality

### Phase 2: Basic Chat Functionality

#### 2.1 AI Service Integration (BE)
- Create AIService interface for flexibility
- Implement Google Gemini integration
- Create endpoint for sending messages and receiving responses
- Implement basic response handling

#### 2.2 Basic Chat UI (FE)
- Create chat screen with message list
- Implement message input field and send button
- Add loading indicator for AI responses
- Implement basic error handling

#### 2.3 Chat Functionality (FE)
- Implement sending messages to backend
- Add display of AI responses
- Implement retry logic for failed requests

#### 2.4 Session Management (BE)
- Create endpoints for starting and ending sessions
- Implement basic session storage

#### 2.5 Session UI (FE)
- Add start new session button
- Implement end session button
- Create basic session summary display

### Phase 3: Topic Detection & Learning Path

#### 3.1 Topic Detection (BE)
- Define structured response format for AI (JSON with response and metadata)
- Implement topic detection logic
- Create endpoint for analyzing conversations
- Define topic detection parameters and rules

#### 3.2 Learning Path Backend (BE)
- Create endpoint for creating new learning paths
- Implement endpoint for adding nodes to learning paths
- Add endpoint for retrieving learning paths
- Implement logic for determining when to create a new branch

#### 3.3 Learning Path UI (FE)
- Create learning path screen with tree visualization
- Implement node display with topic information
- Add branch visualization with parent-child relationships
- Create tree navigation controls

#### 3.4 Topic Branching UI (FE)
- Implement ability to select nodes
- Add ability to start new sessions from selected topics
- Create display for session history for each topic

### Phase 4: Privacy & Data Management

#### 4.1 Privacy Backend (BE)
- Create data anonymization service
- Implement data minimization principles
- Create endpoint for user data deletion
- Implement session summary generation with privacy focus

#### 4.2 Privacy UI (FE)
- Create privacy settings screen
- Implement data retention options
- Add data deletion option
- Create privacy information display

### Phase 5: Additional Authentication Methods

#### 5.1 Additional Auth Backend (BE)
- Add Apple Sign-In (for iOS app)

#### 5.2 Additional Auth UI (FE)
- Add email/password login form
- Implement Apple Sign-In button
- Update login screen to accommodate multiple auth options

### Phase 6: Testing & Refinement

#### 6.1 Backend Testing (BE)
- Implement unit tests for all models
- Add integration tests for all endpoints
- Create end-to-end tests for critical flows
- Fix any remaining bugs or issues

#### 6.2 Frontend Testing (FE)
- Implement unit tests for components
- Add integration tests for screens
- Create end-to-end tests for critical flows
- Fix any UI/UX issues or bugs


## Known Issues and Challenges

### Type Mismatch Issues
- There is a type mismatch between string and number for user IDs in JWT functions
- The `generateToken` function expects a number but receives a string
- The `verifyToken` function returns a number but the auth middleware expects a string
- This causes TypeScript compilation errors and needs to be fixed

### Port Conflicts
- The server sometimes encounters port conflicts when running multiple instances
- The server is configured to try the next available port when the default port is in use
- This can lead to inconsistent port usage across restarts
- The server will automatically try ports 3000, 3001, 3002, etc. until it finds an available one

### Database Connection
- The Supabase connection is working but there were initial issues with the connection string format
- The correct format for Supabase hostnames is `[project-id].supabase.co`
- The connection is tested on server startup to ensure it's working properly

### Deprecation Warnings
- There is a deprecation warning for the `punycode` module
- This is a Node.js internal warning and doesn't affect functionality
- It can be addressed in future updates if needed

## Context for Future Development

### Key Files and Directories

#### Backend
- `src/server.ts`: Main server entry point
- `src/config/`: Configuration files
- `src/models/`: Database models
- `src/routes/`: API routes
- `src/middleware/`: Middleware functions
- `src/utils/`: Utility functions
- `src/db/`: Database migrations and schema

#### Mobile App
- `app/`: Main app directory
- `app/(tabs)/`: Tab-based navigation screens
- `app/utils/`: Utility functions
- `app/components/`: Reusable components (to be created)
- `app/constants/`: Constants and configuration (to be created)

### Current Challenges
- Type mismatch between string and number for user IDs in JWT functions
- Port conflicts when running multiple instances of the server
- Need to implement proper error handling for API responses

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 