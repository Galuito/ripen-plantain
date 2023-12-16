"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Son las rutas que aparentemente solo los usuarios autenticados van a poder acceder 
const express_1 = require("express");
const router = (0, express_1.Router)();
const user_controller_1 = require("../controllers/user.controller");
const passport_1 = __importDefault(require("passport"));
const movie_controller_1 = require("../controllers/movie.controller");
const comment_controller_1 = require("../controllers/comment.controller");
// Use this to test things sent and received
router.post('/testerroute', passport_1.default.authenticate('jwt', { session: false }), user_controller_1.testerController);
// USER ROUTES
// - DELETE ROUTE
router.delete('/deleteuser', passport_1.default.authenticate('jwt', { session: false }), user_controller_1.deleteUser);
// - MODIFY ROUTES
router.put('/modifyuser', passport_1.default.authenticate('jwt', { session: false }), user_controller_1.modifyUser);
router.put('/modifyuserpassword', passport_1.default.authenticate('jwt', { session: false }), user_controller_1.modifyUserPassword);
router.put('/changeprofilepicture', passport_1.default.authenticate('jwt', { session: false }), user_controller_1.changeProfilePicture);
router.put('/ratemovie', passport_1.default.authenticate('jwt', { session: false }), user_controller_1.rateMovie);
// - GET ROUTES
router.post('/checkusername', passport_1.default.authenticate('jwt', { session: false }), user_controller_1.checkUsername);
router.post('/getuserdata', passport_1.default.authenticate('jwt', { session: false }), user_controller_1.getUserData);
router.post('/getFeed', passport_1.default.authenticate('jwt', { session: false }), movie_controller_1.getFeed);
router.post('/getMovie', passport_1.default.authenticate('jwt', { session: false }), movie_controller_1.getMovie);
router.post('/getMovieComments', passport_1.default.authenticate('jwt', { session: false }), comment_controller_1.getMovieComments);
router.post('/getCommentComments', passport_1.default.authenticate('jwt', { session: false }), comment_controller_1.getCommentComments);
router.post('/fuzzySearchUsers', passport_1.default.authenticate('jwt', { session: false }), user_controller_1.fuzzySearchUsers);
router.post('/fuzzySearchMovies', passport_1.default.authenticate('jwt', { session: false }), movie_controller_1.fuzzySearchMovies);
// - CREATE ROUTES
router.post('/commentMovie', passport_1.default.authenticate('jwt', { session: false }), comment_controller_1.commentMovie);
router.post('/commentComment', passport_1.default.authenticate('jwt', { session: false }), comment_controller_1.commentComment);
exports.default = router;
