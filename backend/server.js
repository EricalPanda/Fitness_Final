// server.js
const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

const authenRouters = require('./routes/authenRouters')
const userRoutes = require("./routes/userRoutes");
const coachRouter = require("./routes/coachRouter");
const adminRoutes = require("./routes/adminRouter");
const sendEmailRouter = require('./routes/sendEmailRouter');


const chalk = require("chalk");
const connectDB = require("./config/mongodb"); // Import hàm connectDB


// Kết nối MongoDB
connectDB();

// Middleware
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};


app.use(cors(corsOptions));
app.use(express.json());

// API
app.get('/', function (req, res) {
  res.send('Hello World')
})
app.use('/api/authenticate', authenRouters);
app.use("/api/users", userRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/coaches', coachRouter);
app.use('/api/mail', sendEmailRouter);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(chalk.cyanBright(`Server is running on port ${PORT}`));
});