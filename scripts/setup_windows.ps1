$ErrorActionPreference = 'Stop'

Write-Host "Checking for Node.js..."
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js not found. Attempting to install via winget..."
    if (Get-Command winget -ErrorAction SilentlyContinue) {
        winget install -e --id OpenJS.NodeJS
    }
    else {
        Write-Host "winget not available. Please install Node.js manually."
        exit 1
    }
}

Write-Host "Checking for MongoDB..."
if (-not (Get-Command mongod -ErrorAction SilentlyContinue)) {
    Write-Host "MongoDB not found. Attempting to install via winget..."
    if (Get-Command winget -ErrorAction SilentlyContinue) {
        winget install -e --id MongoDB.Server
    }
    else {
        Write-Host "winget not available. Please install MongoDB manually."
        exit 1
    }
}

Write-Host "Installing npm dependencies..."
npm install

Write-Host "Dependencies installed"

