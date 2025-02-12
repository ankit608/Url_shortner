# Custom URL Shortener API

## 📌 Overview
This is a scalable **Custom URL Shortener API** built with **Node.js, Express, Sequelize, and PostgreSQL**. It allows users to shorten URLs, track analytics, and manage their shortened links efficiently. The system also features **Google OAuth authentication, rate limiting, Redis caching**, and is **Dockerized for cloud deployment**.

## 🚀 Features
- **URL Shortening**: Generate short URLs for any long URL.
- **Google OAuth Authentication**: Secure user login using Google.
- **Analytics Tracking**: Get total clicks, unique users, OS/device stats, and click trends over time.
- **Rate Limiting**: Prevent abuse by limiting API requests per user.
- **Redis Caching**: Improve performance by caching URL lookups.
- **Group URLs into Topics**: Organize shortened links.
- **Dockerized Deployment**: Easily deploy on cloud platforms like Railway, Vercel, and Netlify.

## 🛠️ Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (via Sequelize ORM)
- **Caching**: Redis
- **Authentication**: Google OAuth
- **Deployment**: Railway, Vercel, Netlify
- **Frontend**: [Live Frontend URL](https://url-shortner-rho-three.vercel.app)
- **Backend**: [Live Backend URL](https://urlshortner-production-a2c0.up.railway.app)
- **Api-Documentation**:https://urlshortner-production-a2c0.up.railway.app/api-docs/

## 📂 Project Structure
```
📦 url-shortener-api
├── 📁 src
│   ├── 📁 controllers   # API logic
│   ├── 📁 models        # Sequelize models
│   ├── 📁 routes        # API endpoints
│   ├── 📁 middleware    # Auth, rate limiting, error handling
│   ├── 📁 config        # Database and Redis config
│   ├── server.js       # Express app setup
├── 📄 .env             # Environment variables
├── 📄 docker-compose.yml # Docker setup
├── 📄 README.md        # Documentation
└── 📄 package.json     # Dependencies
```

## 🔧 Installation
### 1️⃣ Clone the Repository
```bash
git clone https://github.com:ankit608/Url_shortner.git
cd backend
```
### 2️⃣ Install Dependencies
```bash
npm install
```
### 3️⃣ Configure Environment Variables
Create a `.env` file and set the required values:
```env
PORT=5000
DATABASE_URL=postgres://youruser:yourpassword@localhost:5432/yourdatabase
REDIS_URL=redis://localhost:6379
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret
```
### 4️⃣ Run the Server
```bash
npm start
```

## 🔗 API Endpoints
### 🔹 Shorten a URL
```http
POST /api/shorten
```
**Request Body:**
```json
{
  "longUrl": "https://www.example.com"
}
```
**Response:**
```json
{
  "shortUrl": "https://yourdomain.com/abcd123"
}
```

### 🔹 Redirect to Original URL
```http
GET /:alias
```

### 🔹 Get URL Analytics
```http
GET /api/analytics/:alias
```
**Response:**
```json
{
  "totalClicks": 50,
  "unique_user": 30,
  "clicksByDate": { "2025-02-10": 10, "2025-02-11": 20 },
  "uniqueOsCounts": [{ "osType": "Windows", "unique_count": 15 }],
  "uniqueDeviceCounts": [{ "deviceType": "Mobile", "unique_count": 20 }]
}
```

## 🚀 Deployment
### 🐳 Deploy with Docker
```bash
docker-compose up --build -d
```

### ☁️ Deploy on Railway
1. Connect your repository to Railway.
2. Add environment variables.
3. Deploy 🚀

## 📜 License
This project is licensed under the MIT License.

---
Made with ❤️ by [Ankit Sahu](https://github.com/ankitsahu-ai)

