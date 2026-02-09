# Smart Leave Management System - Azure Deployment Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Azure Resources Setup](#azure-resources-setup)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [GitHub Actions Configuration](#github-actions-configuration)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)
8. [Cleanup](#cleanup)

---

## 1. Prerequisites

Before starting, ensure you have:

- ✅ **Azure Account** (Azure for Students preferred - Free tier available)
- ✅ **GitHub Account** (Repository: https://github.com/Sid770/Smart-Leave-Management)
- ✅ **Local Development Environment**:
  - Node.js 20.x or higher
  - .NET SDK 10.0 installed
  - Angular CLI installed globally: `npm install -g @angular/cli`
  - Git installed

---

## 2. Azure Resources Setup

### Step 2.1: Create Resource Group

1. Open [Azure Portal](https://portal.azure.com)
2. Click **Create a resource**
3. Search for **Resource Group**
4. Click **Create**
5. Fill in details:
   - **Subscription**: Your Azure subscription
   - **Resource group name**: `LeaveManagement-RG`
   - **Region**: Choose nearest region (e.g., East US)
6. Click **Review + Create** → **Create**

### Step 2.2: Create Azure Storage Account

1. In Azure Portal, click **Create a resource**
2. Search for **Storage account**
3. Click **Create**
4. Fill in details:
   - **Resource Group**: `LeaveManagement-RG`
   - **Storage account name**: `leavemanagementstorage` (must be unique globally)
   - **Region**: Same as Resource Group
   - **Performance**: Standard
   - **Redundancy**: LRS (Locally Redundant Storage)
5. Click **Review + Create** → **Create**
6. Wait for deployment to complete

### Step 2.3: Create Azure Tables

1. Open the created Storage Account
2. Navigate to **Data storage** → **Tables**
3. Click **+ Table**
4. Create two tables:
   - Table name: `Users`
   - Table name: `LeaveRequests`
5. Click **OK** to create each table

### Step 2.4: Get Storage Connection String

1. In Storage Account, go to **Security + networking** → **Access keys**
2. Click **Show keys**
3. Copy **Connection string** under key1
4. Save this for later use in App Service configuration

---

## 3. Backend Deployment (.NET API)

### Step 3.1: Create Azure App Service

1. In Azure Portal, click **Create a resource**
2. Search for **App Service**
3. Click **Create** → **Web App**
4. Fill in details:
   - **Resource Group**: `LeaveManagement-RG`
   - **Name**: `leave-management-api` (must be unique, this becomes your URL)
   - **Publish**: Code
   - **Runtime stack**: .NET 10 (or latest available)
   - **Operating System**: Windows
   - **Region**: Same as Resource Group
   - **Pricing plan**: F1 (Free) - Click "Explore pricing plans" if not visible
5. Click **Review + Create** → **Create**
6. Wait for deployment

### Step 3.2: Configure App Service Settings

1. Open the created App Service
2. Go to **Settings** → **Configuration**
3. Click **+ New application setting** and add:

| Name | Value |
|------|-------|
| `StorageConnection` | Your Storage Account connection string from Step 2.4 |
| `ASPNETCORE_ENVIRONMENT` | `Production` |

4. Click **Save** → **Continue**
5. **Restart** the App Service

### Step 3.3: Get Publish Profile

1. In App Service, click **Overview**
2. Click **Get publish profile** (top menu)
3. Save the downloaded `.PublishSettings` file
4. Open the file and copy all contents

### Step 3.4: Configure GitHub Secrets for Backend

1. Go to your GitHub repository: https://github.com/Sid770/Smart-Leave-Management
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add secret:
   - **Name**: `AZURE_WEBAPP_PUBLISH_PROFILE`
   - **Value**: Paste the entire publish profile XML content
5. Click **Add secret**

### Step 3.5: Update Backend Workflow

1. Edit `.github/workflows/deploy-backend.yml`
2. Update line 13:
   ```yaml
   AZURE_WEBAPP_NAME: 'leave-management-api'  # Your App Service name
   ```
3. Commit and push changes

---

## 4. Frontend Deployment (Angular)

### Step 4.1: Create Azure Static Web App

1. In Azure Portal, click **Create a resource**
2. Search for **Static Web Apps**
3. Click **Create**
4. Fill in details:
   - **Resource Group**: `LeaveManagement-RG`
   - **Name**: `leave-management-frontend`
   - **Region**: Choose nearest
   - **Hosting plan**: Free
   - **Deployment source**: GitHub
5. Click **Sign in with GitHub** and authorize
6. Select:
   - **Organization**: Your GitHub account
   - **Repository**: `Smart-Leave-Management`
   - **Branch**: `main`
7. Build Details:
   - **Build Presets**: Angular
   - **App location**: `/`
   - **Output location**: `dist/hcl2/browser`
8. Click **Review + Create** → **Create**

### Step 4.2: Get Static Web App Token

Azure automatically creates a GitHub Actions workflow, but you need to verify:

1. In Azure Static Web App, go to **Settings** → **Overview**
2. Click **Manage deployment token**
3. Copy the token
4. Go to GitHub repository **Settings** → **Secrets and variables** → **Actions**
5. Verify secret exists: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - If not, create it with the copied token

### Step 4.3: Update Frontend Environment

1. Edit `src/environments/environment.prod.ts`
2. Update the API URL:
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://leave-management-api.azurewebsites.net/api'
   };
   ```
3. Replace `leave-management-api` with your actual App Service name

---

## 5. GitHub Actions Configuration

### Step 5.1: Push Code to GitHub

Initialize Git and push to your repository:

```bash
# Navigate to project root
cd "b:\OneDrive - Amity University\Desktop\hcl hack\hcl2"

# Initialize git (if not already done)
git init

# Add remote
git remote add origin https://github.com/Sid770/Smart-Leave-Management.git

# Add all files
git add .

# Commit
git commit -m "Initial commit - Azure deployment ready"

# Push to main branch
git branch -M main
git push -u origin main
```

### Step 5.2: Verify GitHub Actions

1. Go to GitHub repository
2. Click **Actions** tab
3. You should see two workflows:
   - ✅ Deploy .NET API to Azure App Service
   - ✅ Deploy Angular App to Azure Static Web Apps
4. Both should start automatically and turn green ✓

---

## 6. Testing Deployment

### Step 6.1: Test Backend API

1. Open browser and navigate to:
   ```
   https://leave-management-api.azurewebsites.net
   ```
2. You should see **Swagger UI** documentation
3. Test an endpoint:
   - Expand `POST /api/auth/login`
   - Click **Try it out**
   - Enter demo credentials:
     ```json
     {
       "username": "manager1",
       "password": "manager123"
     }
     ```
   - Click **Execute**
   - Verify you get a 200 response with user data

### Step 6.2: Test Frontend Application

1. In Azure Portal, open **Static Web App**
2. Copy the **URL** from Overview page
3. Open in browser
4. You should see the login page
5. Login with demo credentials:
   - Username: `manager1`
   - Password: `manager123`
6. Verify dashboard loads and functionality works

### Step 6.3: End-to-End Test

1. Login as Employee (`employee1` / `employee123`)
2. Apply for leave with future dates
3. Logout
4. Login as Manager (`manager1` / `manager123`)
5. View team leaves and approve/reject
6. Verify calendar view works

---

## 7. Troubleshooting

### Issue: CORS Error

**Solution**:
- Verify CORS is configured in `Program.cs` with `AllowAll` policy
- Restart App Service
- Clear browser cache

### Issue: 403 Forbidden on API

**Solution**:
- Verify `StorageConnection` is set in App Service Configuration
- Check connection string format
- Restart App Service

### Issue: Frontend Shows Blank Page

**Solution**:
- Check browser console for errors
- Verify `environment.prod.ts` has correct API URL
- Rebuild and redeploy: `git commit --allow-empty -m "Trigger deploy" && git push`

### Issue: API Works Locally but Not on Azure

**Solution**:
- Check App Service logs:
  - Go to **Monitoring** → **Log stream**
- Verify .NET runtime version matches
- Check `web.config` is deployed

### Issue: GitHub Actions Failing

**Solution**:
- Check workflow logs in GitHub Actions tab
- Verify secrets are set correctly
- Ensure publish profile is valid (re-download if needed)

### Issue: Database Not Persisting Data

**Solution**:
- SQLite is file-based and will reset on App Service restart
- For production, configure Azure SQL Database or use Azure Table Storage
- Current setup uses both SQLite (local) and Azure Tables (cloud)

---

## 8. Swagger Configuration for Azure

Swagger is already configured and will be available at:

```
https://your-api-name.azurewebsites.net/
```

Features enabled:
- ✅ Interactive API documentation
- ✅ Try-it-out functionality
- ✅ Request/Response schemas
- ✅ Authentication testing
- ✅ Available in production

To customize Swagger:
1. Edit `Program.cs` SwaggerGen configuration
2. Add XML comments for detailed documentation
3. Redeploy to Azure

---

## 9. Important URLs

After deployment, save these URLs:

| Service | URL |
|---------|-----|
| **Backend API (Swagger)** | `https://leave-management-api.azurewebsites.net` |
| **Frontend App** | `https://<unique-name>.azurestaticapps.net` |
| **GitHub Repository** | `https://github.com/Sid770/Smart-Leave-Management` |
| **Azure Portal** | `https://portal.azure.com` |

---

## 10. Cleanup After Hackathon

To avoid any charges and clean up resources:

1. Go to Azure Portal
2. Navigate to **Resource Groups**
3. Select `LeaveManagement-RG`
4. Click **Delete resource group**
5. Type the resource group name to confirm
6. Click **Delete**

This will delete:
- App Service
- Static Web App
- Storage Account
- All associated resources

---

## 11. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Azure Cloud Platform                     │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Azure Static Web Apps (Frontend)             │   │
│  │              Angular Application                      │   │
│  │         https://<app>.azurestaticapps.net            │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     │                                         │
│                     │ HTTPS Requests                          │
│                     ▼                                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │      Azure App Service (Backend)                     │   │
│  │          .NET Web API + Swagger                      │   │
│  │     https://<api>.azurewebsites.net                 │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     │                                         │
│                     │ Connection String                       │
│                     ▼                                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │       Azure Storage Account                          │   │
│  │         Tables: Users, LeaveRequests                 │   │
│  │    + Local SQLite for development                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                          ▲
                          │ CI/CD Pipeline
                          │
                ┌─────────┴──────────┐
                │  GitHub Actions    │
                │  Auto Deploy on    │
                │    git push        │
                └────────────────────┘
```

---

## 12. Cost Estimate

All services used are **FREE tier**:

- ✅ Azure App Service (F1): Free
- ✅ Azure Static Web Apps: Free
- ✅ Azure Storage Account (5GB): Free with students subscription
- ✅ GitHub Actions: 2000 minutes/month free

**Total Monthly Cost: $0.00** (within free limits)

---

## 13. Demo Credentials

### Manager Account
- **Username**: `manager1`
- **Password**: `manager123`
- **Role**: Manager
- **Permissions**: View team leaves, approve/reject requests

### Employee Accounts
- **Username**: `employee1` or `employee2`
- **Password**: `employee123`
- **Role**: Employee
- **Permissions**: Apply for leave, view own leaves

---

## 14. Support & Documentation

- **GitHub Issues**: https://github.com/Sid770/Smart-Leave-Management/issues
- **Azure Documentation**: https://docs.microsoft.com/azure
- **Angular Documentation**: https://angular.dev
- **.NET Documentation**: https://docs.microsoft.com/dotnet

---

## ✅ Deployment Checklist

- [ ] Azure Resource Group created
- [ ] Storage Account created with Tables
- [ ] App Service created for backend
- [ ] Static Web App created for frontend
- [ ] Storage connection string configured
- [ ] GitHub secrets added
- [ ] Code pushed to GitHub
- [ ] GitHub Actions workflows completed successfully
- [ ] Backend API accessible with Swagger
- [ ] Frontend application loads correctly
- [ ] Login functionality works
- [ ] Leave management features functional
- [ ] Calendar view displays correctly

---

**🎉 Congratulations! Your Smart Leave Management System is now live on Azure!**

For any issues or questions, refer to the Troubleshooting section or check GitHub Actions logs.
