#!/bin/bash

echo "🚀 Starting GoalPay Development Environment..."

# Function to check if a port is in use
check_port() {
    lsof -i :$1 > /dev/null 2>&1
}

# Check if backend port is available
if check_port 5001; then
    echo "⚠️  Port 5001 is already in use. Backend server might already be running."
else
    echo "📡 Starting backend server on port 5001..."
    cd backend && npm start &
    BACKEND_PID=$!
    echo "✅ Backend server started (PID: $BACKEND_PID)"
fi

# Wait a moment for backend to start
sleep 3

# Check if frontend port is available
if check_port 3000; then
    echo "⚠️  Port 3000 is already in use. Frontend server might already be running."
else
    echo "🌐 Starting frontend server on port 3000..."
    cd frontend && npm run dev &
    FRONTEND_PID=$!
    echo "✅ Frontend server started (PID: $FRONTEND_PID)"
fi

# Wait a moment for frontend to start
sleep 5

echo ""
echo "🎉 GoalPay Development Environment is ready!"
echo "📊 Backend API: http://localhost:5001"
echo "🌐 Frontend App: http://localhost:3000"
echo "🔍 Health Check: http://localhost:5001/health"
echo ""
echo "Press Ctrl+C to stop all servers"

# Keep the script running and handle cleanup
trap 'echo ""; echo "🛑 Stopping servers..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit' INT

# Wait for user to stop
wait
