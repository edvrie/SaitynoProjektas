import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from '../config/db';
import userModel from '../schemas/user';
import themeModel from '../schemas/theme';
import postModel from '../schemas/post';
import commentModel from '../schemas/comment';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { checkAuth } from './auth';
import { apiErrorHelper } from '../utils/errorHelper';
import ApiError from '../utils/ApiError';
import { permissionCheckGeneric, permissionCheckThemes, permissionCheckPosts, permissionCheckComments, permissionCheckAdmin, USER_ROLES } from '../utils/roleHelper';
import { validateId } from '../utils/userInfoGetter';
import cors from 'cors';

//Config
dotenv.config({ path: './config/config.env' });

// IMPORTTANT: THIS MIGHT BREAK SINCE IT CAN NO LONGER FIND THE IMPORT
// IN THAT CASE CHANGE IMPORT TO REQUIRE 
const app = express();
const port = process.env.PORT || 3000;

// JSON parse
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError) {
        next(ApiError.badRequest("Bad body"));
        return;
    }
    next();
})

connectDB();

const themes = [
    {
        id: 1,
        title: "Science",
        activeDiscusions: 10
    },
    {
        id: 2,
        title: "Memes",
        activeDiscusions: 2
    },
    {
        id: 3,
        title: "Sports",
        activeDiscusions: 5
    }
];

const posts = [
    {
        id: "751213",
        user: "Tom",
        text: "How do I close VIM?"
    }
];

const comments = [
    {
        id: "4887",
        postId: "751213",
        userId: "48753asee",
        text: "This is true"
    }
];

const parseIds = (id: string) => {
    const idInt = Number(id);
    if (isNaN(idInt)) {
        throw new Error("Invalid URL");
    }
};

// AUTH 
app.post('/signup', async (req, res, next) => {
    const hashedPswrd = await bcrypt.hash(req.body.password, 10);
    const user = new userModel({
        username: req.body.username,
        email: req.body.email,
        password: hashedPswrd,
        userRole: req.body.userRole || "SIMPLE_USER"
    });
    try{
        await user.save();
        res.status(201).send(user);
    } catch (err) {
        next(ApiError.badRequest("Something went wrong :("));
    };
});

app.post('/login', async (req, res, next) => {
    const user = await userModel.findOne({
        email: req.body.email
    });
    if (user){
        await bcrypt.compare(req.body.password, user.password, (error, result) => {
            if (error) {
                next(ApiError.badRequest("Login failed"));
                return;
            }
            if (result) {
                const token = jwt.sign({
                    email: user.email,
                    userId: user._id,
                    username: user.username
                },
                process.env.JWT_KEY,
                {
                    expiresIn: "1h"
                });
                return res.status(201).json({
                    message: "Login successful",
                    authToken: token
                })
            }
        });
    } else {
        next(ApiError.badRequest("Login failed"));
        return;
    };
});

app.get('/', (req, res) => {
    res.send('Hello!');
});

// GET LISTED
app.get('/api/themes', async (req, res, next) => {
    try{
        const themes = await themeModel.find({});
        res.status(200).json(themes);
        return;
    } catch {
        next(ApiError.badRequest(":("));
        return;
    };
});

app.get('/api/themes/:id/posts', validateId, async (req, res, next) => {
    try {
        const posts = await postModel.find({ themeId: req.params.id });
        res.status(200).json(posts);
        return;
    } catch {
        next(ApiError.badRequest(":("));
        return;
    };
});

app.get('/api/themes/:themeId/posts/:postId/comments', validateId, async (req, res, next) => {
    try {
        const comments = await commentModel.find({ themeId: req.params.themeId, postId: req.params.postId });
        res.status(200).json(comments);
    } catch {
        next(ApiError.badRequest(":("));
        return;
    };
});

// GET BY ID
app.get('/api/themes/:id', validateId, async (req, res, next) => {
    try {
        const theme = await themeModel.findOne({ _id: req.params.id });
        res.status(200).json(theme)
        return;
    } catch {
        next(ApiError.badRequest("Something went wrong :("));
        return;
    };
});

app.get('/api/themes/:themeId/posts/:postId', validateId, async (req, res, next) => {
    try {
        const post = await postModel.findOne({ _id: req.params.postId, themeId: req.params.themeId });
        res.status(200).json(post);
        return;
    } catch {
        next(ApiError.badRequest("Something went wrong :("));
        return;
    };
});

app.get('/api/themes/:themeId/posts/:postId/comments/:commentId', validateId, async (req, res, next) => {
    try {
        const comment = await commentModel.findOne({ _id: req.params.commentId, themeId: req.params.themeId, postId: req.params.postId });
        res.status(200).json(comment);
        return;
    } catch {
        next(ApiError.badRequest("Something went wrong :("));
        return;
    };
});

// POST
app.post('/api/themes', checkAuth, permissionCheckGeneric,  async (req, res, next) => {
    try {
        const theme = new themeModel({ 
            name: req.body.name,
            userId: req['userData'].userId
         });
        await theme.save(theme);
        res.status(201).send({theme, "status": "ok"});
        return;
    } catch {
        next(ApiError.badRequest("Something went wrong :("));
        return;
    };
});

app.post('/api/themes/:id/posts', validateId, checkAuth, permissionCheckGeneric, async (req, res, next) => {
    try {
        const theme = await themeModel.findOne({ _id: req.params.id })
        if (!theme) {
            next(ApiError.notFound("Theme does not exist"));
            return;
        }
        const post = new postModel({
            title: req.body.title,
            themeId: req.params.id,
            content: req.body.content,
            userId: req['userData'].userId
        });
        await post.save(post);
        res.status(201).send({post, "status": "ok"});
        return;
    } catch {
        next(ApiError.badRequest("Something went wrong :("));
        return;
    };
});

app.post('/api/themes/:themeId/posts/:postId/comments', validateId, checkAuth, permissionCheckGeneric, async (req, res, next) => {
    try {
        const theme = await themeModel.findOne({ _id: req.params.themeId })
        if (!theme) {
            next(ApiError.notFound("Theme does not exist"));
            return;
        }
        const post = await postModel.findOne({ _id: req.params.postId });
        if (!post){
            next(ApiError.notFound("Post does not exist"));
            return;
        }
        const comment = new commentModel({
            userId: req['userData'].userId,
            themeId: req.params.themeId,
            postId: req.params.postId,
            content: req.body.content
        });
        await comment.save(comment);
        res.status(201).send({comment, "status": "ok"});
        return;
    } catch {
        next(ApiError.badRequest("Something went wrong :("));
        return;
    };
});

// PUT
app.patch('/api/themes/:id', validateId, checkAuth, permissionCheckThemes, async (req, res, next) => {
    try {
        await themeModel.updateOne({ _id: req.params.id }, req.body);
        res.status(200).json("Ok");
        return;
    } catch {
        next(ApiError.badRequest("Something went wrong :("));
        return;
    };
});

app.patch('/api/themes/:themeId/posts/:postId', validateId, checkAuth, permissionCheckPosts, async (req, res, next) => {
    try {
        await postModel.updateOne({ _id: req.params.postId }, req.body);
        res.status(200).json("Ok");
        return;
    } catch {
        next(ApiError.badRequest("Something went wrong :("));
        return;
    };
});

app.patch('/api/themes/:themeId/posts/:postId/comments/:commentId', validateId, checkAuth, permissionCheckComments, async (req, res, next) => {
    try {
       await commentModel.updateOne({ _id: req.params.commentId }, req.body);
       res.status(200).json("Ok");
       return;
    } catch {
        next(ApiError.badRequest("Something went wrong :(("));
        return;
    };
});

// DELETE
app.delete('/api/themes/:id', validateId, checkAuth, permissionCheckThemes, async (req, res, next) => {
    try{
        await themeModel.deleteOne({ _id: req.params.id });
        await postModel.deleteMany({ themeId: req.params.id });
        await commentModel.deleteMany({ themeId: req.params.id });
        res.status(200).json("Ok");
        return;
    } catch {
        next(ApiError.badRequest("Something went wrong"));
        return;
    }
});

app.delete('/api/themes/:themeId/posts/:postId', validateId, checkAuth, permissionCheckPosts, async (req, res, next) => {
    try {
        await postModel.deleteOne({ _id: req.params.postId, themeId: req.params.themeId });
        await commentModel.deleteMany({ postId: req.params.postId, themeId: req.params.themeId });
        res.status(200).json("Ok");
        return;
    } catch {
        next(ApiError.badRequest(":("));
        return;
    };
});

app.delete('/api/themes/:themeId/posts/:postId/comments/:commentId', validateId, checkAuth, permissionCheckComments, async (req, res, next) => {
    try {
        await commentModel.deleteOne({ _id: req.params.commentId, themeId: req.params.themeId, postId: req.params.postId });
        res.status(200).json("Ok");
        return;
    } catch {
        next(ApiError.badRequest(":("));
        return;
    };
});

//FOR PAGES NOT DEFINED IN THE API
app.use((req, res, next) => {
    res.status(404).send({
        status: 404,
        error: "Page not found"
    });
});

app.use(apiErrorHelper);

// SET SERVER TO LISTEN TO PORT 3000
app.listen(port, ()=> console.log(`Server listening at port ${port}`));