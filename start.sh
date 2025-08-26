#!/bin/bash

echo "Starting Review Pilot application..."

# Check if .next directory exists
if [ ! -d ".next" ]; then
    echo "Building application..."
    npm run build
fi

# Start the application
echo "Starting application on port $PORT..."
npm run start
