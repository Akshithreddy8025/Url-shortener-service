const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const connectRedis = require('./config/redis');
const urlRoutes = require('./routes/urlRoutes');
const {
  notFound,
  errorHandler,
} = require('./middleware/errorMiddleware');

connectDB();
connectRedis();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('URL Shortener API Running');
});

app.use('/api/urls', urlRoutes);
app.use('/', urlRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);