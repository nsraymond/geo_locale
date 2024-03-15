"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLgas = exports.getStates = exports.getRegions = exports.getByCategories = exports.getAllPlaces = void 0;
const region_model_1 = __importDefault(require("../models/region.model"));
const node_cache_1 = __importDefault(require("node-cache"));
// Creating cache instance
const cache = new node_cache_1.default();
const defaultTTL = () => {
    return 24 * 60 * 60;
};
// get All places
const getAllPlaces = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allPlaces = yield region_model_1.default.find();
        if (allPlaces.length === 0) {
            res.status(404).json({ message: "Data not found" });
            return;
        }
        res.json(allPlaces);
    }
    catch (error) {
        console.error("sorry, an error occurred while fetching data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getAllPlaces = getAllPlaces;
// Search by category/query
const getByCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category, query } = req.query;
        if (!category || !query) {
            return res
                .status(400)
                .json({ message: "Category and query parameters are required." });
        }
        const adjustedQuery = query.split("").join("\\s*");
        let searchResults = [];
        if (category === "region") {
            searchResults = yield region_model_1.default.aggregate([
                { $match: { name: { $regex: new RegExp(adjustedQuery, "i") } } },
                { $unwind: "$states" },
                { $group: { _id: "$name", states: { $push: "$states.name" } } },
                { $project: { region: "$_id", states: 1, _id: 0 } },
            ]);
        }
        else if (category === "state") {
            searchResults = yield region_model_1.default.aggregate([
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
        }
        else if (category === "lga") {
            searchResults = yield region_model_1.default.aggregate([
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
        }
        else {
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
    }
    catch (error) {
        console.error("Error occurred while search:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});
exports.getByCategories = getByCategories;
// get all regions
const getRegions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (cache.has("regions")) {
            console.log("Data fetched from cache");
            return res.json(cache.get("regions"));
        }
        const regions = yield region_model_1.default.aggregate([
            { $project: { _id: 0, region: "$name", states: "$states.name" } },
        ]);
        cache.set("regions", regions, defaultTTL());
        res.json(regions);
    }
    catch (error) {
        console.error("Error fetching regions:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});
exports.getRegions = getRegions;
// get all states
const getStates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (cache.has("states")) {
            console.log("Data fetched from cache");
            return res.json(cache.get("states"));
        }
        const states = yield region_model_1.default.aggregate([
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
    }
    catch (error) {
        console.error("Error fetching states:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});
exports.getStates = getStates;
// get all lgas
const getLgas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (cache.has("lgas")) {
            console.log("Data fetched from cache");
            return res.json(cache.get("lgas"));
        }
        const lgas = yield region_model_1.default.aggregate([
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
    }
    catch (error) {
        console.error("Error fetching lgas:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});
exports.getLgas = getLgas;
