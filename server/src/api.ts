import express from 'express';
import { json } from 'stream/consumers';

// IMPORTTANT: THIS MIGHT BREAK SINCE IT CAN NO LONGER FIND THE IMPORT
// IN THAT CASE CHANGE IMPORT TO REQUIRE 
const app = express();
const port = 3000;

// JSON parse
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
        id: "4887a",
        postId: "751213",
        userId: "48753asee",
        text: "This is true"
    }
];

// DEFAULT 
app.get('/', (req, res) => {
    res.send('Hello!');
});

// GET LISTED
app.get('/api/themes', (req, res) => {
    try{
        themes ? res.json(themes) : res.sendStatus(404);
    } catch {
        res.status(404).send('Get failed. Please try again.');
    };
});

app.get('/api/themes/:id/posts', (req, res) => {
    try {
        posts ? res.json(posts) : res.sendStatus(404);
    } catch {
        res.status(404).send('Get failed. Please try again.');
    };
});

app.get('/api/themes/:id/posts/:id/comments', (req, res) => {
    try {
        comments ? res.json(comments) : res.sendStatus(404);
    } catch {
        res.status(404).send('Get failed. Please try again.');
    };
});

// USING QUERIES

// app.get('/posts/', (req, res) => {
//     try {
//         const query = req.query.id;
//         res.status(200).json(posts);
//     } catch {
//         res.status(404).send('Get failed. Please try again.');
//     };
// });

// app.get('/comments/', (req, res) => {
//     try {
//         const query = req.query.id;
//         res.status(200).json(comments);
//     } catch {
//         res.status(404).send('Get failed. Please try again.');
//     }
// });

// GET BY ID
app.get('/api/themes/:id', (req, res) => {
    try {
        const id = req.params.id;
        const theme = themes.find((theme) => theme.id === parseInt(id));
        theme ? res.send(theme) : res.sendStatus(404);
    } catch {
        res.status(400).send('Get failed. Please try again.');
    };
});

app.get('/api/themes/:themeId/posts/:postId', (req, res) => {
    try {
        const id = req.params.postId;
        const post = posts.find((post) => post.id === id);
        post ? res.status(200).send({post}) : res.sendStatus(404)
    } catch {
        res.status(400).send('Get failed. Please try again.');
    };
});

app.get('/api/themes/:themeId/posts/:postId/comments/:commentId', (req, res) => {
    try {
        const id = req.params.commentId;
        const comment = comments.find((comment) => comment.id === id);
        comment ? res.status(200).send(comment) : res.sendStatus(404);
    } catch {
        res.status(400).send('Get failed. Please try again.');
    };
});

// POST
app.post('/api/themes', (req, res) => {
    try {
        const reqBody = req.body;
        themes.push(reqBody);
        res.status(200).send(`Post successful: \n ${JSON.stringify(themes)}`);
    } catch {
        res.status(400).send('Post failed. Please try again.');
    };
});

app.post('/api/themes/:id/posts', (req, res) => {
    try {
        const reqBody = req.body;
        posts.push(reqBody);
        res.status(200).send(`Post successful: \n ${JSON.stringify(posts)}`);
    } catch {
        res.status(400).send('Post failed. Please try again.');
    };
});

app.post('/api/themes/:themeId/posts/:postId/comments', (req, res) => {
    try {
        const reqBody = req.body;
        comments.push(reqBody);
        res.status(200).send(`Post successful \n ${JSON.stringify(comments)}`);
    } catch {
        res.status(400).send('Post failed. Please try again.');
    };
});

// PUT
app.patch('/api/themes/:id', (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const index = themes.findIndex((theme) => theme.id === parseInt(id));
        if (themes[index] !== undefined) {
            themes[index] = data;
            res.status(200).send(themes[index]);
        } else {
            res.sendStatus(404);
        };
    } catch {
        res.status(400).send('Put failed. Please try again.');
    };
});

app.patch('/api/themes/:themeId/posts/:postId', (req, res) => {
    try {
        const id = req.params.postId;
        const data = req.body;
        const index = posts.findIndex((post) => post.id === id);
        if (posts[index] !== undefined) {
            posts[index] = data;
            res.status(200).send(posts[index]);
        } else {
            res.sendStatus(404);
        }
    } catch {
        res.status(400).send('Put failed. Please try again.');
    };
});

app.patch('/api/themes/:themeId/posts/:postId/comments/:commentId', (req, res) => {
    try {
        const id = req.params.commentId;
        const data = req.body;
        const index = comments.findIndex((comment) => comment.id === id);
        if (comments[index] !== undefined) {
            comments[index] = data;
            res.status(200).send(comments[index]);
        } else {
            res.sendStatus(404);
        }
    } catch {
        res.status(400).send('Put failed. Please try again.');
    };
});

// DELETE
app.delete('/api/themes/:id', (req, res) => {
    try{
        const id = req.params.id;
        const entity = themes.find((theme) => theme.id === parseInt(id));
        entity ? res.sendStatus(204) : res.sendStatus(404);
    } catch {
        res.status(400).send('Delete failed. Please try again.');
    }
});

app.delete('/api/themes/:themeId/posts/:postId', (req, res) => {
    try {
        const id = req.params.postId;
        const entity = posts.find((post) => post.id === id);
        entity ? res.sendStatus(204) : res.sendStatus(404);
    } catch {
        res.status(400).send('Delete failed. Please try again.');
    };
});

app.delete('/api/themes/:themeId/posts/:postId/comments/:commentId', (req, res) => {
    try {
        const id = req.params.commentId;
        const entity = comments.find((comment) => comment.id === id);
        entity ? res.sendStatus(204) : res.sendStatus(404);
    } catch {
        res.status(400).send('Delete failed. Please try again.');
    };
});

// SET SERVER TO LISTEN TO PORT 3000
app.listen(port, ()=> console.log(`Server listening at port ${port}`));