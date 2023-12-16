import Movie from '../models/movie';
import {Request, Response} from 'express'
import * as fuzzy from 'fuzzy';

// ADD TRAILER TO A MOVIE BY ITS apiId
// This route is for the backend only
export const addTrailer = async(req: Request, res: Response):Promise<Response> =>{
  if(!req.body.movieId){
    return res.status(400).json({ msg: "Please. Provide with the movieId"});
  }
  if(!req.body.trailerUrl){
    return res.status(400).json({ msg: "Please. Provide with a trailer URL (Youtube)"})
  }
  const movie = await Movie.findOne({apiId: req.body.movieId})
  if(!movie){
    return res.status(400).json({ msg: "The passed movieId does not exist"})
  }
  try{
    movie.addTrailer(req.body.trailerUrl);
    return res.status(201).json( { msg: "Trailer Added Successfully"});
  }catch(error){
    console.error("Some error occured adding the trailer", error);
    return res.status(400).json({ msg: "Some error occured adding the trailer", error: error})
  }

}

export const getFeed = async (req: Request, res: Response): Promise<Response> =>{
  try{
    const result = await Movie.find({}, {title: 1, apiId: 1, posterImage: 1, userMean: 1, criticMean: 1});
    // console.log(result);
    return res.status(200).json(result);
  }catch(error){
    console.error("Error retrieving the movies", error);
    return res.status(400).json({msg: "There was an error retrieving the movies"})
  }
}

export const getMovie = async (req: Request, res: Response): Promise<Response> =>{
  if(!req.body.movieId){
    return res.status(400).json({msg:"Please. Provide with a movieId"})
  }
  try{
    const movie = await Movie.findOne({apiId:req.body.movieId}, {userRatings:0, criticRatings:0})
    if(!movie){
      return res.status(400).json({msg: "The sent id does not belong to any movie in the database"})
    }

    return res.status(200).json( movie );
  }catch(error){
    console.error("Error retrieving the movie", error);
    return res.status(400).json({msg: "There was an error retrieving the movie"})
  }
}

export const fuzzySearchMovies = async (req: Request, res: Response): Promise<Response> =>{
  if(!req.body.title){
    return res.status(400).json({msg: "Please. Provide with the title to search"})
  }

  const allMovies = await Movie.find({}, 'title posterImage userMean criticMean rating originalLanguage');
  const results = fuzzy.filter(req.body.title, allMovies, { extract: movie => movie.title });

    // Extract matched users from the fuzzy matching results
  const matchedMovies = results.map(result => result.original);

  return res.status(200).json(matchedMovies);
}