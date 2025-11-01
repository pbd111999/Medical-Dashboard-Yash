# Medical Record Dashboard - Setup Instructions

## Prerequisites

- Node.js (v18 or higher)
- .NET 8 SDK
- MySQL Server
- Git

## Database Setup

1. Install MySQL Server and create a database:
```sql
CREATE DATABASE MedicalRecordDB;
```

2. Run the setup script:
```bash
mysql -u root -p MedicalRecordDB < database/setup.sql
```

3. Update the connection string in `backend/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=MedicalRecordDB;User=your_username;Password=your_password;"
  }
}
```

## Backend Setup (.NET API)

1. Navigate to the backend directory:
```bash
cd backend
```

2. Restore NuGet packages:
```bash
dotnet restore
```

3. Update the JWT secret key in `appsettings.json` (use a secure 32+ character string):
```json
{
  "JwtSettings": {
    "SecretKey": "your-super-secret-key-that-is-at-least-32-characters-long"
  }
}
```

4. Create the uploads directory:
```bash
mkdir -p wwwroot/uploads/profiles
mkdir -p wwwroot/uploads/medical-files
```

5. Run the API:
```bash
dotnet run
```

The API will be available at `http://localhost:5000`

## Frontend Setup (Next.js)

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Update the API URL in `.env.local` if needed:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Add a default avatar image:
   - Place a default avatar image at `public/default-avatar.png`
   - Or use any placeholder image service

5. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Features

### Authentication
- ✅ User signup with full name, email, gender, phone, password
- ✅ Session-based authentication using JWT tokens
- ✅ Login/logout functionality

### User Profile
- ✅ Display and edit personal details (email, gender, phone)
- ✅ Profile image upload and management
- ✅ Save changes via API

### File Management
- ✅ Upload medical files (PDF, images)
- ✅ File type categorization (Lab Report, Prescription, X-Ray, etc.)
- ✅ File preview in modal
- ✅ Download files
- ✅ Delete files
- ✅ File size validation (10MB max)

### Dashboard Layout
- ✅ Clean, responsive design with TailwindCSS
- ✅ Component-based architecture
- ✅ Left side: User profile management
- ✅ Right side: File upload form
- ✅ Bottom: Uploaded files list with preview

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### User Management
- `PUT /api/user/profile` - Update user profile

### File Management
- `POST /api/files/upload` - Upload medical file
- `GET /api/files` - Get user's files
- `DELETE /api/files/{id}` - Delete file
- `GET /api/files/download/{id}` - Download file

## Security Features

- JWT token-based authentication
- Password hashing with BCrypt
- File type validation
- File size limits
- User-specific file access
- CORS configuration

## Production Deployment

1. **Frontend**: Build and deploy to Vercel, Netlify, or similar
2. **Backend**: Deploy to Azure, AWS, or similar cloud provider
3. **Database**: Use managed MySQL service (Azure Database, AWS RDS, etc.)
4. **File Storage**: Consider using cloud storage (Azure Blob, AWS S3) for production

## Troubleshooting

1. **Database Connection Issues**: Verify MySQL is running and credentials are correct
2. **CORS Errors**: Ensure frontend URL is added to CORS policy in backend
3. **File Upload Issues**: Check file permissions and upload directory exists
4. **JWT Errors**: Verify JWT secret key is properly configured