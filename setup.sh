#!/bin/bash
# ServiceHive - Quick Start Script
# Run this to set up and start the entire project

echo "🚀 ServiceHive Project Setup"
echo "=============================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Backend Setup
echo "📦 Setting up Backend..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✅ Backend dependencies already installed"
fi

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "⚠️  Created .env file. Please update MONGODB_URI before running."
fi

echo "✅ Backend ready!"
cd ..
echo ""

# Frontend Setup
echo "📦 Setting up Frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✅ Frontend dependencies already installed"
fi

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ Created .env file with default values"
fi

echo "✅ Frontend ready!"
cd ..
echo ""

# Summary
echo "=============================="
echo "✨ Setup Complete!"
echo "=============================="
echo ""
echo "📝 Next Steps:"
echo "1. Backend:"
echo "   cd backend"
echo "   Update MONGODB_URI in .env"
echo "   npm run dev"
echo ""
echo "2. Frontend (new terminal):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📚 Documentation:"
echo "   - Main README: ./README.md"
echo "   - Backend: ./backend/README.md"
echo "   - Frontend: ./frontend/README.md"
echo "   - Audit Report: ./AUDIT.md"
echo ""
