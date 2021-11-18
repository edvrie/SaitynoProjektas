import express from 'express';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../config/db';
import userModel from '../schemas/user';
import themeModel from '../schemas/theme';
import postModel from '../schemas/post';
import commentModel from '../schemas/comment';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { checkAuth } from './auth';
import { getCurrentUser } from '../utils/userInfoGetter';
import { apiErrorHelper } from '../utils/errorHelper';
import ApiError from '../utils/ApiError';
import { permissionCheckGeneric, permissionCheckThemes, permissionCheckPosts, permissionCheckComments, permissionCheckAdmin, USER_ROLES } from '../utils/roleHelper';

//Config
dotenv.config({ path: './config/config.env' });

// IMPORTTANT: THIS MIGHT BREAK SINCE IT CAN NO LONGER FIND THE IMPORT
// IN THAT CASE CHANGE IMPORT TO REQUIRE 
const app = express();
const port = process.env.PORT || 3000;

interface USER {
    username: string;
    userId: string;
    userRole: string;
    auth: string;
}

// JSON parse
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

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
app.get('/api/themes', (req, res) => {
    try{
        themes ? res.json(themes) : res.status(404).send({
            status: 404,
            error: "Not found"
        });
    } catch {
        res.status(400).send({
            status: 400,
            error: "Invalid URL"
        });
    };
});

app.get('/api/themes/:id/posts', (req, res) => {
    try {
        parseIds(req.params.id);
        posts ? res.json(posts) : res.status(404).send({
            status: 404,
            error: "Not found"
        });
    } catch {
        res.status(400).send({
            status: 400,
            error: "Invalid URL"
        });
    };
});

app.get('/api/themes/:themeId/posts/:postId/comments', (req, res) => {
    try {
        parseIds(req.params.themeId);
        parseIds(req.params.postId);
        comments ? res.json(comments) : res.status(404).send({
            status: 404,
            error: "Not found"
        });
    } catch {
        res.status(400).send({
            status: 400,
            error: "Invalid URL"
        });
    };
});

// GET BY ID
app.get('/api/themes/:id', (req, res) => {
    try {
        parseIds(req.params.id);
        const id = req.params.id;
        const theme = themes.find((theme) => theme.id === parseInt(id));
        theme ? res.send(theme) : res.status(404).send({
            status: 404,
            error: "Not found"
        });
    } catch {
        res.status(400).send({
            status: 400,
            error: "Invalid URL"
        });
    };
});

app.get('/api/themes/:themeId/posts/:postId', (req, res) => {
    try {
        parseIds(req.params.themeId);
        parseIds(req.params.postId);
        const id = req.params.postId;
        const post = posts.find((post) => post.id === id);
        post ? res.status(200).send({post}) : res.status(404).send({
            status: 404,
            error: "Not found"
        });
    } catch {
        res.status(400).send({
            status: 400,
            error: "Invalid URL"
        });
    };
});

app.get('/api/themes/:themeId/posts/:postId/comments/:commentId', (req, res) => {
    try {
        parseIds(req.params.themeId);
        parseIds(req.params.postId);
        parseIds(req.params.commentId);
        const id = req.params.commentId;
        const comment = comments.find((comment) => comment.id === id);
        comment ? res.status(200).send(comment) : res.status(404).send({
            status: 404,
            error: "Not found"
        });
    } catch {
        res.status(400).send({
            status: 400,
            error: "Invalid URL"
        });
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

app.post('/api/themes/:id/posts', checkAuth, permissionCheckGeneric, async (req, res, next) => {
    try {
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

app.post('/api/themes/:themeId/posts/:postId/comments', checkAuth, permissionCheckGeneric, async (req, res, next) => {
    try {
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
app.patch('/api/themes/:id', checkAuth, permissionCheckThemes, async (req, res, next) => {
    try {
        await themeModel.updateOne({ _id: req.params.id }, req.body);
        res.status(200).json("Ok");
        return;
    } catch {
        next(ApiError.badRequest("Something went wrong :("));
        return;
    };
});

app.patch('/api/themes/:themeId/posts/:postId', checkAuth, permissionCheckPosts, async (req, res, next) => {
    try {
        await postModel.updateOne({ _id: req.params.postId }, req.body);
        res.status(200).json("Ok");
        return;
    } catch {
        next(ApiError.badRequest("Something went wrong :("));
        return;
    };
});

app.patch('/api/themes/:themeId/posts/:postId/comments/:commentId', checkAuth, permissionCheckComments, async (req, res, next) => {
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
app.delete('/api/themes/:id', checkAuth, permissionCheckThemes, async (req, res, next) => {
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

app.delete('/api/themes/:themeId/posts/:postId', checkAuth, permissionCheckPosts, async (req, res, next) => {
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

app.delete('/api/themes/:themeId/posts/:postId/comments/:commentId', checkAuth, permissionCheckComments, async (req, res, next) => {
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