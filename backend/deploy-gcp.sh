#!/bin/bash

# Exit on error
set -e

# Load environment variables
source .env

# Build the application
echo "Building the application..."
npm run build

# Build the Docker image
echo "Building Docker image..."
docker build -t gcr.io/$GOOGLE_CLOUD_PROJECT_ID/owlby-backend .

# Push the Docker image to Google Container Registry
echo "Pushing Docker image to Google Container Registry..."
docker push gcr.io/$GOOGLE_CLOUD_PROJECT_ID/owlby-backend

# Deploy to Google Cloud Run
echo "Deploying to Google Cloud Run..."
gcloud run deploy owlby-backend \
  --image gcr.io/$GOOGLE_CLOUD_PROJECT_ID/owlby-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="POSTGRES_HOST=$POSTGRES_HOST,POSTGRES_PORT=$POSTGRES_PORT,POSTGRES_DB=$POSTGRES_DB,POSTGRES_USER=$POSTGRES_USER,POSTGRES_PASSWORD=$POSTGRES_PASSWORD,REDIS_HOST=$REDIS_HOST,REDIS_PORT=$REDIS_PORT,REDIS_PASSWORD=$REDIS_PASSWORD,JWT_SECRET=$JWT_SECRET,JWT_EXPIRES_IN=$JWT_EXPIRES_IN,GOOGLE_CLOUD_PROJECT_ID=$GOOGLE_CLOUD_PROJECT_ID,GOOGLE_CLOUD_BUCKET_NAME=$GOOGLE_CLOUD_BUCKET_NAME,OPENAI_API_KEY=$OPENAI_API_KEY,LOG_LEVEL=$LOG_LEVEL"

echo "Deployment completed successfully!" 