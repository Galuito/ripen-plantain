"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.fuzzySearchMovies = exports.getMovie = exports.getFeed = exports.addTrailer = void 0;
const movie_1 = __importDefault(require("../models/movie"));
const fuzzy = __importStar(require("fuzzy"));
// ADD TRAILER TO A MOVIE BY ITS apiId
// This route is for the backend only
const addTrailer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.movieId) {
        return res.status(400).json({ msg: "Please. Provide with the movieId" });
    }
    if (!req.body.trailerUrl) {
        return res.status(400).json({ msg: "Please. Provide with a trailer URL (Youtube)" });
    }
    const movie = yield movie_1.default.findOne({ apiId: req.body.movieId });
    if (!movie) {
        return res.status(400).json({ msg: "The passed movieId does not exist" });
    }
    try {
        movie.addTrailer(req.body.trailerUrl);
        return res.status(201).json({ msg: "Trailer Added Successfully" });
    }
    catch (error) {
        console.error("Some error occured adding the trailer", error);
        return res.status(400).json({ msg: "Some error occured adding the trailer", error: error });
    }
});
exports.addTrailer = addTrailer;
const getFeed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield movie_1.default.find({}, { title: 1, apiId: 1, posterImage: 1, userMean: 1, criticMean: 1 });
        // console.log(result);
        return res.status(200).json(result);
    }
    catch (error) {
        console.error("Error retrieving the movies", error);
        return res.status(400).json({ msg: "There was an error retrieving the movies" });
    }
});
exports.getFeed = getFeed;
const getMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.movieId) {
        return res.status(400).json({ msg: "Please. Provide with a movieId" });
    }
    try {
        const movie = yield movie_1.default.findOne({ apiId: req.body.movieId }, { userRatings: 0, criticRatings: 0 });
        if (!movie) {
            return res.status(400).json({ msg: "The sent id does not belong to any movie in the database" });
        }
        return res.status(200).json(movie);
    }
    catch (error) {
        console.error("Error retrieving the movie", error);
        return res.status(400).json({ msg: "There was an error retrieving the movie" });
    }
});
exports.getMovie = getMovie;
const fuzzySearchMovies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.title) {
        return res.status(400).json({ msg: "Please. Provide with the title to search" });
    }
    const allMovies = yield movie_1.default.find({}, 'title posterImage userMean criticMean rating originalLanguage');
    const results = fuzzy.filter(req.body.title, allMovies, { extract: movie => movie.title });
    // Extract matched users from the fuzzy matching results
    const matchedMovies = results.map(result => result.original);
    return res.status(200).json(matchedMovies);
});
exports.fuzzySearchMovies = fuzzySearchMovies;
