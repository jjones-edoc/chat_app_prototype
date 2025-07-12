#!/bin/bash
# Start prototype server on port 8080
echo "Starting eDOC Chat prototype server on port 8080..."
python3 -m http.server 8080 > server.log 2>&1 &
echo $! > server.pid
echo "Server started! Access at: http://localhost:8080"
echo "PID: $(cat server.pid)"