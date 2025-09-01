# GoalPay - Next.js 14 Application

A comprehensive financial assistant application for salary analysis and payroll management, built with Next.js 14, TypeScript, TailwindCSS, and Prisma.

## 🚀 Features

### Core Features
- **Authentication System** - Email/password signup, login, and logout
- **Payroll Management** - Manual payroll entry with comprehensive fields
- **Dashboard Analytics** - Yearly summaries and monthly breakdowns with charts
- **Export Functionality** - PDF and CSV export with customizable options
- **Dark/Light Theme** - Toggle between themes with persistent preferences
- **Responsive Design** - Mobile-first approach with TailwindCSS

### Payroll Fields
- Company information (name, division, employee details)
- Attendance tracking (days worked, leave, absences)
- Salary breakdown (base salary, allowances, gross/net)
- Deductions (taxes, insurance, other deductions)
- Payment methods (bank transfer, cash)
- Custom fields support

### Dashboard Features
- Yearly summary cards (total salary, deductions, net income)
- Monthly trend charts using Recharts
- Interactive data visualization
- Year selection for historical data

### Multi-Language Support
- **English, Japanese, and Chinese** language support
- **Salary Terms Guide** with detailed explanations
- **Interactive terminology** - click to view descriptions
- **Language persistence** - remembers user preference
- **Comprehensive coverage** - 20+ salary-related terms

## 🛠 Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS with dark mode support
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT with bcrypt password hashing
- **Charts**: Recharts for data visualization
- **Export**: jsPDF for PDF generation, csv-writer for CSV
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn package manager

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file in the root directory:
```env
# Database Configuration
DATABASE_URL="file:./dev.db"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-here-change-in-production"

# Next Auth
NEXTAUTH_SECRET="your-nextauth-secret-here-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Set Up Database
```bash
# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Seed initial data (salary terms)
npm run seed
```

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
goalpay-nextjs/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── payroll/       # Payroll management
│   │   │   ├── reports/       # Reports and analytics
│   │   │   ├── export/        # Export functionality
│   │   │   └── salary-terms/  # Multi-language salary terms
│   │   ├── dashboard/         # Dashboard page
│   │   ├── upload/            # Payroll upload page
│   │   ├── reports/           # Reports page
│   │   ├── account/           # Account settings
│   │   └── login/             # Authentication page
│   ├── components/            # Reusable components
│   │   ├── Layout.tsx         # Main layout with navigation
│   │   ├── LanguageSelector.tsx # Language switcher
│   │   └── SalaryTermsGuide.tsx # Salary terms guide
│   ├── contexts/              # React contexts
│   │   ├── AuthContext.tsx    # Authentication state
│   │   ├── ThemeContext.tsx   # Theme management
│   │   └── LanguageContext.tsx # Language preferences
│   └── lib/                   # Utility functions
├── prisma/                    # Database schema and migrations
│   ├── schema.prisma          # Database models
│   └── seed.ts                # Initial data seeding
├── public/                    # Static assets
└── package.json
```

## 🔐 Authentication

The application uses JWT-based authentication with bcrypt password hashing:

- **Signup**: Create new account with email, password, and name
- **Login**: Authenticate with email and password
- **JWT Tokens**: Stored in HTTP-only cookies for security
- **Password Security**: Bcrypt hashing with salt rounds

## 💰 Payroll Management

### Required Fields
- Company Name
- Employee Number
- Employee Name
- Payroll Date
- Base Salary
- Gross Salary
- Net Pay

### Optional Fields
- Division
- Attendance details
- Allowances
- Deductions
- Insurance
- Income Tax
- Payment methods
- Custom fields

### Validation
- Automatic calculation of totals
- Validation of net pay vs deductions
- Payment total must equal net pay

## 📊 Dashboard & Analytics

### Summary Cards
- Total Salary (yearly)
- Total Deductions
- Net Income
- Payroll Count

### Charts
- Monthly breakdown (bar chart)
- Monthly trends (line chart)
- Income vs deductions (pie chart)

### Data Filtering
- Year selection dropdown
- Real-time data updates

## 📤 Export Functionality

### PDF Export
- Professional report layout
- Summary tables
- Payroll details
- Customizable content options

### CSV Export
- Raw data export
- Headers and formatting
- Date range filtering

### Export Options
- Format selection (PDF/CSV)
- Date range selection
- Content inclusion (tables/charts)

## 🌐 Multi-Language Support

### Supported Languages
- **中文 (zh)** - 預設語言 / Default language
- **日本語 (jp)** - Japanese
- **English (en)** - English

### Features
- **Language Selector** - Globe icon in navigation bar
- **Salary Terms Guide** - Interactive terminology with explanations
- **Persistent Preferences** - Language choice saved in localStorage
- **Comprehensive Coverage** - 20+ salary-related terms and definitions

### Salary Terms Included
- Basic salary concepts (Gross Salary, Base Salary, Allowance)
- Deductions (Income Tax, Health Insurance, Pension)
- Payment methods (Bank Transfer, Cash Payment)
- Special allowances (Overtime, Holiday Work, Night Work)
- Insurance types (Health, Pension, Unemployment, Nursing Care)

### How to Use
1. 應用程式預設使用繁體中文
2. 點擊導航欄中的地球圖示來切換語言
3. 在儀表板上查看薪資術語指南
4. 點擊任何術語查看詳細說明
5. 語言偏好會自動儲存

## 🎨 UI/UX Features

### Theme System
- Light and dark mode
- Persistent theme preference
- Smooth transitions
- TailwindCSS utility classes

### Responsive Design
- Mobile-first approach
- Grid layouts
- Flexible components
- Touch-friendly interface

### Navigation
- Clean navigation bar
- Active route highlighting
- User profile display
- Theme toggle

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Payroll
- `POST /api/payroll` - Create payroll entry
- `GET /api/payroll` - Get user payrolls

### Reports
- `GET /api/reports/summary` - Get salary summary
- `POST /api/export` - Export data (PDF/CSV)

### Integration
- `GET /api/integration` - Future API integration endpoint

### Multi-Language
- `GET /api/salary-terms?lang={language}` - Get salary terms for specified language

## 🗄 Database Schema

### Users Table
- ID, email, password, name
- Created/updated timestamps

### Payroll Table
- Comprehensive payroll fields
- User relationships
- Date tracking
- Custom fields support

### Salary Terms Table
- Multi-language salary terminology
- English, Japanese, and Chinese translations
- Detailed descriptions for each term
- Key-based lookup system

## 🚀 Future Enhancements

- Google OAuth integration
- File upload for payroll slips
- Advanced analytics and forecasting
- Multi-currency support
- API integrations with payroll systems
- Mobile app development
- Real-time notifications

## 🧪 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run seed         # Seed database with initial data
```

### Database Management
```bash
npx prisma studio    # Open Prisma Studio
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes
npx prisma migrate   # Run migrations
```

## 🔒 Security Features

- JWT token authentication
- HTTP-only cookies
- Password hashing with bcrypt
- Input validation
- SQL injection protection via Prisma
- CORS configuration

## 📱 Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Progressive Web App ready

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
- Check the documentation
- Contact the development team

---

**GoalPay** - Making salary analysis simple and insightful for workers in Japan and beyond.
