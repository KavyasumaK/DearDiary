/****************************
 * Title: Server
 * Intial Date: 09/06/2020
 * Summary: connects to DB through mongoose library and then established  connection to server through app.js.
 * Any unhandled errors in DB will(shouldn't) trickle down here and shut down the DB.
 * Change 1:
 ****************************/

const mongoose = require("mongoose");
const dotenv = require("dotenv");

//configuring the env variable to include the path to environmental file.
dotenv.config({ path: "./config.env" });

//Getting the connection string from the .env file
const DBString = process.env.ALLDB.replace(
  "<PASSWORD>",
  process.env.DBPASSWORD
);
//Establishing connection to the DB using asyn await function as mongoose.connect returns a promise.

(async () => {
  const connectionSuccess = await mongoose.connect(DBString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true
  });
  if (connectionSuccess) console.log("DB Connection Succeeded...🔗");
})();

//TO server>>>
const app = require("./app");
//Server to listen on certain port.
const port = process.env.PORT;


const server = app.listen(port, () => {
  console.log(`listening on port ${port}... 👂`);
});

//DB Atlas unhandled Rejections if any.
process.on("unhandledRejection", (err) => {
  console.log("unhandled Rejection: Shutting Down... 🔐");
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
