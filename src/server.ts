import app from "./app";
import mongoose from "mongoose";

const PORT = 5000;

async function main() {
  try {
    await mongoose.connect(
      "mongodb+srv://mongodb:mongodb@cluster0.pv5rt6u.mongodb.net/Library_Management_API_APP?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Connected to MongoDB using Mongoose!");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server start error:", error);
  }
}

main();
