import express, { Request, Response, NextFunction } from 'express';
import { rateLimit } from 'express-rate-limit'
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { connectingToMongoDB } from './config/db';
import userRouter from './routes/user.route';
import  router from './routes/places.route';
dotenv.config();

const app = express();
app.set('trust proxy', true);
const PORT = process.env.PORT;

// middlewares
app.use(bodyParser.json());

//connect db
connectingToMongoDB();

// implementing ratelimiter
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
})

// Applying limiter to all requests
app.use(limiter);


// routes
app.use('/api', userRouter);
app.use('/api/', router);


// home route
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to to Geo-Naija Locale Api app. Please test with Postman. This App has no views yet');
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
