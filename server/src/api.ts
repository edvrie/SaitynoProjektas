import e from 'express';
import express from 'express';

// IMPORTTANT: THIS MIGHT BREAK SINCE IT CAN NO LONGER FIND THE IMPORT
// IN THAT CASE CHANGE IMPORT TO REQUIRE 
const app = express();
const port = 3000;

// JSON parse
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

app.use((err, req, res, next) => {
    res.status(400).send({
        status: 400,
        error: "Bad request"
    });
});

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

// DEFAULT 
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
app.post('/api/themes', (req, res) => {
    try {
        const reqBody = req.body;
        themes.push(reqBody);
        res.status(201).send({...reqBody, "status": "ok"})
    } catch {
        res.status(400).send({
            status: 400,
            error: "Invalid URL"
        });
    };
});

app.post('/api/themes/:id/posts', (req, res) => {
    try {
        parseIds(req.params.id);
        const reqBody = req.body;
        posts.push(reqBody);
        res.status(201).send({...reqBody, "status": "ok"})
    } catch {
        res.status(400).send({
            status: 400,
            error: "Invalid URL"
        });
    };
});

app.post('/api/themes/:themeId/posts/:postId/comments', (req, res) => {
    try {
        parseIds(req.params.themeId);
        parseIds(req.params.postId);
        const reqBody = req.body;
        comments.push(reqBody);
        res.status(201).send({...reqBody, "status": "ok"})
    } catch {
        res.status(400).send({
            status: 400,
            error: "Invalid URL"
        });
    };
});

// PUT
app.patch('/api/themes/:id', (req, res) => {
    try {
        parseIds(req.params.id);
        const id = req.params.id;
        const data = req.body;
        const index = themes.findIndex((theme) => theme.id === parseInt(id));
        if (themes[index] !== undefined) {
            themes[index] = data;
            res.status(200).send(themes[index]);
        } else {
            res.status(404).send({
                status: 404,
                error: 'Not found.'
            });
        };
    } catch {
        res.status(400).send({
            status: 400,
            error: "Invalid URL"
        });
    };
});

app.patch('/api/themes/:themeId/posts/:postId', (req, res) => {
    try {
        parseIds(req.params.themeId);
        parseIds(req.params.postId);
        const id = req.params.postId;
        const data = req.body;
        const index = posts.findIndex((post) => post.id === id);
        if (posts[index] !== undefined) {
            posts[index] = data;
            res.status(200).send(posts[index]);
        } else {
            res.status(404).send({
                status: 404,
                error: 'Not found.'
            });
        }
    } catch {
        res.status(400).send({
            status: 400,
            error: "Invalid URL"
        });
    };
});

app.patch('/api/themes/:themeId/posts/:postId/comments/:commentId', (req, res) => {
    try {
        parseIds(req.params.themeId);
        parseIds(req.params.postId);
        parseIds(req.params.commentId);
        const id = req.params.commentId;
        const data = req.body;
        const index = comments.findIndex((comment) => comment.id === id);
        if (comments[index] !== undefined) {
            comments[index] = data;
            res.status(200).send(comments[index]);
        } else {
            res.status(404).send({
                status: 404,
                error: 'Not found.'
            });
        }
    } catch {
        res.status(400).send({
            status: 400,
            error: "Invalid URL"
        });
    };
});

// DELETE
app.delete('/api/themes/:id', (req, res) => {
    try{
        parseIds(req.params.id);
        const id = req.params.id;
        const entity = themes.find((theme) => theme.id === parseInt(id));
        entity ? res.sendStatus(204) : res.status(404).send({
            status: 404,
            error: "Not found"
        });
    } catch {
        res.status(400).send({
            status: 400,
            error: "Invalid URL"
        });
    }
});

app.delete('/api/themes/:themeId/posts/:postId', (req, res) => {
    try {
        parseIds(req.params.themeId);
        parseIds(req.params.postId);
        const id = req.params.postId;
        const entity = posts.find((post) => post.id === id);
        entity ? res.sendStatus(204) : res.status(404).send({
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

app.delete('/api/themes/:themeId/posts/:postId/comments/:commentId', (req, res) => {
    try {
        parseIds(req.params.themeId);
        parseIds(req.params.postId);
        parseIds(req.params.commentId);
        const id = req.params.commentId;
        const entity = comments.find((comment) => comment.id === id);
        entity ? res.sendStatus(204) : res.status(404).send({
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

app.use((req, res, next) => {
    res.status(404).send({
        status: 404,
        error: "Page not found"
    });
});

// SET SERVER TO LISTEN TO PORT 3000
app.listen(port, ()=> console.log(`Server listening at port ${port}`));