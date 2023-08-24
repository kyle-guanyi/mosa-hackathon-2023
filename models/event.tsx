import { Schema, model, models, Document, Types } from 'mongoose';

import { DateTime } from "luxon";

type IEvent = Document & {
  creator: Types.ObjectId;
  attendees: Types.ObjectId[];
  interested: Types.ObjectId[];
  isPublic: boolean;
  eventName: string;
  isVirtual: boolean;
  location?: string;
  closestCity?: string;
  zoomLink?: string;
  startDate: Date;
  startTime: string;
  timeZone: string;
  eventDescription: string;
  isCompleted?: boolean;
  uploadedPictures: string[];
  eventImage: string;
  lastEdited: Date;
  UTCEventTime: Date;
};

const eventSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  attendees: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  interested: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
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
  closestCity: {
    type: String,
    required: function (this: IEvent) {
      return !this.isVirtual; // closest city is required if virtual is false
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
  timeZone: {
    type: String,
    required: true,
  },
  isCompleted: {
    type: Boolean,
  },
  eventDescription: {
    type: String,
    required: true,
  },
  eventImage: {
    type: String,
  },
  uploadedPictures: {
    type: [String],
  },
  lastEdited: {
    type: Date,
    default: Date.now,
  },
  UTCEventTime: {
    type: Date,
  }
});

eventSchema.pre<IEvent>('save', async function (next) {
  const eventDateTime = DateTime.fromJSDate(this.startDate, {
    zone: this.timeZone,
  });

  const [hours, minutes] = this.startTime.split(':').map(Number);
  const eventStartTime = eventDateTime.set({
    hour: hours,
    minute: minutes,
  });

  this.UTCEventTime = eventStartTime.toUTC().toJSDate(); // Convert to UTC and save as JavaScript Date

  next();
});

const Event = models.Event || model('Event', eventSchema);

export default Event;