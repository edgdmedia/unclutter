#!/bin/bash

# This script helps set up the local database for development
# It supports the modular architecture of the Unclutter project

echo "Setting up local database for Unclutter API development"
echo "----------------------------------------"

# Prompt for MySQL root password
read -sp "Enter your MySQL root password: " ROOT_PASSWORD
echo ""

# Create database and user
echo "Creating database and user..."
mysql -u root -p"$ROOT_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS unclutter_api; 
CREATE USER IF NOT EXISTS 'unclutter'@'localhost' IDENTIFIED BY 'eNlZrUPhJatXWN0'; 
GRANT ALL PRIVILEGES ON unclutter_api.* TO 'unclutter'@'localhost'; 
FLUSH PRIVILEGES;"

if [ $? -eq 0 ]; then
    echo "Database setup successful!"
    
    # Update .env file automatically
    echo "Updating .env file with database credentials..."
    
    # Check if .env file exists
    if [ -f ../.env ]; then
        # Update database configuration in .env file
        sed -i '' 's/DB_USER=.*/DB_USER=unclutter/' ../.env
        sed -i '' 's/DB_PASSWORD=.*/DB_PASSWORD=eNlZrUPhJatXWN0/' ../.env
        echo "Environment file updated successfully."
    else
        echo "Warning: .env file not found. Please update it manually with:"
        echo "DB_USER=unclutter"
        echo "DB_PASSWORD=eNlZrUPhJatXWN0"
    fi
    
    # Ask if user wants to run migrations
    echo ""
    read -p "Do you want to run database migrations now? (y/n): " RUN_MIGRATIONS
    if [[ $RUN_MIGRATIONS =~ ^[Yy]$ ]]; then
        echo "Running database migrations..."
        cd .. && npm run db:migrate
        
        if [ $? -eq 0 ]; then
            echo "Migrations completed successfully."
            
            # Ask if user wants to seed the database
            read -p "Do you want to seed the database with initial data? (y/n): " SEED_DB
            if [[ $SEED_DB =~ ^[Yy]$ ]]; then
                echo "Seeding database..."
                npm run db:seed:all
                
                if [ $? -eq 0 ]; then
                    echo "Database seeded successfully."
                else
                    echo "Error: Failed to seed database."
                fi
            fi
        else
            echo "Error: Failed to run migrations."
        fi
    fi
    
    echo ""
    echo "Setup complete! You can now start the server with: npm run dev"
else
    echo "Database setup failed. Please check your MySQL installation and root password."
fi
