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
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── middlewares/      # Custom middleware
│   ├── utils/            # Utility functions
│   └── server.ts         # Main server file
├── .env                  # Environment variables
├── package.json
└── tsconfig.json
```
