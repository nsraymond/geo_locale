import express, { Request, Response, NextFunction } from "express";
import { getAllPlaces, getByCategories, getLgas, getRegions, getStates } from "../controllers/places.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

// getAll regions,states,andLGAs
router.get("/places", authenticate, getAllPlaces);

// Search by category/query
router.get("/search", authenticate, getByCategories);

// get all regions
router.get("/regions", authenticate, getRegions);

// get all states
router.get("/states", authenticate, getStates);

// get all lgas
router.get("/lgas", authenticate, getLgas);
  

export default router;
