# Fake Job Predictor

An intelligent full-stack system designed to detect fraudulent job postings and scams using heuristic rule-based text analysis, risk scoring, and keyword pattern recognition.

---

## 🚀 Features

- **Automated Scam Detection**: Analyzes job posting text for high-risk indicators (e.g., suspicious contact methods, unrealistic compensation, upfront payment/investment requests, suspicious phrasing).
- **Risk Scoring & Heuristics**: Computes an aggregate risk score (0-100) and provides detailed flags and reasons explaining why a job may be illegitimate.
- **User Authentication & Verification**: Secure registration, login, and email verification using OTP (One-Time Password) powered by JWT and Nodemailer.
- **Admin Management**: Dedicated endpoints for administrators to review predictions, monitor system stats, and manage flag rules.
- **API Documentation**: Interactive OpenAPI / Swagger UI docs available at `/api-docs`.
- **Security & Reliability**: Configured with Helmet security headers, rate limiting to prevent brute force attacks, and Winston logging.
- **Automated Testing**: Jest and Supertest test suites for authentication and prediction pipelines.
- **Docker Ready**: Containerized server setup for rapid deployment.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT), bcryptjs
- **Email Service**: Nodemailer
- **Validation**: Joi
- **Documentation**: Swagger UI Express, swagger-jsdoc
- **Testing**: Jest, Supertest
- **Client Services**: Next.js / React TypeScript client services (Axios)
- **DevOps**: Docker

---

## 📁 Project Structure

```text
fake-job-predictor/
├── client/                     # Frontend client
│   ├── public/                 # Static assets & icons
│   └── services/
│       └── api.ts              # Axios HTTP client with auth interceptors
├── server/                     # Backend API server
│   ├── Dockerfile              # Docker container configuration
│   ├── jest.config.js          # Jest test configuration
│   ├── package.json            # Node.js dependencies & scripts
│   ├── .env.example            # Environment variables template
│   ├── src/
│   │   ├── app.js              # Express app setup & middleware
│   │   ├── server.js           # Server entry point
│   │   ├── seed.js             # Database seeder script
│   │   ├── config/
│   │   │   └── db.js           # MongoDB connection handler
│   │   ├── controllers/        # Request controllers (auth, predict, admin)
│   │   ├── middleware/         # Auth verification & error handling
│   │   ├── models/             # Mongoose schemas (User, Prediction)
│   │   ├── routes/             # Express API routes
│   │   ├── services/           # Detection algorithms, email & prediction logic
│   │   └── utils/
│   │       └── logger.js       # Winston logger setup
│   └── tests/                  # Integration & unit test suites
└── README.md
```

---

## 🚦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (local instance or MongoDB Atlas URI)

### Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sadhana1426/Fake-job-predictor.git
   cd Fake-job-predictor
   ```

2. **Configure Environment Variables:**
   Navigate to the `server/` directory and create a `.env` file based on `.env.example`:
   ```bash
   cd server
   cp .env.example .env
   ```
   Fill in your configuration values (MongoDB URI, JWT Secret, Email credentials).

3. **Install Dependencies:**
   ```bash
   # Install server dependencies
   npm install
   ```

4. **Seed Database (Optional):**
   ```bash
   npm run seed
   ```

5. **Run the Server:**
   ```bash
   # Development mode with nodemon
   npm run dev

   # Production mode
   npm start
   ```

   The server will start on `http://localhost:5000`.

6. **Interactive API Documentation:**
   Open `http://localhost:5000/api-docs` in your browser to explore and test the endpoints via Swagger UI.

---

## 🧪 Running Tests

To run the automated test suite:

```bash
cd server
npm test
```

---

## 🐳 Running with Docker

You can build and run the server using Docker:

```bash
cd server
docker build -t fake-job-predictor-server .
docker run -p 5000:5000 --env-file .env fake-job-predictor-server
```

---

## 📄 License

This project is open-source and available under the [ISC License](LICENSE).
