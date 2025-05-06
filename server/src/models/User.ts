import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
  name:string;
  email: string;
  mobile:number;
  password: string;
  fcm_token:string;
  role: 'admin' | 'user';
}

const userSchema = new Schema<IUser>({
  name: {type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: Number, required: true },
  password: { type: String, required: true },
  fcm_token: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], required: true },
});

export default model<IUser>('User', userSchema);
