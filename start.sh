#!/bin/bash
set -e

echo "📦 Installing Node.js 20.x first..."
apt-get update -qq
apt-get install -y -qq curl gnupg2
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y -qq nodejs

echo ""
echo "✅ Node.js version:"
node --version
npm --version

cd server

echo ""
echo "📦 Installing dependencies..."
npm ci --omit=dev

echo ""
echo "🔨 Building TypeScript..."
npm run build

echo ""
echo "✅ Build completed!"
echo ""
echo "🌍 Starting server..."
echo ""

npm start
