// @ts-nocheck
import mongoose from 'mongoose';

let isConnected = false; // track the connection

/**
 * This function connects to our MongoDB database, and handles any bad connections
 */
export const connectToDB = async () => {
  mongoose.set('strictQuery', true);

  // check if we have a connection to the database or if it's currently
  if(isConnected) {
    console.log('MongoDB is already connected');
    return;
  }

  // connect to our MongoDB database, and handle an bad connections
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "share_event",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    isConnected = true;

    console.log('MongoDB connected')
  } catch (error) {
    console.log(error);
  }
}