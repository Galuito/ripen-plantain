import {Router} from 'express';
const router = Router();
import { addMovieById, apiTester, getMovieListFromAPI } from '../controllers/movieAPI.controller';
import { createCritic } from '../controllers/user.controller';
import { addTrailer } from '../controllers/movie.controller';

// MOVIE ROUTES
// - TEST ROUTES
router.get('/apiTester', apiTester);

// - CREATE ROUTES
router.post('/createCritic', createCritic);
router.post('/addMovieById', addMovieById);

// - MODIFY ROUTES
router.put('/addTrailer',  addTrailer);

// - DELETE ROUTES

// - GET ROUTES
router.post('/getMoviesFromApi', getMovieListFromAPI);

export default router