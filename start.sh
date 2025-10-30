#!/bin/bash
set -e

echo "==================================="
echo "🚀 AI Agent Server - Starting Up"
echo "==================================="

echo ""
echo "📍 Current directory: $(pwd)"
echo "📂 Directory contents:"
ls -la

echo ""
echo "🔧 Changing to server directory..."
cd server

echo ""
echo "📦 Installing Node.js dependencies..."
npm ci --omit=dev

echo ""
echo "🔨 Building TypeScript to JavaScript..."
npm run build

echo ""
echo "✅ Build completed successfully"
echo ""
echo "🌍 Starting Node.js server..."
echo "=================================="
echo ""

node dist/server.js
