"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = require("express-rate-limit");
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./config/db");
const user_route_1 = __importDefault(require("./routes/user.route"));
const places_route_1 = __importDefault(require("./routes/places.route"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const corsOptions = {
    origin: 'https://geo-naija-locale.netlify.app/'
};
app.use((0, cors_1.default)(corsOptions));
app.set('trust proxy', true);
const PORT = process.env.PORT;
// middlewares
app.use(body_parser_1.default.json());
//connect db
(0, db_1.connectingToMongoDB)();
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
});
// Apply the rate limiting middleware to all requests.
app.use(limiter);
// routes
app.use('/api', user_route_1.default);
app.use('/api/', places_route_1.default);
// home route
app.get('/', (req, res) => {
    res.send('Welcome to to Geo-Naija Locale Api app. Checkout the views link for UI');
});
// Handling errors
app.use((req, res, next) => {
    res.status(404).send('404 - Page Not Found');
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('500 - Internal Server Error');
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
