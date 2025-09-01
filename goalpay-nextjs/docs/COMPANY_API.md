# Company API Documentation

## Overview
The Company API allows users to manage their employment history and company information within the GoalPay system.

## Base URL
```
https://your-domain.com/api/companies
```

## Authentication
All endpoints require authentication via JWT token in cookies.

## Endpoints

### GET /api/companies
Retrieve all companies for the authenticated user.

**Response:**
```json
{
  "companies": [
    {
      "id": "string",
      "userId": "string", 
      "name": "string",
      "industry": "string",
      "employee_count": "string",
      "location": "string",
      "default_currency": "string",
      "startDate": "datetime",
      "endDate": "datetime",
      "position": "string",
      "isActive": "boolean",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  ]
}
```

### POST /api/companies
Create a new company record.

**Request Body Schema:**
```json
{
  "name": "string (required)",
  "industry": "string (optional)",
  "employee_count": "string (optional)",
  "location": "string (optional)", 
  "default_currency": "string (optional)",
  "startDate": "string (required, ISO date)",
  "endDate": "string (optional, ISO date)",
  "position": "string (optional)"
}
```

**Field Descriptions:**
- `name`: Company name (required)
- `industry`: Industry sector (optional)
- `employee_count`: Company size from enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"] (optional)
- `location`: Company location (optional)
- `default_currency`: Default currency from enum: ["JPY", "USD", "CNY", "TWD"], defaults to "JPY" (optional)
- `startDate`: Employment start date in ISO format (required)
- `endDate`: Employment end date in ISO format (optional)
- `position`: Job position/title (optional)

**Response:**
```json
{
  "company": {
    "id": "string",
    "userId": "string",
    "name": "string",
    "industry": "string",
    "employee_count": "string", 
    "location": "string",
    "default_currency": "string",
    "startDate": "datetime",
    "endDate": "datetime",
    "position": "string",
    "isActive": "boolean",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

## Data Types

### CompanySize Enum
```typescript
type CompanySize = 
  | "1-10"
  | "11-50"
  | "51-200" 
  | "201-500"
  | "501-1000"
  | "1000+";
```

### Currency Enum
```typescript
type Currency = "JPY" | "USD" | "CNY" | "TWD";
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Company name and start date are required"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Example Usage

### Create a Company
```bash
curl -X POST https://your-domain.com/api/companies \
  -H "Content-Type: application/json" \
  -H "Cookie: token=your-jwt-token" \
  -d '{
    "name": "TechCorp Inc",
    "industry": "Technology",
    "employee_count": "51-200",
    "location": "Tokyo, Japan",
    "default_currency": "JPY",
    "startDate": "2023-01-15",
    "position": "Software Engineer"
  }'
```

### Get All Companies
```bash
curl -X GET https://your-domain.com/api/companies \
  -H "Cookie: token=your-jwt-token"
```

## Notes
- The `default_currency` field defaults to "JPY" if not specified
- `employee_count` and `default_currency` use predefined enum values for data consistency
- All dates should be provided in ISO 8601 format (YYYY-MM-DD)
- The API automatically sets `isActive` to true for new companies
