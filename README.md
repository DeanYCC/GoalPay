# GoalPay - Financial Assistant App for Salary Analysis

GoalPay is a comprehensive financial assistant application designed for salary analysis, specifically targeting workers in Japan. The app supports multiple languages (Japanese, English, and Traditional Chinese) and provides detailed insights into salary trends, deductions, and financial planning.

## 🚀 Features

### Core Features (MVP)
- **Google OAuth Authentication** - Secure login with Google accounts
- **Multi-language Support** - Japanese (JP), English (EN), Traditional Chinese (ZH)
- **User Account Management** - Company info, language preferences, currency settings, theme options
- **Payroll Slip Management** - Upload and manually input payroll data
- **Payroll Terms Dictionary** - Comprehensive database of payroll items with multi-language support
- **Dashboard & Analytics** - Visual charts and reports for salary analysis
- **Export Functionality** - PDF and CSV export with customizable options

### Advanced Features
- **Salary Trend Analysis** - Monthly and yearly comparisons
- **Deduction Tracking** - Comprehensive breakdown of all deductions
- **Custom Payroll Terms** - User-defined payroll item definitions
- **Multi-currency Support** - JPY (default), USD, TWD
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🛠 Tech Stack

### Backend
- **Node.js** with Express.js framework
- **PostgreSQL** database with Sequelize ORM
- **Google OAuth 2.0** for authentication
- **JWT** for session management
- **jsPDF** for PDF generation
- **csv-writer** for CSV export
- **Multer** for file uploads

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **React Router** for navigation
- **i18next** for internationalization
- **Lucide React** for icons

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- Google OAuth 2.0 credentials
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd GoalPay
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Edit .env file with your configuration
# Set up database credentials, Google OAuth, and JWT secret

# Create PostgreSQL database
createdb goalpay

# Run database migrations
psql -d goalpay -f ../database/schema.sql

# Start the server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Environment Configuration

Create a `.env` file in the backend directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=goalpay
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Server Configuration
PORT=5000
NODE_ENV=development
```

## 🔧 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Set authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (development)
   - `https://yourdomain.com/api/auth/google/callback` (production)
6. Copy Client ID and Client Secret to your `.env` file

## 📊 Database Schema

The application uses the following main tables:
- `users` - User accounts and preferences
- `companies` - Company information
- `payroll_terms` - Payroll item definitions
- `payroll_slips` - Payroll slip records
- `payroll_items` - Individual payroll line items

## 🎨 UI Components

### Dashboard
- Salary overview cards
- Monthly trend charts
- Yearly comparison graphs
- Income vs deductions pie chart
- Export functionality

### Dictionary
- Searchable payroll terms
- Category-based filtering
- Multi-language support
- Custom term management

### Payroll Management
- File upload interface
- Manual data entry forms
- Historical data viewing
- Data validation

## 🌐 Internationalization

The app supports three languages:
- **Japanese (JP)** - 日本語
- **English (EN)** - English  
- **Traditional Chinese (ZH)** - 繁體中文

Language files are located in `frontend/src/i18n/locales/`

## 📱 Responsive Design

- Mobile-first approach
- Tailwind CSS responsive utilities
- Optimized for all screen sizes
- Touch-friendly interface

## 🔒 Security Features

- JWT-based authentication
- Google OAuth 2.0
- Rate limiting
- Input validation
- SQL injection protection
- CORS configuration

## 🚀 Deployment

### Backend Deployment
```bash
# Production build
npm run build

# Start production server
npm start
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy dist/ folder to your hosting service
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/companies` - Get user companies

### Payroll
- `GET /api/payroll/slips` - Get payroll slips
- `POST /api/payroll/slips` - Create payroll slip
- `PUT /api/payroll/slips/:id` - Update payroll slip
- `DELETE /api/payroll/slips/:id` - Delete payroll slip

### Dictionary
- `GET /api/dictionary/terms` - Get payroll terms
- `POST /api/dictionary/terms` - Create custom term
- `PUT /api/dictionary/terms/:id` - Update term
- `DELETE /api/dictionary/terms/:id` - Delete term

### Reports
- `GET /api/reports/summary` - Get salary summary
- `POST /api/reports/export/pdf` - Export to PDF
- `POST /api/reports/export/csv` - Export to CSV

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Features

- API integration with payroll systems
- Savings goal tracking
- Industry-level salary comparison
- AI-driven financial advice
- Mobile app development
- Advanced analytics and forecasting

---

**GoalPay** - Making salary analysis simple and insightful for workers in Japan and beyond.
