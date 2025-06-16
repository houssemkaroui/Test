const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100 
});

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200,
  credentials: true
};

module.exports = (app) => {
  app.use(helmet());
  app.use(limiter);
  app.use(cors(corsOptions));
};