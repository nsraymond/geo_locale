import express, { Request, Response, NextFunction } from 'express';
import { rateLimit } from 'express-rate-limit'
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from "cors";
import { connectingToMongoDB } from './config/db';
import userRouter from './routes/user.route';
import  router from './routes/places.route';
dotenv.config();

const app = express();

const PORT = process.env.PORT;

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
})

// Apply the rate limiting middleware to all requests.
app.use(limiter)

// middlewares
app.use(bodyParser.json());
app.use(
    cors({
      origin: "https://client-locale-app.onrender.com/",
      credentials: true,
    })
  );

//connect db
connectingToMongoDB();


// routes
app.use('/api', userRouter);
app.use('/api/', router);


// home route
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to to Geo-Naija Locale Api app. Checkout the views link for UI');
});

// Handling errors
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).send('404 - Page Not Found');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('500 - Internal Server Error');
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
