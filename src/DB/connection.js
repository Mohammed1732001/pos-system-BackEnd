import mongoose from "mongoose";


const connectDB = async () => {
    return await mongoose.connect(process.env.DATABASE_URL).then(result => {
        console.log(`DB CONNECTED ...............`);
        //  console.log(result);

    }).catch(err => {
        console.log(`fail connect ...............${err}`);
    })
}

export default connectDB












