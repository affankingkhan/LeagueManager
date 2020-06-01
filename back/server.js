const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});


const authenticationRouter = require('./routes/SignupLogin/authentication');
const usersRouter = require("./routes/users");
const teamRouter = require('./routes/App/Team/team.route');
const rosterRouter = require('./routes/App/Team/roster.route');
const profileRouter = require('./routes/App/Player/profile.route');
const scheduleRouter = require('./routes/App/Schedule/schedule.route');
app.use('/api', authenticationRouter);
app.use('/users', usersRouter);
app.use('/roster', rosterRouter);
app.use('/team', teamRouter);
app.use('/profile', profileRouter);
app.use('/schedule', scheduleRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
