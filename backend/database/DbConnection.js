import mongoose from "mongoose";

const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URL, {
      dbName: "ProFolio",
    })
    .then(() => {
      console.log("connected to database");
    })
    .catch((error) => {
      console.log(
        `some error occured while connecting to database with error ${error}`
      );
    });
};
export default dbConnection;
