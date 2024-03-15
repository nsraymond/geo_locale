"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheMiddleware = void 0;
const node_cache_1 = __importDefault(require("node-cache"));
const cache = new node_cache_1.default();
const cacheMiddleware = (req, res, next) => {
    const key = req.originalUrl || req.url;
    const cachedData = cache.get(key);
    if (cachedData) {
        return res.json({ source: 'cache', data: cachedData });
    }
    else {
        next();
    }
};
exports.cacheMiddleware = cacheMiddleware;
