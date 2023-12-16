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
exports.addSeriesById = exports.addMovieById = exports.apiTester = exports.getMovieListFromAPI = void 0;
const axios_1 = __importDefault(require("axios"));
const movie_1 = __importDefault(require("../models/movie"));
const apiKey = '154759848d8b210d57070cde168eeef5';
const baseURL = 'https://api.themoviedb.org/3';
const searchMovies = '/search/movie';
const getMovieById = '/movie/';
const getSeriesById = '/tv/';
// Get Movies from the API
function fetchMovies(movieName) {
    return __awaiter(this, void 0, void 0, function* () {
        const params = {
            api_key: apiKey,
            query: movieName
        };
        try {
            const response = yield axios_1.default.get(baseURL + searchMovies, { params });
            return response.data['results'];
        }
        catch (error) {
            console.error('Error making TMDb API Request: ', error);
        }
    });
}
// Get a Movie from the API by its API Id
function fetchMovieById(movieId) {
    return __awaiter(this, void 0, void 0, function* () {
        const params = {
            api_key: apiKey
        };
        try {
            const response = yield axios_1.default.get(baseURL + getMovieById + movieId, { params });
            console.log(response.data);
            return response.data;
        }
        catch (error) {
            console.error('Error making TMDb API Request: ', error);
        }
    });
}
function fetchSeriesById(seriesId) {
    return __awaiter(this, void 0, void 0, function* () {
        const params = {
            api_key: apiKey
        };
        try {
            const response = yield axios_1.default.get(baseURL + getSeriesById + seriesId, { params });
            return response.data;
        }
        catch (error) {
            console.error('Error making TMDb API Request: ', error);
        }
    });
}
// Get Movies function for the routes
const getMovieListFromAPI = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.movieName) {
        return res.status(400).json({ msg: "Please. Provide with a movie name" });
    }
    const result = yield fetchMovies(req.body.movieName);
    return res.status(200).json(result);
});
exports.getMovieListFromAPI = getMovieListFromAPI;
// API Tester for development use
const apiTester = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const movieId = 24428;
    const seriesId = 40075;
    // const result = await fetchMovies(movieName);
    // const result =  await fetchMovieById(movieId);
    const result = yield fetchSeriesById(seriesId);
    return res.status(200).json(result);
});
exports.apiTester = apiTester;
// ADD MOVIE BY ID
const addMovieById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.movieId) {
        return res.status(400).json({ msg: 'Please. Provide with a movie Id (movieId)' });
    }
    // CHECK HERE IF THE MOVIE WAS ALREADY ADDED BY ID
    const existingMovie = yield movie_1.default.findOne({ apiId: req.body.movieId });
    if (existingMovie) {
        return res.status(400).json({ msg: "The movie is already in the database" });
    }
    const result = yield fetchMovieById(req.body.movieId);
    // The API does not provide with a trailer, therefore it has to be added in a later step, not in creation
    // I'd rather do it not in creation because then the creation would messier than it is already
    var rating = "PG";
    if (result["adult"]) {
        rating = "R";
    }
    var durationInt = result["runtime"];
    const durationHours = Math.floor(durationInt / 60);
    const durationMinutes = durationInt - durationHours * 60;
    // Me estaba estresando tratando de sacar el duration seconds cuando el problema es que el formato en el que
    // el API entrega la duracion es en minutos, se pueden sacar las horas de los minutos, pero no los segundos
    // por lo tanto los segundos son 00
    const durationString = `${durationHours}:${durationMinutes}:00`;
    const params = {
        title: result["original_title"],
        genre: result["genres"][0]["name"],
        posterImage: result["poster_path"],
        description: result["overview"],
        rating: rating,
        originalLanguage: result["original_language"],
        releaseDate: result["release_date"],
        duration: durationString,
        apiId: result["id"]
    };
    const newMovie = new movie_1.default(params);
    yield newMovie.save();
    return res.status(201).json(newMovie);
});
exports.addMovieById = addMovieById;
// ADD SERIES BY ID
const addSeriesById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.seriesId) {
        return res.status(400).json({ msg: 'Please. Provide with a series Id (seriesId)' });
    }
    // CHECK HERE IF THE SERIES WAS ALREADY ADDED BY ID
    const existingSeries = yield movie_1.default.findOne({ apiId: req.body.seriesId });
    if (existingSeries) {
        return res.status(400).json({ msg: "The series is already in the database" });
    }
    const result = yield fetchSeriesById(req.body.seriesId);
    console.log(result);
    var rating = "PG";
    if (result["adult"]) {
        rating = "R";
    }
    const params = {
        title: result["original_name"],
        genre: result["genres"][0]["name"],
        posterImage: result["poster_path"],
        description: result["overview"],
        rating: rating,
        originalLanguage: result["original_language"],
        releaseDate: result["first_air_date"],
        duration: result["episode_run_time"][0],
        isMovie: false,
        apiId: result["id"]
    };
    const newMovie = new movie_1.default(params);
    yield newMovie.save();
    return res.status(201).json(newMovie);
});
exports.addSeriesById = addSeriesById;
