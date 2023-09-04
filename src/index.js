const app = require("./app");
const mongoose = require("mongoose");
const url = "mongodb://0.0.0.0/ToDoList";
require("dotenv").config();
const port = process.env.PORT || 1008;
async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI || url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connection to DB is successful");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

connectToMongoDB();
app.listen(port, () => console.log("Server is up and running", port));
