# WeatherWise 🌤️

A full-stack weather application built with React, TypeScript, Vite, Express.js, and MongoDB. Get real-time weather information with user authentication and location-based services.

## 🚀 Features

- Real-time weather data and forecasts
- User authentication and registration
- Location-based weather search
- Responsive modern UI with shadcn/ui components
- Weather suggestions and current conditions
- Session management with JWT tokens

## 🛠️ Tech Stack

**Frontend:**
- React 19 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- shadcn/ui components
- React Query for state management
- React Router for navigation

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose
- JWT authentication
- Passport.js for auth strategies
- bcryptjs for password hashing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **MongoDB** (see installation guides below)

### MongoDB Installation

#### Windows
1. Download MongoDB Community Server from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the setup wizard
3. Install as a Windows Service (recommended)
4. MongoDB will be available at `mongodb://localhost:27017`

#### Ubuntu/Debian
```bash
# Import the public key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Create a list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Reload local package database
sudo apt-get update

# Install MongoDB packages
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Arch Linux
```bash
# Using paru (AUR helper)
paru -S mongodb-bin

# Or using yay
yay -S mongodb-bin

# Start and enable MongoDB service
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

## ⚙️ Environment Setup

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd weatherwise-vite
```

### 2. Backend Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/weatherwise

# JWT Secret (generate a strong random string)
JWT_AUTH_SECRET=your_jwt_secret_here_make_it_very_long_and_random

# Express Session Secret
EXPRESS_SESSION_SECRET=your_session_secret_here_also_make_it_random

# Weather API Keys (get from respective providers)
WEATHER_API_KEY=your_weather_api_key
GEMINI_API_KEY=your_gemini_api_key
GEOCODING_API_KEY=your_geocoding_api_key
```

#### How to get API Keys:

1. **Weather API Key**: Sign up at [OpenWeatherMap](https://openweathermap.org/api) or [WeatherAPI](https://www.weatherapi.com/)
2. **Gemini API Key**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
3. **Geocoding API Key**: Get from [Google Cloud Console](https://console.cloud.google.com/) - Enable Geocoding API

#### MongoDB Connection Details:

- **Local MongoDB**: `mongodb://localhost:27017/weatherwise`
- **MongoDB Atlas** (cloud): `mongodb+srv://username:password@cluster.mongodb.net/weatherwise`
- **Custom Host**: `mongodb://your-host:port/weatherwise`

> ⚠️ **Security Note**: Never commit your `.env` file to version control. Add it to `.gitignore`.

## 🚀 Installation & Running

### Backend Setup

1. **Navigate to project root and install dependencies:**
```bash
cd weatherwise-vite
npm install
```

2. **Ensure MongoDB is running:**
```bash
# Check if MongoDB is running
sudo systemctl status mongod  # Linux
# or
brew services list | grep mongodb  # macOS
# or check Windows Services for MongoDB
```

3. **Start the backend server:**
```bash
npm run dev
```

The backend server will start on `http://localhost:3000` (or the port specified in your configuration).

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install frontend dependencies:**
```bash
npm install
```

3. **Start the frontend development server:**
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## 🔧 Development Workflow

1. **Start MongoDB service** (if not already running)
2. **Terminal 1**: Run backend server from project root
   ```bash
   npm run dev
   ```
3. **Terminal 2**: Run frontend server from frontend directory
   ```bash
   cd frontend
   npm run dev
   ```

## 📁 Project Structure

```
weatherwise-vite/
├── backend/
│   ├── index.js              # Express server entry point
│   ├── lib/
│   │   └── constants.js      # Environment variables
│   ├── middleware/
│   │   └── validationMiddleware.js
│   ├── models/
│   │   └── User.js           # MongoDB user schema
│   └── server/
│       ├── auth.js           # Authentication routes
│       └── search.js         # Weather search routes
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── features/         # Feature-based modules
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utility functions
│   │   └── pages/            # Application pages
│   ├── package.json
│   └── vite.config.ts
├── package.json              # Backend dependencies
├── .env                      # Environment variables
└── README.md
```

## 🛡️ Authentication

The application uses JWT (JSON Web Tokens) for authentication:
- Tokens are stored in HTTP-only cookies
- Session management with Passport.js
- bcryptjs for password hashing

## 🌐 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/user` - Get current user

### Weather
- `GET /search/weather` - Get weather data
- `GET /search/suggestions` - Get location suggestions
- `GET /search/current` - Get current conditions

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB service is running
   - Check your `MONGODB_URI` in `.env`
   - Verify database permissions

2. **API Key Errors**
   - Verify all API keys are correctly set in `.env`
   - Check API key quotas and limits

3. **Port Already in Use**
   - Backend default: `http://localhost:3000`
   - Frontend default: `http://localhost:5173`
   - Kill existing processes or change ports

4. **CORS Issues**
   - Frontend and backend must run on different ports
   - CORS is configured in the Express server

### Database Management

```bash
# Connect to MongoDB shell
mongosh

# Use the weatherwise database
use weatherwise

# View collections
show collections

# View users
db.users.find()
```

## 📝 Scripts

### Backend (from root directory)
```bash
npm run dev          # Start development server with nodemon
npm test            # Run tests (not configured yet)
```

### Frontend (from frontend directory)
```bash
npm run dev         # Start Vite development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🔗 Links

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

Built with ❤️ using modern web technologies
