#!/bin/bash

# Exit on error
set -e

# Load environment variables
source .env

# Run migrations
echo "Running database migrations..."
PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB -f src/config/migrations.sql

echo "Migrations completed successfully!" 