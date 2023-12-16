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
exports.getCommentComments = exports.getMovieComments = exports.commentComment = exports.commentMovie = void 0;
const comment_1 = __importDefault(require("../models/comment"));
const movie_1 = __importDefault(require("../models/movie"));
const user_1 = __importDefault(require("../models/user"));
const user_idExtractor_1 = require("./user.idExtractor");
const commentMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const authorization = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
    const userId = (0, user_idExtractor_1.extractId)(authorization);
    if (!req.body.movieId) {
        return res.status(400).json({ msg: "Please. Provide with a movie id to comment." });
    }
    if (!req.body.content) {
        return res.status(400).json({ msg: "Please. Provide with a content for the comment." });
    }
    const user = yield user_1.default.findOne({ _id: userId });
    if (!user) {
        return res.status(400).json({ msg: "Invalid user making the comment (Not found)" });
    }
    const movie = yield movie_1.default.findOne({ apiId: req.body.movieId });
    if (!movie) {
        return res.status(400).json({ msg: "The sent movie id does not exist" });
    }
    const params = {
        content: req.body.content,
        author: userId,
        movie: req.body.movieId
    };
    const newComment = new comment_1.default(params);
    yield newComment.save();
    return res.status(201).json(newComment);
});
exports.commentMovie = commentMovie;
const commentComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const authorization = (_b = req.headers) === null || _b === void 0 ? void 0 : _b.authorization;
    const userId = (0, user_idExtractor_1.extractId)(authorization);
    if (!req.body.content) {
        return res.status(400).json({ msg: "Please. Provide with a content for the comment." });
    }
    if (!req.body.commentId) {
        return res.status(400).json({ msg: "Please. Provide with a commentId." });
    }
    const user = yield user_1.default.findOne({ _id: userId });
    if (!user) {
        return res.status(400).json({ msg: "Invalid user making the comment (Not found)" });
    }
    const comment = yield comment_1.default.findOne({ _id: req.body.commentId });
    if (!comment) {
        return res.status(400).json({ msg: "The sent comment id does not exist" });
    }
    if (comment.isReply) {
        return res.status(400).json({ msg: "You can't reply to a comment that is already a reply" });
    }
    const params = {
        content: req.body.content,
        author: userId,
        movie: comment.movie,
        isReply: true,
        parentComment: req.body.commentId
    };
    const newComment = new comment_1.default(params);
    yield newComment.save();
    return res.status(201).json(newComment);
});
exports.commentComment = commentComment;
const getMovieComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.movieId) {
        return res.status(400).json({ msg: "Please. Provide with a movieId" });
    }
    const movie = movie_1.default.findOne({ apiId: req.body.movieId });
    if (!movie) {
        return res.status(400).json({ msg: "The passed movie Id does not exist" });
    }
    const comments = yield comment_1.default.find({ movie: req.body.movieId, isReply: false });
    // console.log(comments);
    return res.status(200).json(comments);
});
exports.getMovieComments = getMovieComments;
const getCommentComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.commentId) {
        return res.status(400).json({ msg: "Please. Provide with a commentId" });
    }
    const comment = yield comment_1.default.findOne({ _id: req.body.commentId });
    if (!comment) {
        return res.status(400).json({ msg: "The passed commentId does not exist" });
    }
    const comments = yield comment_1.default.find({ parentComment: req.body.commentId });
    return res.status(200).json(comments);
});
exports.getCommentComments = getCommentComments;
