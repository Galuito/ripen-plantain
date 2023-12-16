import Comment, {IComment} from '../models/comment'
import Movie from '../models/movie'
import User from '../models/user'
import {Request, Response} from 'express'
import { extractId } from './user.idExtractor';

export const commentMovie = async (req: Request, res: Response): Promise<Response> =>{
  const authorization: string | undefined = req.headers?.authorization;
  const userId = extractId(authorization);
  if(!req.body.movieId){
    return res.status(400).json({ msg: "Please. Provide with a movie id to comment."})
  }
  if(!req.body.content){
    return res.status(400).json({ msg: "Please. Provide with a content for the comment."})
  }
  const user = await User.findOne({_id:userId})
  if(!user){
    return res.status(400).json({ msg: "Invalid user making the comment (Not found)"})
  }
  const movie = await Movie.findOne({apiId: req.body.movieId});
  if(!movie){
    return res.status(400).json({ msg: "The sent movie id does not exist"})
  }

  const params = {
    content: req.body.content,
    author: userId,
    movie: req.body.movieId
  }

  const newComment = new Comment(params)
  await newComment.save()
  return res.status(201).json( newComment )
}

export const commentComment = async (req: Request, res: Response): Promise<Response> =>{
  const authorization: string | undefined = req.headers?.authorization;
  const userId = extractId(authorization);
  if(!req.body.content){
    return res.status(400).json({ msg: "Please. Provide with a content for the comment."})
  }
  if(!req.body.commentId){
    return res.status(400).json({ msg: "Please. Provide with a commentId."});
  }
  const user = await User.findOne({_id:userId})
  if(!user){
    return res.status(400).json({ msg: "Invalid user making the comment (Not found)"})
  }
  const comment = await Comment.findOne({_id:req.body.commentId})
  if(!comment){
    return res.status(400).json({ msg: "The sent comment id does not exist"})
  }

  if(comment.isReply){
    return res.status(400).json( {msg: "You can't reply to a comment that is already a reply"})
  }

  const params = {
    content: req.body.content,
    author: userId,
    movie: comment.movie,
    isReply: true,
    parentComment: req.body.commentId
  }

  const newComment = new Comment(params)
  await newComment.save()
  return res.status(201).json( newComment )
}

export const getMovieComments = async (req: Request, res: Response): Promise<Response> =>{
  if(!req.body.movieId){
    return res.status(400).json({ msg: "Please. Provide with a movieId"})
  }
  const movie = Movie.findOne({apiId:req.body.movieId});
  if(!movie){
    return res.status(400).json({ msg: "The passed movie Id does not exist"})
  }
  const comments = await Comment.find({movie: req.body.movieId, isReply:false})
  // console.log(comments);
  return res.status(200).json( comments );
}

export const getCommentComments = async (req: Request, res: Response): Promise<Response> =>{
  if(!req.body.commentId){
    return res.status(400).json({ msg: "Please. Provide with a commentId"});
  }
  const comment = await Comment.findOne({_id: req.body.commentId})
  if(!comment){
    return res.status(400).json({ msg: "The passed commentId does not exist"})
  }
  const comments = await Comment.find({parentComment: req.body.commentId})
  return res.status(200).json( comments )
}