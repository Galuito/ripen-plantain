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
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    bio: {
        type: String,
        default: "New to Ripen Plantain :D",
        maxlength: 70
    },
    profilePicture: {
        type: String,
        default: 'https://assets.bonappetit.com/photos/58ed0fa929b83d6788a009c2/master/w_1600%2Cc_limit/02232017%2520HEALTHYISH5343.jpg'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isCritic: {
        type: Boolean,
        default: false
    }
});
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (!user.isModified('password'))
            return next();
        // This only executes if there was a change to the password
        // otherwise, nothing happens and next() is executed
        const salt = yield bcrypt_1.default.genSalt(10);
        const hash = yield bcrypt_1.default.hash(user.password, salt);
        user.password = hash;
        next();
    });
});
// User Methods
userSchema.methods.comparePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(password, this.password);
    });
};
userSchema.methods.modifyFullname = function (newFullname) {
    return __awaiter(this, void 0, void 0, function* () {
        this.fullname = newFullname;
        yield this.save();
        console.log(`User: ${this.username} was modified (fullname) and saved successfully`);
        return this.username;
    });
};
userSchema.methods.modifyBio = function (newBio) {
    return __awaiter(this, void 0, void 0, function* () {
        this.bio = newBio;
        yield this.save();
        console.log(`User: ${this.username} was modified (bio) and saved successfully`);
        return this.username;
    });
};
userSchema.methods.modifyPFP = function (newPFP) {
    return __awaiter(this, void 0, void 0, function* () {
        this.profilePicture = newPFP;
        yield this.save();
        console.log(`User: ${this.username} was modified (PFP) and saved successfully`);
        return this.username;
    });
};
userSchema.methods.modifyBanner = function (newBanner) {
    return __awaiter(this, void 0, void 0, function* () {
        this.bannerPicture = newBanner;
        yield this.save();
        console.log(`User: ${this.username} was modified (Banner) and saved successfully`);
        return this.username;
    });
};
userSchema.methods.modifyUsername = function (newUsername) {
    return __awaiter(this, void 0, void 0, function* () {
        this.username = newUsername;
        yield this.save();
        console.log(`User: ${this.username} was modified (username) and saved successfully`);
        return this.username;
    });
};
userSchema.methods.modifyPassword = function (newPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        this.password = newPassword;
        yield this.save();
        console.log(`User: ${this.username} was modified (password) and saved successfully`);
        return this.username;
    });
};
exports.default = (0, mongoose_1.model)('User', userSchema);
