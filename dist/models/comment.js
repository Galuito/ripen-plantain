"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    content: {
        type: String,
        required: true,
        maxlength: 160
    },
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    movie: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isReply: {
        type: Boolean,
        default: false
    },
    parentComment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Comment",
        required: false
    }
});
exports.default = (0, mongoose_1.model)('Comment', commentSchema);
