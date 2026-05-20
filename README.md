# URL Shortener Service

A high-performance backend URL shortener service built using Node.js, Express.js, MongoDB, and Redis.

## Features

- Create short URLs
- Custom short codes
- Redirect short URLs to original URLs
- Track click count
- Redis caching for faster redirects
- MongoDB for persistent storage
- Expiry support for URLs
- Error handling middleware

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Redis / Upstash Redis
- dotenv
- CORS

## Folder Structure

```txt
url-shortener-service/
├── config/
│   ├── db.js
│   └── redis.js
├── controllers/
│   └── urlController.js
├── middleware/
│   └── errorMiddleware.js
├── models/
│   └── Url.js
├── routes/
│   └── urlRoutes.js
├── utils/
│   └── generateShortCode.js
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md