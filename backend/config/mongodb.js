// config/mongodb.js
const mongoose = require("mongoose");
const chalk = require("chalk");

const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb+srv://FitZoneDB:1A2b3C4d@fitzone.ijrod.mongodb.net/FitZone_DB?retryWrites=true&w=majority&appName=FitZone`, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(chalk.yellowBright("MongoDB Connected!\n"));
  } catch (err) {
    console.error(chalk.red(`Error: ${err.message}`));
    process.exit(1);
  }
};

module.exports = connectDB;
