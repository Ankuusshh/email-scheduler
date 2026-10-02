# Email Scheduler

A full-stack email scheduling application that allows users to authenticate, compose emails, schedule them for future delivery, and monitor scheduled and sent emails.

The project uses React and Tailwind CSS for the frontend and Node.js, Express, MySQL, Redis, BullMQ, and Nodemailer for the backend.

## 1. Project Overview

The Email Scheduler provides:

* User registration and login
* JWT-based authentication
* Email scheduling
* Background email processing using BullMQ
* Redis-based job queue
* MySQL persistence
* Scheduled email dashboard
* Sent email dashboard
* API rate limiting
* Worker concurrency control
* Ethereal Email for test email delivery
* React + Tailwind CSS frontend


## 2. Technology Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* JavaScript
* Fetch API

### Backend

* Node.js
* Express.js
* JavaScript
* JWT
* bcryptjs
* Nodemailer
* BullMQ
* Redis

### Database

* MySQL

### Development Tools

* Git
* GitHub
* VS Code
* Postman

# 3. Project Structure

email-scheduler/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── redis.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── emailController.js
│   │   │
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   │
│   │   ├── queues/
│   │   │   └── emailQueue.js
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── emailRoutes.js
│   │   │
│   │   ├── services/
│   │   │   └── emailService.js
│   │   │
│   │   ├── workers/
│   │   │   └── emailWorker.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── ComposeEmail.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── tailwind.config.js
│
├── .gitignore
└── README.md

# 4. Prerequisites

Install the following before running the project:

* Node.js
* npm
* MySQL
* Redis
* Git

The project was developed and tested on Windows.

# 5. Database Setup

Start MySQL and create the database:

CREATE DATABASE email_scheduler;

USE email_scheduler;

Create the users table:

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Create the emails table:

CREATE TABLE emails (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    scheduled_at DATETIME NOT NULL,
    status ENUM(
        'scheduled',
        'processing',
        'sent',
        'failed',
        'cancelled'
    ) DEFAULT 'scheduled',
    sent_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
    REFERENCES users(id)
);

# 6. Redis Setup

Redis is used by BullMQ for the email job queue.

Start Redis before running the backend and worker.

Verify Redis:

redis-cli ping

Expected result:

PONG

# 7. Backend Setup

Open a terminal:

cd backend

Install dependencies:

npm install

Create:

backend/.env

using `.env.example` as a template.

Example:

PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=email_scheduler

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=your_jwt_secret

# 8. Ethereal Email Setup

The application uses Ethereal Email for testing email delivery.

No real email account is required.

The backend automatically creates an Ethereal test account using Nodemailer.

The email service creates the SMTP transporter and verifies the SMTP connection before sending an email.

When an email is sent, the backend prints an Ethereal preview URL in the worker terminal.

Example:

Ethereal SMTP connection verified successfully

Email sent: <message-id>

Preview URL: <ethereal-preview-url>

Open the preview URL in a browser to view the test email.

For this development version, Ethereal credentials are generated automatically using Nodemailer's test account functionality.

# 9. Run the Backend

Start the Express API:

cd backend
npm run dev

The API runs on:

http://localhost:5000

Expected output:

MySQL connected successfully
Redis connected successfully
Server running on http://localhost:5000


# 10. Run the BullMQ Worker

Open another terminal:

cd backend
node src/workers/emailWorker.js

Expected output:

Email worker started

The worker processes scheduled email jobs independently from the Express API.

# 11. Run the Frontend

Open another terminal:

cd frontend
npm install
npm run dev

The frontend runs on:

http://localhost:5173

Open this address in a browser.

# 12. Application Flow

The main application flow is:

User
  │
  ▼
React Frontend
  │
  │ REST API
  ▼
Express Backend
  │
  ├──────────────► MySQL
  │
  ▼
BullMQ Queue
  │
  ▼
Redis
  │
  ▼
BullMQ Worker
  │
  ▼
Nodemailer
  │
  ▼
Ethereal Email


# 13. Authentication

Users can register and log in.

During login:

1. The backend verifies the user's email and password.
2. Passwords are stored using bcrypt hashing.
3. The backend generates a JWT token.
4. The frontend stores the token in local storage.
5. Protected email APIs send the token using the Authorization header.

Example:

Authorization: Bearer <token>


# 14. How Email Scheduling Works

When a user schedules an email:

1. The frontend sends the email details to the backend.
2. The backend validates the request.
3. The email is stored in MySQL with status `scheduled`.
4. A delayed BullMQ job is created.
5. Redis stores the BullMQ job.
6. The worker waits until the scheduled time.
7. The worker retrieves the email from MySQL.
8. Nodemailer sends the email through Ethereal.
9. The database status changes from `scheduled` to `processing` and then `sent`.
10. The `sent_at` timestamp is recorded.

The database remains the source of application email records, while Redis/BullMQ manages the background scheduling job.

# 15. Persistence on Restart

Email information is persisted in MySQL rather than only in application memory.

Therefore, restarting the Express API does not remove scheduled email records.

The scheduling jobs are maintained by Redis/BullMQ, which is separate from the Express API process.

After restarting the backend and worker while Redis remains available, the application can continue processing the queued jobs.

MySQL provides persistent storage for:

* Users
* Email recipients
* Subjects
* Message bodies
* Scheduled times
* Email statuses
* Sent timestamps


# 16. Rate Limiting

Express Rate Limit is used to protect the API.

The current configuration allows:


100 requests per minute


for the `/api` routes.

Configuration:

windowMs: 60 * 1000,
max: 100

If the limit is exceeded, the API returns:

{
    "message": "Too many requests. Please try again later."
}


# 17. Worker Concurrency

BullMQ worker concurrency is configured as:

concurrency: 3

This allows up to three email jobs to be processed concurrently by the worker.

The worker also uses a limiter:

limiter: {
    max: 5,
    duration: 1000
}

This helps control the rate at which jobs are processed.


# 18. Frontend Features

### Login

Users can log into their account using email and password.

### Dashboard

The dashboard displays:

* Total emails
* Scheduled emails
* Sent emails

### Compose Email

Users can enter:

* Recipient
* Subject
* Message
* Scheduled date and time

### Scheduled Emails Table

Displays emails waiting to be processed.

### Sent Emails Table

Displays successfully sent emails and their sent timestamps.

### Logout

Users can log out and remove their authentication token from the browser.


# 19. Backend Features

| Feature        | Implementation


| Authentication | JWT + bcrypt          |
| API            | Express.js            |
| Scheduler      | BullMQ delayed jobs   |
| Queue          | Redis + BullMQ        |
| Persistence    | MySQL                 |
| Email Delivery | Nodemailer + Ethereal |
| Rate Limiting  | Express Rate Limit    |
| Concurrency    | BullMQ Worker         |
| API Protection | JWT Middleware        |


# 20. API Endpoints

## Authentication

### Register

POST /api/auth/register


### Login

POST /api/auth/login


## Emails

Authentication is required for the following endpoints.

### Schedule Email

POST /api/emails

### Get All Emails

GET /api/emails

### Get Scheduled Emails

GET /api/emails/scheduled


### Get Sent Emails

GET /api/emails/sent


# 21. Example Schedule Request


{
    "recipient": "test@example.com",
    "subject": "Email Scheduler Test",
    "body": "Testing scheduled email.",
    "scheduledAt": "2026-10-02T20:30:00"
}


The request requires a valid JWT token:

Authorization: Bearer <token>


# 22. Testing

The application can be tested using:

* Browser frontend
* Postman
* MySQL
* Redis CLI
* BullMQ worker logs

A typical test flow is:

Register
   ↓
Login
   ↓
Dashboard
   ↓
Compose Email
   ↓
Schedule Email
   ↓
Scheduled Emails
   ↓
BullMQ Worker
   ↓
Ethereal Email
   ↓
Sent Emails



