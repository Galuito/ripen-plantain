import { model, Schema, Document} from 'mongoose';
import { IUser } from './user';

export interface IComment extends Document{
  content: string;
  author: Schema.Types.ObjectId | IUser;
  movie: string;
  createdAt: Date;
  isReply: boolean;
  parentComment: Schema.Types.ObjectId;
}

const commentSchema: Schema<IComment> = new Schema({
  content:{
    type: String,
    required: true,
    maxlength: 160
  },
  author:{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movie:{
    type: String,
    required: true
  },
  createdAt:{
    type:Date,
    default: Date.now
  },
  isReply:{
    type: Boolean,
    default: false
  },
  parentComment:{
    type: Schema.Types.ObjectId,
    ref:"Comment",
    required: false
  }
})

export default model<IComment>('Comment', commentSchema);
