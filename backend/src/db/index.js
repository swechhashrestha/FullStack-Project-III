const mongoose = require('mongoose');

async function connectDB(){
try {
    await mongoose.connect("mongodb+srv://swechha:b3ginagain@cluster0.8a4xzpa.mongodb.net/food")
    console.log("Database connected successfully")
} catch (error) {
    console.log("Failed to connect to database", error);
  }
}

module.exports= connectDB;