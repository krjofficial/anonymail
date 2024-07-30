import mongoose from "mongoose";

type ConnectionObject = {
  isConnected ?: number // ? represents that isConnected is optional
  // if present will be a number
  // Connection object may or may not have isConnected property
}

// Initializing the connection object as an empty object 
const connection: ConnectionObject = {}


async function dbConnect(): Promise<void> { // void - no return value 
  if (connection.isConnected) { // Check whether the database is already connected
    console.log("Already connected to the database.");
    return; // function is ended, with no return value
  }

  try { // attempt to connect to the database
    const db = await mongoose.connect(process.env.MONGODB_URI || '', {}) // await - stop execution of function until the promise is resolved
    connection.isConnected = db.connections[0].readyState
    console.log("Connected to the database.");
  } catch (error) {
    console.log("Database connection Failed", error);
    process.exit(1);
  }
}

// db.connections[0]
// db: This variable represents the result of a successful connection to the MongoDB database using Mongoose. It’s an object that includes information about the connection.
// connections: This is an array of all the connections managed by Mongoose. In most typical cases, you would have a single connection, so db.connections is an array with one element.
// [0]: Since connections is an array, [0] accesses the first (and usually only) connection in this array.
// 2. readyState
// readyState: This property indicates the state of the connection to the MongoDB server. It is a numeric value representing different states of the connection. The possible values are:

// 0: Disconnected
// 1: Connected
// 2: Connecting
// 3: Disconnecting
// readyState provides a way to check the current status of the connection.

export default dbConnect;