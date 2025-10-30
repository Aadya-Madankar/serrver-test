#!/bin/bash
set -e

# Install Node.js using apt-get (for Debian-based containers)
echo "📦 Installing Node.js..."
apt-get update -qq
apt-get install -y -qq nodejs npm

echo "🚀 Starting AI Agent Server..."
echo ""

cd server

echo "📦 Installing dependencies..."
npm ci --omit=dev

echo ""
echo "🔨 Building TypeScript..."
npm run build

echo ""
echo "✅ Build completed!"
echo ""
echo "🌍 Starting server on port 3001..."
echo ""

node dist/server.js
