import mongoose from 'mongoose';

const themeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: String,
        required: true
    }
});

const Theme = mongoose.model("Theme", themeSchema);

export default Theme;