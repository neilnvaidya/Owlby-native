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
2. **Backend (Serverless Functions)**: API endpoints deployed as serverless functions that handle authentication, data storage, and AI interactions

### Backend Architecture

The backend is built with:
- **Serverless Functions**: Deployed on Vercel/Netlify
- **TypeScript**: For type safety and better developer experience
- **Supabase**: PostgreSQL database with built-in authentication
- **JWT**: For secure authentication
- **RESTful API**: For communication with the mobile app

### Project Structure

### Backend (`backend/`)
```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Express middleware
├── models/        # Database models
├── routes/        # API routes
├── services/      # Business logic services
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── __tests__/     # Test files
```

### Frontend (`app/`)
```
app/
├── (auth)/        # Authentication screens
│   ├── login.tsx  # Login screen with OAuth
│   ├── index.tsx  # Auth redirect
│   └── _layout.tsx # Auth layout
├── components/    # Reusable UI components
├── constants/     # App constants
├── features/      # Feature-based modules
├── navigation/    # Navigation configuration
├── services/      # API and business logic services
├── store/         # State management
└── utils/         # Utility functions
```

## Current Progress & Next Steps

### Completed Features ✅

#### Backend Foundation
- ✅ Serverless architecture setup with TypeScript
- ✅ Supabase database connection and configuration
- ✅ Authentication system with Google OAuth
- ✅ JWT token generation and verification
- ✅ Token refresh functionality
- ✅ Password reset functionality
- ✅ User model with CRUD operations
- ✅ Learning Node model with CRUD operations
- ✅ API routes for core models
- ✅ Authentication middleware
- ✅ Error handling middleware
- ✅ Health check endpoint
- ✅ Comprehensive test suite

#### Frontend Foundation
- ✅ Basic app structure with Expo
- ✅ Navigation setup with Expo Router
- ✅ Authentication screens with Google OAuth
- ✅ Basic components structure
- ✅ Asset management
- ✅ Constants organization
- ✅ EAS build configuration for Android and iOS

### In Progress 🚧

#### Authentication Flow
- 🚧 Email verification UI implementation
- 🚧 Loading states during authentication
- 🚧 Error handling for failed logins
- 🚧 Protected route handling
- 🚧 Authentication state management
- 🚧 Splash screen implementation

### Next Deliverables (2-Week Sprints)

#### Sprint 0: Authentication & App Setup (Current)
1. Authentication Backend
   - [x] Complete Google OAuth endpoints
   - [x] Implement JWT token refresh
   - [x] Add email/password authentication option
   - [x] Add password reset functionality
   - [x] Add email verification endpoints
   - [x] Add tests for authentication flows

2. Authentication UI
   - [x] Create login screen with Google OAuth button
   - [x] Add email/password login form
   - [ ] Implement loading states during authentication
   - [ ] Add error handling for failed logins
   - [x] Create registration screen for new users
   - [ ] Add email verification UI
   - [ ] Add tests for authentication components

3. App Setup
   - [ ] Set up protected route handling
   - [ ] Implement authentication state management
   - [ ] Create splash screen and loading states
   - [ ] Add tests for navigation and state management

---

### Sprint 0: Detailed Task Breakdown & Code Suggestions

#### Authentication UI
- **Loading States**
  - Show a loading spinner/button state during login, registration, and session checks.
  - Example: Use a `loading` state in your auth forms and disable buttons while loading.
- **Error Handling**
  - Display error messages for failed logins/registrations (e.g., invalid credentials, network errors).
  - Example: Catch errors in your sign-in/sign-up functions and set an `error` state to display in the UI.
- **Email Verification UI**
  - After registration, prompt the user to verify their email.
  - Show a message if the user is not verified and provide a button to resend the verification email.
- **Tests for Auth Components**
  - Write tests for login, registration, and verification flows using Jest and React Native Testing Library.

#### App Setup
- **Protected Route Handling**
  - Redirect unauthenticated users to the login screen.
  - Example: In your navigation or route guards, check for a valid session before rendering protected screens.
- **Authentication State Management**
  - Ensure session persistence and handle session refresh on app start.
  - Example: Use `useEffect` in your AuthProvider to check and refresh the session.
- **Splash Screen and Loading States**
  - Show a splash/loading screen while checking authentication/session state on app launch.
- **Tests for Navigation and State Management**
  - Write tests to ensure protected routes and session management work as expected.

#### Known Issues
- **Type Mismatches**
  - Fix any type mismatches in JWT/user ID handling in the backend.

---

#### Sprint 1: User Profile & Preferences
1. User Profile Backend
   - [ ] Implement user profile creation on first login
   - [ ] Add endpoint for updating user learning preferences
   - [ ] Add endpoint for retrieving user profile
   - [ ] Add tests for user profile operations

2. User Profile UI
   - [ ] Create user profile screen
   - [ ] Implement form for setting learning preferences
   - [ ] Add save preferences functionality
   - [ ] Add tests for UI components

#### Sprint 2: Basic Chat Experience
1. AI Service Integration
   - [ ] Create AIService interface
   - [ ] Implement Google Gemini integration
   - [ ] Create endpoint for chat interactions
   - [ ] Add tests for AI service

2. Basic Chat UI
   - [ ] Create chat screen with message list
   - [ ] Implement message input and send functionality
   - [ ] Add loading states and error handling
   - [ ] Add tests for chat components

#### Sprint 3: Session Management
1. Session Backend
   - [ ] Create session model and endpoints
   - [ ] Implement session storage
   - [ ] Add session summary generation
   - [ ] Add tests for session operations

2. Session UI
   - [ ] Add session controls
   - [ ] Implement session summary display
   - [ ] Add session history view
   - [ ] Add tests for session components

#### Sprint 4: Learning Path Visualization
1. Learning Path Backend
   - [ ] Implement path creation and branching
   - [ ] Add path visualization data structure
   - [ ] Create path summary endpoints
   - [ ] Add tests for path operations

2. Learning Path UI
   - [ ] Create path visualization component
   - [ ] Implement path navigation
   - [ ] Add path summary display
   - [ ] Add tests for path components

### Future Features (Post-MVP)

#### Advanced Learning Features
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