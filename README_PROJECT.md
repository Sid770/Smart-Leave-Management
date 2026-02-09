# Smart Leave Management System

A full-stack web application for managing employee leave requests with role-based access (Employee/Manager) built with .NET Web API and Angular.

## 🎯 Features

### Core Features (MVP)
- ✅ User login (Employee / Manager role)
- ✅ Apply for leave (date range + reason)
- ✅ Manager can approve/reject leave requests
- ✅ Leave status tracking (Pending, Approved, Rejected)
- ✅ Dashboard with leave summary and statistics
- ✅ Calendar view for visualizing leaves
- ✅ Clean, modern UI/UX with gradient designs

### Additional Features
- 📊 Real-time dashboard with metrics
- 📅 Interactive calendar view
- 🔄 Responsive design (mobile-friendly)
- 🎨 World-class UI with smooth animations
- ✅ Unit tests for leave validation and approval flow
- 🔒 Role-based access control
- 📝 Manager comments on leave requests

## 🚀 Technology Stack

### Backend
- **.NET 10.0** - Web API
- **Entity Framework Core** - ORM
- **SQLite** - Database
- **Swagger** - API documentation
- **xUnit** - Unit testing

### Frontend
- **Angular 21.1.0** - Framework
- **TypeScript** - Programming language
- **RxJS** - Reactive programming
- **Signals** - State management
- **CSS3** - Styling with gradients and animations

## 📦 Project Structure

```
hcl2/
├── LeaveManagementAPI/          # .NET Backend
│   ├── Controllers/
│   │   ├── AuthController.cs
│   │   └── LeaveRequestsController.cs
│   ├── Models/
│   │   ├── User.cs
│   │   └── LeaveRequest.cs
│   ├── DTOs/
│   ├── Data/
│   │   └── ApplicationDbContext.cs
│   ├── Tests/
│   │   └── LeaveManagementTests.cs
│   └── Program.cs
│
└── src/                         # Angular Frontend
    └── app/
        ├── components/
        │   ├── login.component.ts
        │   ├── dashboard.component.ts
        │   ├── apply-leave.component.ts
        │   └── leave-list.component.ts
        ├── services/
        │   ├── auth.service.ts
        │   └── leave.service.ts
        ├── models/
        ├── guards/
        └── app.routes.ts
```

## 🔧 Installation & Setup

### Prerequisites
- .NET SDK 10.0 or higher
- Node.js 20.x or higher
- npm 10.x or higher

### Backend Setup

1. Navigate to the API directory:
```bash
cd LeaveManagementAPI
```

2. Restore dependencies:
```bash
dotnet restore
```

3. Run the API:
```bash
dotnet run --urls "http://localhost:5000"
```

The API will be available at:
- **Swagger UI**: http://localhost:5000
- **API Base**: http://localhost:5000/api

### Frontend Setup

1. Navigate to the project root:
```bash
cd hcl2
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The Angular app will be available at: **http://localhost:4200**

## 🧪 Running Tests

### Backend Unit Tests

```bash
cd LeaveManagementAPI
dotnet test
```

Tests include:
- Leave validation logic (date ranges, past dates, required fields)
- Approval flow validation
- Status transition rules

## 👥 Demo Credentials

### Manager Account
- **Username**: manager1
- **Password**: manager123
- **Role**: Manager
- **Capabilities**: View team leaves, approve/reject requests

### Employee Accounts
- **Username**: employee1
- **Password**: employee123
- **Role**: Employee
- **Capabilities**: Apply for leave, view own leaves

- **Username**: employee2
- **Password**: employee123
- **Role**: Employee

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/users` - Get all users

### Leave Requests
- `GET /api/leaverequests` - Get leave requests (with filters)
- `GET /api/leaverequests/{id}` - Get specific leave request
- `GET /api/leaverequests/team/{managerId}` - Get team leave requests
- `GET /api/leaverequests/dashboard/{userId}` - Get dashboard data
- `POST /api/leaverequests` - Create leave request
- `PUT /api/leaverequests/{id}/status` - Update leave status (approve/reject)
- `DELETE /api/leaverequests/{id}` - Delete pending leave request

## 🎨 UI/UX Features

- **Modern Design**: Gradient backgrounds, smooth transitions, card-based layouts
- **Interactive Calendar**: Visual representation of leave requests with color-coded status
- **Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **Status Indicators**: Color-coded badges (Pending: Yellow, Approved: Green, Rejected: Red)
- **Real-time Feedback**: Loading states, success/error messages
- **Role-based UI**: Different views for employees and managers

## 🔐 Security Features

- Authentication required for all protected routes
- Role-based access control
- Auth guard protecting routes
- Token-based session management

## 📊 Database Schema

### Users Table
- Id, Username, Email, Password, Role, FullName, ManagerId, CreatedAt

### LeaveRequests Table
- Id, UserId, StartDate, EndDate, Reason, Status, ManagerComment, CreatedAt, ReviewedAt, ReviewedBy

## 🚀 Working Links

Once both applications are running, you can access:

1. **Frontend Application**: http://localhost:4200
   - Login page with demo credentials
   - Employee/Manager dashboards
   - Leave application forms
   - Calendar view

2. **Backend API (Swagger)**: http://localhost:5000
   - Interactive API documentation
   - Test all endpoints
   - View request/response schemas

3. **API Base URL**: http://localhost:5000/api
   - RESTful API endpoints
   - JSON responses

## 📝 Development Notes

- Database is automatically created on first run (SQLite)
- Sample data is seeded including users and leave requests
- CORS is configured to allow Angular app on port 4200
- All unit tests pass (11 tests)

## 🎯 Evaluation Criteria Met

✅ **Clean UI** - Modern, gradient-based design with calendar view  
✅ **API Design** - RESTful, well-structured endpoints  
✅ **Unit Tests** - Leave validation logic and approval flow  
✅ **Functionality** - All MVP features implemented  
✅ **Code Quality** - Clean, maintainable, well-organized  

## 📌 Future Enhancements

- Email notifications for leave approvals/rejections
- Leave balance tracking
- Multiple leave types (vacation, sick, personal)
- Leave history and reports
- Export functionality (PDF, Excel)
- Mobile app version

---

Built with ❤️ for HCL Hackathon - February 2026
