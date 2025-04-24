# Owlby Backend

Backend server for the Owlby learning platform.

## Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

### Setting up Supabase

1. Create a new project on [Supabase](https://supabase.com/dashboard)
2. Run the setup script:
   ```
   npm run setup:supabase
   ```
3. Follow the prompts to enter your Supabase connection details
4. The script will create a `.env` file with your Supabase credentials

### Database Migrations

Run the database migrations to set up the database schema:

```
npm run migrate
```

### Development

Start the development server:

```
npm run dev
```

The server will be running at http://localhost:3000.

## API Endpoints

- `GET /health` - Health check endpoint
- More endpoints will be added as the application develops

## Database Schema

The application uses the following database schema:

- `users` - User information
- `topics` - Learning topics
- `sessions` - Learning sessions
- `progress` - User progress tracking

## Deployment

The application can be deployed to Google Cloud Run:

```
npm run deploy:gcp
```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm test`: Run tests
- `npm run lint`: Run linter
- `npm run format`: Format code

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── services/       # Business logic
├── utils/          # Utility functions
└── server.ts       # Entry point
```

## Google Cloud Infrastructure

This project uses the following Google Cloud services:

- **Cloud Storage**: For storing user uploads and generated content
- **Cloud Logging**: For centralized logging
- **Cloud SQL**: For PostgreSQL database (production)
- **Cloud Memorystore**: For Redis (production)
- **Cloud Run**: For containerized deployment (production)
- **Cloud Build**: For CI/CD pipeline

## API Documentation

Coming soon...

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## License

ISC 