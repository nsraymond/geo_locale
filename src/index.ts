import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from "cors";
import { connectingToMongoDB } from './config/db';
import userRouter from './routes/user.route';
import  router from './routes/places.route';
dotenv.config();

const app = express();

const PORT = process.env.PORT;


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
