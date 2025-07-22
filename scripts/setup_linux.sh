#!/bin/bash
set -e

# Installs project dependencies on Linux

if ! command -v node >/dev/null 2>&1; then
    echo "Node.js not found. Attempting to install..."
    if command -v apt-get >/dev/null 2>&1; then
        sudo apt-get update
        sudo apt-get install -y nodejs npm
    elif command -v yum >/dev/null 2>&1; then
        sudo yum install -y nodejs npm
    else
        echo "Package manager not supported. Please install Node.js manually."
        exit 1
    fi
fi

if ! command -v mongod >/dev/null 2>&1; then
    echo "MongoDB not found. Attempting to install..."
    if command -v apt-get >/dev/null 2>&1; then
        sudo apt-get update
        sudo apt-get install -y mongodb
    elif command -v yum >/dev/null 2>&1; then
        sudo yum install -y mongodb
    else
        echo "Package manager not supported. Please install MongoDB manually."
        exit 1
    fi
fi

npm install

echo "Dependencies installed"
