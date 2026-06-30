import mongoose from "mongoose";

export const dbconnection = () => {
    mongoose.connect(process.env.MONGO_URI, {
        dbName: "Hospital_Management_System",
}).then(() =>{
    console.log("Database Connected Successfully");
}).catch(err => {
    console.log("Database Connection Failed", err);
});
}   
