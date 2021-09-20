import express from 'express';

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
app.get('/themes', (req, res) => {
    try{
        res.json(themes);
    } catch {
        res.status(404).send('Get failed. Please try again.');
    };
});

app.get('/themes/:id/posts', (req, res) => {
    try {
        res.json(posts);
    } catch {
        res.status(404).send('Get failed. Please try again.');
    };
});

app.get('/themes/:id/posts/:id/comments', (req, res) => {
    try {
        res.json(comments);
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
app.get('/themes/:id', (req, res) => {
    try {
        const id = req.params.id;
        const theme = themes.filter((theme) => theme.id === parseInt(id));
        res.send(theme);
    } catch {
        res.status(404).send('Get failed. Please try again.');
    };
});

app.get('/themes/:id/posts/:id', (req, res) => {
    try {
        const id = req.params.id;
        const post = posts.filter((post) => post.id === id);
        res.status(200).send({post});
    } catch {
        res.status(404).send('Get failed. Please try again.');
    };
});

app.get('/themes/:id/posts/:id/comments/:id', (req, res) => {
    try {
        const id = req.params.id;
        const comment = comments.filter((comment) => comment.id === id);
        res.status(200).send(comment);
    } catch {
        res.status(404).send('Get failed. Please try again.');
    };
});

// POST
app.post('/themes', (req, res) => {
    try {
        const reqBody = req.body;
        themes.push(reqBody);
        res.status(200).send(`Post successful: \n ${themes}`);
    } catch {
        res.status(404).send('Post failed. Please try again.');
    };
});

app.post('/themes/posts', (req, res) => {
    try {
        const reqBody = req.body;
        posts.push(reqBody);
        res.status(200).send(`Post successful: \n ${posts.filter((post) => post === reqBody)
            .map((post) =>
            'ID: ' +  post.id + ';\nText: ' + post.text + ';\nName: ' + post.user)}`);
    } catch {
        res.status(404).send('Post failed. Please try again.');
    };
});

app.post('themes/posts/comments', (req, res) => {
    try {
        const reqBody = req.body;
        comments.push(reqBody);
        res.status(200).send(`Post successful \n ${comments}`);
    } catch {
        res.status(404).send('Post failed. Please try again.');
    };
});

// PUT
app.put('/themes/:id', (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const index = themes.findIndex((theme) => theme.id === parseInt(id));
        //themes[themeIndex] = data;
        if (themes[index] !== undefined) {
            themes[index] = data;
            res.status(200).send(themes[index]);
        } else {
            themes.push(data);
            res.status(201).send(themes[themes.length - 1]);
        };
    } catch {
        res.status(400).send('Put failed. Please try again.');
    };
});

app.put('/themes/posts/:id', (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const index = posts.findIndex((post) => post.id === id);
        if (posts[index] !== undefined) {
            posts[index] = data;
            res.status(200).send(posts[index]);
        } else {
            posts.push(data);
            res.status(201).send(posts[posts.length - 1]);
        }
    } catch {
        res.status(400).send('Put failed. Please try again.');
    };
});

app.put('/themes/posts/comments/:id', (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const index = comments.findIndex((comment) => comment.id === id);
        if (comments[index] !== undefined) {
            comments[index] = data;
            res.status(200).send(comments[index]);
        } else {
            comments.push(data);
            res.status(201).send(comments[comments.length - 1]);
        }
    } catch {
        res.status(400).send('Put failed. Please try again.');
    };
});

// DELETE
app.delete('/themes/:id', (req, res) => {
    try{
        const id = req.params.id;
        const entity = themes.find((theme) => theme.id === parseInt(id));
        res.status(200).send(`Deleted entity: \n ${JSON.stringify(entity)}`);
    } catch {
        res.status(404).send('Delete failed. Please try again.');
    }
});

app.delete('/themes/posts/:id', (req, res) => {
    try {
        const id = req.params.id;
        const entity = posts.find((post) => post.id === id);
        res.status(200).send(`Deleted entity: \n ${JSON.stringify(entity)}`);
    } catch {
        res.status(404).send('Delete failed. Please try again.');
    };
});

app.delete('themes/posts/comments/:id', (req, res) => {
    try {
        const id = req.params.id;
        const entity = comments.find((comment) => comment.id === id);
        res.status(200).send(`Deleted entity: \n ${entity}`);
    } catch {
        res.status(404).send('Delete failed. Please try again.');
    };
});

// SET SERVER TO LISTEN TO PORT 3000
app.listen(port, ()=> console.log(`Server listening at port ${port}`));