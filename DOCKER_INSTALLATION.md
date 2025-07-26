# 🐳 Docker Installation Guide for Windows

## 📋 Prerequisites

Docker no está instalado en tu sistema. Sigue esta guía para instalarlo:

## 🚀 Installation Steps

### **Option 1: Docker Desktop (Recommended)**

1. **Download Docker Desktop:**
   - Visit: https://www.docker.com/products/docker-desktop/
   - Click "Download for Windows"

2. **System Requirements:**
   - Windows 10 64-bit: Pro, Enterprise, or Education (Build 19041 or higher)
   - OR Windows 11 64-bit
   - WSL 2 feature enabled
   - Virtualization enabled in BIOS

3. **Install Docker Desktop:**
   ```powershell
   # Run the installer as Administrator
   # Follow the installation wizard
   # Restart your computer when prompted
   ```

4. **Verify Installation:**
   ```powershell
   docker --version
   docker-compose --version
   ```

### **Option 2: Docker via Chocolatey**

```powershell
# Install Chocolatey (if not already installed)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install Docker Desktop
choco install docker-desktop
```

### **Option 3: Winget (Windows Package Manager)**

```powershell
# Install Docker Desktop
winget install Docker.DockerDesktop
```

## ⚙️ Post-Installation Setup

### **1. Enable WSL 2 (Required)**
```powershell
# Enable WSL feature
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

# Enable Virtual Machine Platform
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# Restart computer
shutdown /r /t 0

# Set WSL 2 as default version
wsl --set-default-version 2
```

### **2. Configure Docker Desktop**
1. Start Docker Desktop
2. Go to Settings → General
3. ✅ Enable "Use WSL 2 based engine"
4. ✅ Enable "Start Docker Desktop when you log in"

### **3. Test Docker Installation**
```powershell
# Test basic Docker functionality
docker run hello-world

# Test Docker Compose
docker-compose --version
```

## 🔧 Alternative: Development Without Docker

Si no puedes instalar Docker ahora, puedes desarrollar localmente:

### **1. Install FFmpeg Manually**
```powershell
# Using Chocolatey
choco install ffmpeg

# OR Download from: https://ffmpeg.org/download.html
# Extract to C:\ffmpeg
# Add C:\ffmpeg\bin to PATH
```

### **2. Install MongoDB**
```powershell
# Using Chocolatey
choco install mongodb

# OR MongoDB Atlas (cloud): https://www.mongodb.com/atlas
```

### **3. Setup Local Development**
```powershell
# Install dependencies
npm install

# Create .env file
copy .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

## 🐳 After Docker Installation

Once Docker is installed, return to the main project and run:

```powershell
# Verify Docker works
docker --version

# Build the project
npm run docker:build

# Start all services
npm run docker:up

# View logs
npm run docker:logs

# Stop services
npm run docker:down
```

## 🚨 Common Issues

### **Docker Desktop won't start**
- Ensure Hyper-V is enabled in Windows Features
- Check that virtualization is enabled in BIOS
- Run Docker Desktop as Administrator

### **WSL 2 Error**
```powershell
# Update WSL kernel
wsl --update

# Install a Linux distribution
wsl --install -d Ubuntu
```

### **Permission Denied**
```powershell
# Add your user to docker-users group
net localgroup docker-users "your-username" /add
# Restart computer
```

## 🎯 Next Steps

1. ✅ Install Docker Desktop
2. ✅ Enable WSL 2
3. ✅ Test Docker installation
4. ✅ Run `npm run docker:build`
5. ✅ Deploy to production

---

Una vez que Docker esté instalado, ¡tu aplicación estará lista para containerización! 🚀
