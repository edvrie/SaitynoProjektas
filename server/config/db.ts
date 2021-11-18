const mongoose = require('mongoose');

export const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (err) {
        //TO DO: HANDLE ERRORS
        console.log(err);
    };
};

export const disconnectDB = () => {
    mongoose.disconnect();
}
