# Smart Leave Management System

🏢 A full-stack web application for managing employee leave requests with role-based access control, built with Angular and .NET Web API.

[![Azure Deployment](https://img.shields.io/badge/Azure-Deployed-blue)](https://azure.microsoft.com)
[![.NET](https://img.shields.io/badge/.NET-10.0-purple)](https://dotnet.microsoft.com)
[![Angular](https://img.shields.io/badge/Angular-21.1.0-red)](https://angular.dev)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🌟 Features

### Core Functionality
- ✅ **User Authentication** - Role-based login (Employee/Manager)
- ✅ **Leave Application** - Apply for leave with date range and reason
- ✅ **Approval Workflow** - Managers can approve/reject leave requests
- ✅ **Status Tracking** - Real-time status updates (Pending/Approved/Rejected)
- ✅ **Dashboard** - Statistics and metrics visualization
- ✅ **Calendar View** - Visual representation of all leave requests
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile

### Technical Features
- 🔐 **Secure Authentication** - Token-based session management
- 📊 **RESTful API** - Clean, documented API with Swagger
- 🎨 **Modern UI/UX** - Gradient designs with smooth animations
- ☁️ **Azure Integration** - Ready for cloud deployment
- 🧪 **Unit Tests** - Comprehensive test coverage
- 🚀 **CI/CD** - Automated deployment with GitHub Actions

## 🛠️ Technology Stack

### Backend
- **.NET 10.0** - Web API Framework
- **Entity Framework Core** - ORM
- **SQLite** - Local Database
- **Azure Table Storage** - Cloud Storage
- **Swagger/OpenAPI** - API Documentation
- **xUnit** - Testing Framework

### Frontend
- **Angular 21.1.0** - Framework
- **TypeScript 5.9** - Programming Language
- **RxJS 7.8** - Reactive Programming
- **Angular Signals** - State Management
- **CSS3** - Styling with modern features

### Cloud & DevOps
- **Azure App Service** - Backend hosting
- **Azure Static Web Apps** - Frontend hosting
- **Azure Storage Account** - Data persistence
- **GitHub Actions** - CI/CD Pipeline

## 📁 Project Structure

```
Smart-Leave-Management/
├── .github/
│   └── workflows/
│       ├── deploy-backend.yml
│       └── deploy-frontend.yml
├── LeaveManagementAPI/
│   ├── Controllers/
│   ├── Models/
│   ├── DTOs/
│   ├── Data/
│   ├── Tests/
│   ├── Program.cs
│   └── web.config
├── src/
│   ├── app/
│   │   ├── components/
│   │   ├── services/
│   │   ├── models/
│   │   ├── guards/
│   │   └── app.routes.ts
│   └── environments/
├── AZURE_DEPLOYMENT_GUIDE.md
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x or higher
- .NET SDK 10.0
- Angular CLI: `npm install -g @angular/cli`
- Azure Account (for deployment)

### Local Development

#### 1. Clone Repository
```bash
git clone https://github.com/Sid770/Smart-Leave-Management.git
cd Smart-Leave-Management
```

#### 2. Backend Setup
```bash
cd LeaveManagementAPI
dotnet restore
dotnet run --urls "http://localhost:5000"
```
API will be available at http://localhost:5000

#### 3. Frontend Setup
```bash
# Open new terminal in project root
npm install
npm start
```
App will be available at http://localhost:4200

### Running Tests
```bash
cd LeaveManagementAPI
dotnet test
```

## ☁️ Azure Deployment

Complete deployment guide is available in [AZURE_DEPLOYMENT_GUIDE.md](./AZURE_DEPLOYMENT_GUIDE.md)

### Quick Deployment Steps:

1. **Create Azure Resources**
   - Resource Group
   - Storage Account with Tables
   - App Service for Backend
   - Static Web App for Frontend

2. **Configure GitHub Secrets**
   - `AZURE_WEBAPP_PUBLISH_PROFILE`
   - `AZURE_STATIC_WEB_APPS_API_TOKEN`

3. **Push to GitHub**
   ```bash
   git push origin main
   ```

4. **GitHub Actions automatically deploys both applications**

## 🔑 Demo Credentials

### Manager Account
- **Username**: `manager1`
- **Password**: `manager123`
- **Capabilities**: View team leaves, approve/reject requests

### Employee Accounts
- **Username**: `employee1` or `employee2`
- **Password**: `employee123`
- **Capabilities**: Apply for leave, view own requests

## 📚 API Documentation

Swagger documentation is available at:
- **Local**: http://localhost:5000
- **Azure**: https://your-api-name.azurewebsites.net

### Key Endpoints

```
POST   /api/auth/login              - User authentication
GET    /api/auth/users              - Get all users

GET    /api/leaverequests           - Get leave requests
POST   /api/leaverequests           - Create leave request
PUT    /api/leaverequests/{id}/status - Update status
DELETE /api/leaverequests/{id}     - Delete request
GET    /api/leaverequests/dashboard/{userId} - Dashboard data
GET    /api/leaverequests/team/{managerId}   - Team requests
```

## 🧪 Testing

### Unit Tests (Backend)
- ✅ Leave validation logic
- ✅ Date range validation
- ✅ Approval flow tests
- ✅ Status transition validation

Run tests:
```bash
cd LeaveManagementAPI
dotnet test
```

### Test Results
```
Total: 11 tests
Passed: 11
Failed: 0
Duration: <10 seconds
```

## 📱 Screenshots

### Login Page
Modern gradient design with demo credentials

### Dashboard
Statistics cards showing total, pending, approved, and rejected leaves

### Calendar View
Visual representation of all leave requests with color-coded status

### Leave Application
Clean form with date validation and reason input

## 🔧 Configuration

### Backend Configuration (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=leavemanagement.db"
  },
  "StorageConnection": "UseDevelopmentStorage=true"
}
```

### Frontend Configuration
Update `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api-name.azurewebsites.net/api'
};
```

## 🐛 Troubleshooting

### CORS Issues
- Verify CORS policy in `Program.cs`
- Restart App Service
- Clear browser cache

### Database Not Persisting
- Check Azure Storage connection string
- Verify tables are created
- Review App Service logs

### Frontend Blank Page
- Check browser console
- Verify API URL in environment files
- Rebuild: `npm run build -- --configuration production`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Siddharth Sharma** - [GitHub](https://github.com/Sid770)

## 🙏 Acknowledgments

- HCL Hackathon 2026
- Azure for Students Program
- Angular and .NET Communities

## 📞 Support

For issues and questions:
- 📧 Email: support@leavemanagement.com
- 🐛 Issues: [GitHub Issues](https://github.com/Sid770/Smart-Leave-Management/issues)
- 📖 Docs: [Deployment Guide](./AZURE_DEPLOYMENT_GUIDE.md)

## 🎯 Roadmap

- [ ] Email notifications
- [ ] Leave balance tracking
- [ ] Multiple leave types
- [ ] Mobile app (iOS/Android)
- [ ] Reports and analytics
- [ ] Integration with HR systems

---

**⭐ Star this repository if you find it helpful!**

**🚀 Built with ❤️ for HCL Hackathon 2026**
