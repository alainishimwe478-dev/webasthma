# WebAsthma Backend

A comprehensive backend API for the WebAsthma asthma management application.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access (patient, doctor, admin)
- **Real-time Chat**: Socket.io integration for messaging between patients and doctors
- **Consultation Management**: Schedule and manage video consultations
- **Environment Monitoring**: Real-time weather and air quality data for asthma triggers
- **Pharmacy Locator**: Find nearby pharmacies and medication prices
- **AI Assistant**: Chatbot for asthma-related queries and health tips
- **Notifications**: Push notifications for alerts and reminders
- **Dashboard**: Personalized health dashboard with risk assessment

## Tech Stack

- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **Socket.io** for real-time features
- **JWT** for authentication
- **OpenWeather API** for environmental data

## Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
5. Update `.env` with your configuration
6. Start MongoDB (if running locally)
7. Start the server:
   ```bash
   npm start
   ```
   Or for development:
   ```bash
   npm run dev
   ```

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `OPENWEATHER_KEY`: API key for OpenWeather
- `FRONTEND_URL`: Frontend application URL
- `PORT`: Server port (default: 5000)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Dashboard
- `GET /api/dashboard/:userId` - Get personalized dashboard data

### Messages
- `GET /api/messages/:otherUserId` - Get messages between users
- `POST /api/messages` - Send message
- `PUT /api/messages/read/:otherUserId` - Mark messages as read

### Consultations
- `GET /api/consultations` - Get user's consultations
- `POST /api/consultations` - Create consultation
- `PUT /api/consultations/:id` - Update consultation

### Environment
- `GET /api/environment/readings` - Get latest environmental readings
- `GET /api/environment/alerts` - Get district alerts

### Pharmacy
- `GET /api/pharmacy` - Search pharmacies
- `GET /api/pharmacy/medications/search` - Search medications

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read

### AI Assistant
- `POST /api/ai/chat` - Chat with AI assistant
- `GET /api/ai/tips` - Get health tips

## Database Models

- **User**: Authentication and basic user info
- **Patient**: Patient-specific medical data
- **Doctor**: Doctor profiles and availability
- **Message**: Chat messages
- **Consultation**: Medical consultations
- **EnvironmentReading**: Environmental data
- **Notification**: User notifications
- **Pharmacy**: Pharmacy locations
- **Medication**: Medication information

## Real-time Features

The backend includes Socket.io for real-time communication:

- Private messaging between users
- Typing indicators
- Live notifications

## Development

- Use `npm run dev` for development with auto-restart
- API documentation available at `/api/health` for health checks
- Environment data is fetched from OpenWeather API
- Risk assessment uses environmental factors and patient history

## Deployment

1. Set up MongoDB database
2. Configure environment variables
3. Build and deploy the application
4. Set up cron jobs for regular environment data fetching

## License

This project is licensed under the MIT License.