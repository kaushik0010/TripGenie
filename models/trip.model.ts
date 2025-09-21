import mongoose, { Schema, Document, models } from 'mongoose';
import { IUser } from './user.model';

export interface ITrip extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    user: IUser;
    tripName: string;
    sourceLocation?: string;
    destination?: string;
    estimatedCost: object;
    budgetAssessment: string;
    itinerary: object[];
    createdAt: Date;
}

const tripSchema: Schema<ITrip> = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tripName: {
        type: String,
        required: true
    },
    sourceLocation: { 
        type: String 
    },
    destination: { 
        type: String 
    },
    estimatedCost: {
        type: Object,
        required: true
    },
    budgetAssessment: {
        type: String,
        required: true
    },
    itinerary: {
        type: [Object],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

const Trip = (models.Trip as mongoose.Model<ITrip>) || mongoose.model<ITrip>("Trip", tripSchema);

export default Trip;