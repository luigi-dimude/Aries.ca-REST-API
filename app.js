// Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env
require('dotenv').config();
// Package that will allow us to avoid wrapping functions in try-catch block
require('express-async-errors');

// const Address = require('./models/Address')
// const populate = require('./pop.json')

// -----------------------------------------------

// extra security packages 
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')


// -----------------------------------------------

// SwaggerUI for generating API documentation
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')

// -----------------------------------------------

const express = require('express')
const app = express();

const authenticateUser = require('./middleware/authentication')

// Router
const jobsRouter = require('./routes/jobs');
const authRouter = require('./routes/auth');
const userJobsRouter = require('./routes/userJobs');
const addressRouter = require('./routes/addresses');

// Connect DB
const connectDB = require('./db/connect')

// -----------------------------------------------

// Not found request
const notFoundMiddleware = require('./middleware/not-found');
// Custom error handler
const errorHandlerMiddleware = require('./middleware/error-handler');

// Use the app.set, if your behind a reverse proxy (like Heroku, Nginx etc)
app.set('trust proxy', 1);

// Limits the number of request from a user
app.use(rateLimiter(
  {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // Limit each IP to 100 request per windowMS
  }
))

// Recognize the incoming Request Object as a JSON Object
app.use(express.json());

app.use(helmet())
app.use(cors())
app.use(xss())

// Home Route
app.get('/', (req, res) => {
  res.send('<h1>Aries API</h1><a href="/api-docs">Documentation</a>')
})

// ROUTES
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
app.use('/api/v1/jobs', jobsRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user-jobs', authenticateUser, userJobsRouter)
app.use('/api/v1/addresses', addressRouter)

// Error Handler & No matching routes
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// uses server's port or port 3000 in dev environment
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    // await Address.create(populate)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();