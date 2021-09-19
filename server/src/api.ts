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
        text: "Is gae"
    }
];

// GET LISTED
app.get('/themes', (req, res) => {
    res.json(themes);
});

app.get('/themes/posts', (req, res) => {
    res.json(posts);
});


// GET BY ID
app.get('/themes/:id', (req, res) => {
    const id = req.params.id;
    const theme = themes.filter((theme) => theme.id === parseInt(id));
    res.send(theme);
});

app.get('/themes/posts/:id', (req, res) => {
    const id = req.params.id;
    const post = posts.filter((post) => post.id === id);
    res.status(200).send(post);
});

// POST
app.post('/themes', (req, res) => {
    const reqBody = req.body;
    themes.push(reqBody);
    res.status(200).send(`Post successful: \n ${themes}`);
});

app.post('/themes/posts', (req, res) => {
    const reqBody = req.body;
    posts.push(reqBody);
    res.status(200).send(`Post successful: \n ${posts}`);
});

// PUT
app.put('/themes', (req, res) => {
    
});

// DELETE
app.delete('/themes/:id', (req, res) => {
    const id = req.params.id;
    const filtered = themes.filter((theme) => theme.id !== parseInt(id));
    res.status(200).send(`Data without deleted: \n ${filtered}`);
});

app.delete('/themes/posts/:id', (req, res) => {
    const id = req.params.id;
    const filtered = posts.filter((post) => post.id !== id);
    res.status(200).send(`Data without deleted: \n ${filtered}`);
});



// SET SERVER TO LISTEN TO PORT 3000
app.listen(port, ()=> console.log(`Server listening at port ${port}`));