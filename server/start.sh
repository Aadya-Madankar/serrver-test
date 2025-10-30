#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

echo "🚀 Starting deployment process..."

echo "📁 Current directory: $(pwd)"
echo "📂 Listing files:"
ls -la

echo ""
echo "📦 Installing dependencies..."
npm ci --production=false

echo ""
echo "🔨 Building TypeScript to JavaScript..."
npm run build

echo ""
echo "📂 Checking compiled files:"
ls -la dist/

echo ""
echo "🌍 Starting Node.js server..."
node dist/server.js
