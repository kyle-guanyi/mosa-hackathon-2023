import { Schema, model, models, Document, Types } from 'mongoose';

interface IEvent extends Document {
    creator: Types.ObjectId;
    attending: Types.ObjectId[];
    interested: Types.ObjectId[];
    isPublic: boolean;
    eventName: string;
    isVirtual: boolean;
    location?: string;
    zoomLink?: string;
    startDate: Date;
    startTime: string;
    eventDescription: string;
    isCompleted: boolean;
  }

const eventSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  attending: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  },
  interested: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  },
  isPublic: {
    type: Boolean,
    required: true,
  },
  eventName: {
    type: String,
    required: true,
  },
  isVirtual: {
    type: Boolean,
    required: true,
  },
  location: {
    type: String,
    required: function (this: IEvent) {
      return !this.isVirtual; // Location is required if virtual is false
    },
  },
  zoomLink: {
    type: String,
    required: function (this: IEvent) {
      return this.isVirtual; // zoomLink is required if virtual is true
    },
  },
  startDate: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  eventDescription: {
    type: String,
    required: true,
  },
});

// Middleware to set the creator as the default attending user
eventSchema.pre('save', async function (next) {
      if (!this.attending.includes(this.creator)) {
        this.attending.push(this.creator);
      }
      next();
});

const Event = models.Event || model('Event', eventSchema);

export default Event;