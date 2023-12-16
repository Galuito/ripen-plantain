// Son las rutas que aparentemente solo los usuarios autenticados van a poder acceder 
import {Router} from 'express';
const router = Router();

import { changeProfilePicture, checkUsername, deleteUser, fuzzySearchUsers, getUserData, modifyUser, modifyUserPassword, rateMovie, testerController } from '../controllers/user.controller';
import passport from 'passport';
import { fuzzySearchMovies, getFeed, getMovie } from '../controllers/movie.controller';
import { commentComment, commentMovie, getCommentComments, getMovieComments } from '../controllers/comment.controller';

// Use this to test things sent and received
router.post('/testerroute', passport.authenticate('jwt', {session: false}), testerController);

// USER ROUTES
// - DELETE ROUTE
router.delete('/deleteuser', passport.authenticate('jwt', {session: false}), deleteUser);

// - MODIFY ROUTES
router.put('/modifyuser', passport.authenticate('jwt', {session: false}), modifyUser);
router.put('/modifyuserpassword', passport.authenticate('jwt', {session: false}), modifyUserPassword);
router.put('/changeprofilepicture', passport.authenticate('jwt', {session: false}), changeProfilePicture);
router.put('/ratemovie', passport.authenticate('jwt', {session: false}), rateMovie);

// - GET ROUTES
router.post('/checkusername', passport.authenticate('jwt', {session: false}), checkUsername);
router.post('/getuserdata', passport.authenticate('jwt', {session: false}), getUserData);
router.post('/getFeed', passport.authenticate('jwt', {session: false}), getFeed);
router.post('/getMovie', passport.authenticate('jwt', {session: false}), getMovie);
router.post('/getMovieComments', passport.authenticate('jwt', {session: false}), getMovieComments);
router.post('/getCommentComments', passport.authenticate('jwt', {session: false}), getCommentComments);
router.post('/fuzzySearchUsers', passport.authenticate('jwt', {session: false}), fuzzySearchUsers);
router.post('/fuzzySearchMovies', passport.authenticate('jwt', {session: false}), fuzzySearchMovies);

// - CREATE ROUTES
router.post('/commentMovie', passport.authenticate('jwt', {session: false}), commentMovie);
router.post('/commentComment', passport.authenticate('jwt', {session: false}), commentComment);



export default router;