"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const movieAPI_controller_1 = require("../controllers/movieAPI.controller");
const user_controller_1 = require("../controllers/user.controller");
const movie_controller_1 = require("../controllers/movie.controller");
// MOVIE ROUTES
// - TEST ROUTES
router.get('/apiTester', movieAPI_controller_1.apiTester);
// - CREATE ROUTES
router.post('/createCritic', user_controller_1.createCritic);
router.post('/addMovieById', movieAPI_controller_1.addMovieById);
router.post('/addSeriesById', movieAPI_controller_1.addSeriesById);
// - MODIFY ROUTES
router.put('/addTrailer', movie_controller_1.addTrailer);
// - DELETE ROUTES
// - GET ROUTES
router.post('/getMoviesFromApi', movieAPI_controller_1.getMovieListFromAPI);
exports.default = router;
