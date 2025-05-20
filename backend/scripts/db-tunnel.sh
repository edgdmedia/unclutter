#!/bin/bash

# This script creates an SSH tunnel to your remote MySQL/MariaDB server

USER="unclutter"
SERVER="server.edgdhosting.xyz"
LOCAL_PORT=3307
REMOTE_PORT=3306

echo "Creating SSH tunnel to MariaDB on $SERVER"
echo "Local port: $LOCAL_PORT -> Remote port: $REMOTE_PORT"
echo "Press Ctrl+C to close the tunnel"

# Create the SSH tunnel
ssh -N -L $LOCAL_PORT:localhost:$REMOTE_PORT $USER@$SERVER
