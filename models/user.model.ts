import mongoose, { Schema, Document, models } from 'mongoose';
import { ITrip } from './trip.model';

export interface IUser extends Document {
    uid: string;
    email: string;
    name?: string;
    createdAt: Date;
    lastLogin: Date;
    savedTrips: ITrip['_id'][];
}

const userSchema: Schema<IUser> = new Schema({
    uid: { 
        type: String, 
        unique: true 
    },
    email: { 
        type: String, 
        unique: true 
    },
    name: { 
        type: String 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    lastLogin: { 
        type: Date, 
        default: Date.now 
    },
    savedTrips: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Trip' 
    }]
});

const User = (models.User as mongoose.Model<IUser>) || mongoose.model<IUser>("User", userSchema);

export default User;