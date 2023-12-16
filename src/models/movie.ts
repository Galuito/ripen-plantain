import { model, Schema, Document} from 'mongoose';

interface RatingEntry {
  userId: Schema.Types.ObjectId,
  value: number
}

export interface IMovie extends Document{
  title: string;
  genre: string;
  posterImage: string;
  description: string;
  trailer: string; // Link that will play with an embedded player
  userRatings: RatingEntry[]; // Array that holds the user and the value that it gave
  userMean: number; // The mean of the user ratings, starts at 0
  userInt: number; // Amount of users that rated the movie (Integer)
  criticRatings: RatingEntry[]; // Array that holds the critic and the value that it gave
  criticMean: number; // The mean of the critic ratings, starts at 0
  criticInt: number; // Amount of critics that rated the movie (Integer)
  rating: string; // G PG PG-13 R NC-17
  originalLanguage: string; // Original Language
  releaseDate: string;
  duration: string;
  isMovie: boolean; // It can be a series
  apiId: number; // Id returned from the API
  updateRunningMeanUsers: (userId: Schema.Types.ObjectId, newRating:number)=> void;
  updateRunningMeanCritics: (userId: Schema.Types.ObjectId, newRating:number)=> void;
  addTrailer: (trailerUrl: string) => void;
}

const movieSchema = new Schema({
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
  trailer:{
    type: String,
    default: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  userRatings: [
    {userId: Schema.Types.ObjectId, 
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
    {userId: Schema.Types.ObjectId, 
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
})

// Methods go here

movieSchema.methods.updateRunningMeanUsers = async function(userId: Schema.Types.ObjectId, newRating: number){
  // @ts-ignore
  const existingRatingIndex = this.userRatings.findIndex(entry => entry.userId.equals(userId))
  if(existingRatingIndex !== -1){
    // User has rated this movie before
    const oldRating = this.userRatings[existingRatingIndex].value;
    this.userMean = (this.userMean * this.userInt - oldRating + newRating) / this.userInt;
    this.userRatings[existingRatingIndex].value = newRating;
    await this.save();
  }else{
    // User has not rated this movie before
    this.userMean = (this.userMean * this.userInt + newRating) / (this.userInt + 1);
    this.userRatings.push({ userId, value: newRating });
    this.userInt += 1;
    await this.save();
  }
}

movieSchema.methods.updateRunningMeanCritics = async function(userId: Schema.Types.ObjectId, newRating: number){
  // @ts-ignore
  const existingRatingIndex = this.criticRatings.findIndex(entry => entry.userId.equals(userId))
  if(existingRatingIndex !== -1){
    // User has rated this movie before
    const oldRating = this.criticRatings[existingRatingIndex].value;
    this.criticMean = (this.criticMean * this.criticInt - oldRating + newRating) / this.criticInt;
    this.criticRatings[existingRatingIndex].value = newRating;
    await this.save();
  }else{
    // User has not rated this movie before
    this.criticMean = (this.criticMean * this.criticInt + newRating) / (this.criticInt + 1);
    this.criticRatings.push({ userId, value: newRating });
    this.criticInt += 1;
    await this.save();
  }
}

movieSchema.methods.addTrailer = async function(trailerUrl: String){
  this.trailer = trailerUrl;
  await this.save();
  console.log(`Movie: ${this.title} was modified (Trailer) and saved successfully`);
  return
}

export default model<IMovie>('Movie', movieSchema)