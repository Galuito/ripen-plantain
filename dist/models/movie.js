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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const movieSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    genre: {
        type: String,
        required: true
    },
    posterImage: {
        type: String,
        default: 'https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png'
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    trailer: {
        type: String,
        default: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    },
    userRatings: [
        { userId: mongoose_1.Schema.Types.ObjectId,
            value: Number
        }
    ],
    userInt: {
        type: Number,
        default: 0
    },
    userMean: {
        type: Number,
        default: 0
    },
    criticRatings: [
        { userId: mongoose_1.Schema.Types.ObjectId,
            value: Number
        }
    ],
    criticInt: {
        type: Number,
        default: 0
    },
    criticMean: {
        type: Number,
        default: 0
    },
    rating: {
        type: String,
        default: 'G'
    },
    originalLanguage: {
        type: String,
        default: 'English'
    },
    releaseDate: {
        type: String
    },
    duration: {
        type: String,
        default: '00:00:00',
    },
    isMovie: {
        type: Boolean,
        default: true
    },
    apiId: {
        type: String,
        required: true,
        unique: true
    }
});
// Methods go here
movieSchema.methods.updateRunningMeanUsers = function (userId, newRating) {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-ignore
        const existingRatingIndex = this.userRatings.findIndex(entry => entry.userId.equals(userId));
        if (existingRatingIndex !== -1) {
            // User has rated this movie before
            const oldRating = this.userRatings[existingRatingIndex].value;
            this.userMean = (this.userMean * this.userInt - oldRating + newRating) / this.userInt;
            this.userRatings[existingRatingIndex].value = newRating;
            yield this.save();
        }
        else {
            // User has not rated this movie before
            this.userMean = (this.userMean * this.userInt + newRating) / (this.userInt + 1);
            this.userRatings.push({ userId, value: newRating });
            this.userInt += 1;
            yield this.save();
        }
    });
};
movieSchema.methods.updateRunningMeanCritics = function (userId, newRating) {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-ignore
        const existingRatingIndex = this.criticRatings.findIndex(entry => entry.userId.equals(userId));
        if (existingRatingIndex !== -1) {
            // User has rated this movie before
            const oldRating = this.criticRatings[existingRatingIndex].value;
            this.criticMean = (this.criticMean * this.criticInt - oldRating + newRating) / this.criticInt;
            this.criticRatings[existingRatingIndex].value = newRating;
            yield this.save();
        }
        else {
            // User has not rated this movie before
            this.criticMean = (this.criticMean * this.criticInt + newRating) / (this.criticInt + 1);
            this.criticRatings.push({ userId, value: newRating });
            this.criticInt += 1;
            yield this.save();
        }
    });
};
movieSchema.methods.addTrailer = function (trailerUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        this.trailer = trailerUrl;
        yield this.save();
        console.log(`Movie: ${this.title} was modified (Trailer) and saved successfully`);
        return;
    });
};
exports.default = (0, mongoose_1.model)('Movie', movieSchema);
