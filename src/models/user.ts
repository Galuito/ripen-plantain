import { model, Schema, Document} from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document{
  fullname: string;
  email: string;
  profilePicture: string;
  username: string;
  password: string;
  isCritic: boolean;
  createdAt: Date;
  bio: string;
  comparePassword: (password:string)=> Promise<boolean>;
  modifyFullname: (newFullname:string)=> Promise<string>;
  modifyBio: (newBio:string)=> Promise<string>;
  modifyPFP: (newPFP:string)=> Promise<string>;
  modifyUsername: (newUsername:string)=> Promise<string>;
  modifyPassword: (newPassword:string)=> Promise<string>;
}

const userSchema = new Schema({
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
  fullname:{
    type: String,
    required: true,
    trim: true
  },
  bio:{
    type: String,
    default:"New to Ripen Plantain :D",
    maxlength: 70
  },
  profilePicture:{
    type: String,
    default: 'https://assets.bonappetit.com/photos/58ed0fa929b83d6788a009c2/master/w_1600%2Cc_limit/02232017%2520HEALTHYISH5343.jpg'
  },
  createdAt:{
    type: Date,
    default: Date.now
  },
  isCritic:{
    type: Boolean,
    default: false
  }
});

userSchema.pre<IUser>('save', async function(next){
  const user = this;
  if (!user.isModified('password')) return next();

  // This only executes if there was a change to the password
  // otherwise, nothing happens and next() is executed
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});

// User Methods

userSchema.methods.comparePassword = async function(password: string): Promise<boolean>{
  return await bcrypt.compare(password ,this.password);
}

userSchema.methods.modifyFullname = async function(newFullname: string): Promise<string>{
  this.fullname = newFullname;
  await this.save();
  console.log(`User: ${this.username} was modified (fullname) and saved successfully`);
  return this.username;
}

userSchema.methods.modifyBio = async function(newBio: string): Promise<string>{
  this.bio = newBio;
  await this.save();
  console.log(`User: ${this.username} was modified (bio) and saved successfully`);
  return this.username;
}

userSchema.methods.modifyPFP = async function(newPFP: string): Promise<string>{
  this.profilePicture = newPFP;
  await this.save();
  console.log(`User: ${this.username} was modified (PFP) and saved successfully`);
  return this.username;
}

userSchema.methods.modifyBanner = async function(newBanner: string): Promise<string>{
  this.bannerPicture = newBanner;
  await this.save();
  console.log(`User: ${this.username} was modified (Banner) and saved successfully`);
  return this.username;
}

userSchema.methods.modifyUsername = async function(newUsername: string): Promise<string>{
  this.username = newUsername;
  await this.save();
  console.log(`User: ${this.username} was modified (username) and saved successfully`);
  return this.username;
}

userSchema.methods.modifyPassword = async function(newPassword: string): Promise<string>{
  this.password = newPassword;
  await this.save();
  console.log(`User: ${this.username} was modified (password) and saved successfully`);
  return this.username;
}

export default model<IUser>('User', userSchema);