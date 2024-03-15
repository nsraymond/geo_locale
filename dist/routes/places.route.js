"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const places_controller_1 = require("../controllers/places.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// getAll regions,states,andLGAs
router.get("/places", auth_middleware_1.authenticate, places_controller_1.getAllPlaces);
// Search by category/query
router.get("/search", auth_middleware_1.authenticate, places_controller_1.getByCategories);
// get all regions
router.get("/regions", auth_middleware_1.authenticate, places_controller_1.getRegions);
// get all states
router.get("/states", auth_middleware_1.authenticate, places_controller_1.getStates);
// get all lgas
router.get("/lgas", auth_middleware_1.authenticate, places_controller_1.getLgas);
exports.default = router;
