#!/bin/zsh

# Ensure the script exits on any error
set -e

# Function to cleanup background processes
cleanup() {
    echo "Cleaning up..."
    pkill -f "prisma studio" 2>/dev/null || true
    pkill -f "ts-node-dev" 2>/dev/null || true
    exit 0
}

# Set up cleanup on script exit
trap cleanup EXIT INT TERM

# Start Prisma Studio in background, without taking over stdin
echo "Starting Prisma Studio..."
PRISMA_STUDIO_PID=$(npx prisma studio > /dev/null 2>&1 & echo $!)

# Wait a moment for Prisma Studio to start
sleep 2

# Start the development server in foreground
echo "Starting development server..."
exec pnpm dev  # Using exec prevents nested shell issues 