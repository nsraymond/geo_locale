import express, { Request, Response } from "express";
import Place, { PlaceDocument } from "../models/region.model";
import NodeCache from 'node-cache';

// Creating cache instance
const cache = new NodeCache();
const defaultTTL = (): number => {
  return 24 * 60 * 60;
};

// get All places
export const getAllPlaces = async (req: Request, res: Response) => {
  try {
    const allPlaces = await Place.find(); 
    if (allPlaces.length === 0) {
      res.status(404).json({ message: "Data not found" });
      return;
    }
    res.json(allPlaces);
  } catch (error) {
    console.error("sorry, an error occurred while fetching data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Search by category/query
export const getByCategories = async (req: Request, res: Response) => {
  try {
    const { category, query } = req.query;
    if (!category || !query) {
      return res
        .status(400)
        .json({ message: "Category and query parameters are required." });
    }
    const adjustedQuery = (query as string).split("").join("\\s*");
    let searchResults: any[] = [];
    if (category === "region") {
      searchResults = await Place.aggregate([
        { $match: { name: { $regex: new RegExp(adjustedQuery, "i") } } },
        { $unwind: "$states" },
        { $group: { _id: "$name", states: { $push: "$states.name" } } },
        { $project: { region: "$_id", states: 1, _id: 0 } },
      ]);
    } else if (category === "state") {
      searchResults = await Place.aggregate([
        { $unwind: "$states" },
        {
          $match: { "states.name": { $regex: new RegExp(adjustedQuery, "i") } },
        },
        {
          $group: {
            _id: "$name",
            states: {
              $push: {
                name: "$states.name",
                lgas: "$states.lgas.name",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            region: "$_id",
            states: 1,
          },
        },
      ]);
    } else if (category === "lga") {
      searchResults = await Place.aggregate([
        { $unwind: "$states" },
        { $unwind: "$states.lgas" },
        {
          $match: {
            "states.lgas.name": { $regex: new RegExp(adjustedQuery, "i") },
          },
        },
        {
          $project: {
            _id: 0,
            state: "$states.name",
            lga: "$states.lgas.name",
            metadata: "$states.lgas.metadata",
          },
        },
      ]);
    } else {
      return res.status(400).json({ message: "Invalid category" });
    }
    if (searchResults.length === 0) {
      return res
        .status(404)
        .json({
          message: `No results found for query '${query}' in the '${category}' category.`,
        });
    }
    res.json(searchResults);
  } catch (error) {
    console.error("Error occurred while search:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// get all regions
export const getRegions = async (req: Request, res: Response) => {
  try {
    if (cache.has("regions")) {
      console.log("Data fetched from cache");
      return res.json(cache.get("regions"));
    }
    const regions = await Place.aggregate([
      { $project: { _id: 0, region: "$name", states: "$states.name" } },
    ]);
    cache.set("regions", regions, defaultTTL());
    res.json(regions);
  } catch (error) {
    console.error("Error fetching regions:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// get all states
export const getStates = async (req: Request, res: Response) => {
  try {
    if (cache.has("states")) {
      console.log("Data fetched from cache");
      return res.json(cache.get("states"));
    }
    const states = await Place.aggregate([
      { $unwind: "$states" },
      {
        $project: {
          _id: 0,
          state: "$states.name",
          region: "$name",
          lgas: "$states.lgas.name",
        },
      },
    ]);
    cache.set("states", states, defaultTTL());
    res.json(states);
  } catch (error) {
    console.error("Error fetching states:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// get all lgas
export const getLgas = async (req: Request, res: Response) => {
  try {
    if (cache.has("lgas")) {
      console.log("Data fetched from cache");
      return res.json(cache.get("lgas"));
    }
    const lgas = await Place.aggregate([
      { $unwind: "$states" },
      { $unwind: "$states.lgas" },
      {
        $project: {
          _id: 0,
          lga: "$states.lgas.name",
          state: "$states.name",
          metadata: "$states.lgas.metadata",
        },
      },
    ]);
    cache.set("lgas", lgas, defaultTTL());
    res.json(lgas);
  } catch (error) {
    console.error("Error fetching lgas:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
