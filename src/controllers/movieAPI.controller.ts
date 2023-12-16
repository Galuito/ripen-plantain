import axios from 'axios';
import Movie, {IMovie} from '../models/movie';
import {Request, Response} from 'express'

const apiKey = '154759848d8b210d57070cde168eeef5';
const baseURL = 'https://api.themoviedb.org/3'

const searchMovies = '/search/movie'
const getMovieById = '/movie/'

// Get Movies from the API
async function fetchMovies(movieName: String) {

  const params = {
    api_key: apiKey,
    query: movieName
  }

  try{
    const response = await axios.get(baseURL + searchMovies, { params })
    return response.data['results'];
  }catch(error){
    console.error('Error making TMDb API Request: ', error)
  }
}

// Get a Movie from the API by its API Id
async function fetchMovieById(movieId: Number) {
  const params = {
    api_key: apiKey
  }

  try{
    const response = await axios.get(baseURL + getMovieById + movieId, { params })
    console.log(response.data);
    return response.data;
  }catch(error){
    console.error('Error making TMDb API Request: ', error)
  }
}

// Get Movies function for the routes
export const getMovieListFromAPI = async (req: Request, res: Response): Promise<Response> =>{
  if(!req.body.movieName){
    return res.status(400).json({msg:"Please. Provide with a movie name"})
  }
  const result = await fetchMovies(req.body.movieName)
  return res.status(200).json( result );
}

// API Tester for development use
export const apiTester = async (req: Request, res: Response): Promise<Response> =>{
  const movieName = "Bohemian Rhapsody";
  const movieId = 24428;
  // const result = await fetchMovies(movieName);
  const result =  await fetchMovieById(movieId);
  return res.status(200).json( result );
}

// ADD MOVIE BY ID
export const addMovieById = async (req: Request, res: Response): Promise<Response> =>{
  if(!req.body.movieId){
    return res.status(400).json({msg: 'Please. Provide with a movie Id (movieId)'});
  }

  // CHECK HERE IF THE MOVIE WAS ALREADY ADDED BY ID
  const existingMovie = await Movie.findOne({apiId:req.body.movieId})
  if(existingMovie){
    return res.status(400).json({msg: "The movie is already in the database"});
  }

  const result = await fetchMovieById(req.body.movieId);

  // The API does not provide with a trailer, therefore it has to be added in a later step, not in creation
  // I'd rather do it not in creation because then the creation would messier than it is already

  var rating = "PG";

  if (result["adult"]){
    rating = "R"
  }

  var durationInt = result["runtime"];
  const durationHours = Math.floor(durationInt / 60)
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
  }

  const newMovie = new Movie(params);
  await newMovie.save();

  return res.status(201).json(newMovie);
}

// ADD TRAILER TO A MOVIE BY ITS apiId or MongoDBId