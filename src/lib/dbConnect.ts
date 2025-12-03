import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

export async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Database is already connect");
    console.log("connection===>", connection);
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});

    connection.isConnected = db.connections[0].readyState;

    console.log("db url====>", db.connection.host);
    console.log("DB connection successfully");
  } catch (error) {
    console.log("DB Connection failed");
    process.exit(1);
  }
}
