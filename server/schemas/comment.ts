import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    postId: {
        type: String,
        required: true
    },
    themeId: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;