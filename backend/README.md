# Student Housing Backend API

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example` and update values)

3. Start the server:
```bash
npm run dev
```

## API Endpoints

### Authentication

#### Register
**POST** `/api/users/register`

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student",
  "phone": "+250788123456",
  "university": "University of Rwanda"
}
```

Response (201):
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "phone": "+250788123456",
      "university": "University of Rwanda",
      "avatar": null,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
**POST** `/api/users/login`

Request body (basic login):
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Request body (role-based login - recommended):
```json
{
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

**Note:** Including the `role` field ensures users login through the correct portal (student/landlord/admin). If the account role doesn't match, a 403 error is returned.

Response (200):
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "phone": "+250788123456",
      "university": "University of Rwanda",
      "avatar": null,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

Error Response (403 - Wrong Role):
```json
{
  "status": "error",
  "message": "This account is not registered as a landlord. Please use the correct login portal."
}
```

#### Get Current User
**GET** `/api/users/me`

Headers:
```
Authorization: Bearer <token>
```

Response (200):
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "phone": "+250788123456",
      "university": "University of Rwanda",
      "avatar": null,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

## Testing with cURL

### Test Register:
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "student",
    "phone": "+250788123456",
    "university": "University of Rwanda"
  }'
```

### Test Login:
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Test Get Current User:
```bash
curl http://localhost:5000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test Health Check:
```bash
curl http://localhost:5000/api/health
```

## Testing with Postman

1. Create a new POST request to `http://localhost:5000/api/users/register`
2. Set header: `Content-Type: application/json`
3. Add JSON body with user data
4. Send request

## Project Structure

```
backend/
├── src/
│   ├── controllers/       # Business logic
│   ├── routes/           # Route definitions
│   ├── models/           # Database models
│   ├── middlewares/      # Custom middleware
│   ├── utils/            # Utility functions
│   └── server.ts         # Main server file
├── .env                  # Environment variables
├── test-signup.http      # API test file
├── package.json
└── tsconfig.json
```
