import mongoose, { Schema, Model, Document } from 'mongoose';

type UserDocument = Document & {
  name: string;
  email: string;
  role: string[];
};

type UserInput = {
  name: UserDocument['name'];
  email: UserDocument['email'];
  role: UserDocument['role'];
};

const usersSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    role: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: true,
        index: true,
      },
    ],
  },
  {
    collection: 'users',
    timestamps: true,
  },
);

const User: Model<UserDocument> = mongoose.model<UserDocument>('User', usersSchema);

export { User, UserInput, UserDocument };
