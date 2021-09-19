import express from 'express';

//IMPORTTANT: THIS MIGHT BREAK SINCE IT CAN NO LONGER FIND THE IMPORT
//IN THAT CASE CHANGE IMPORT TO REQUIRE 
const app = express();
const port = 3000;

const themes = {
    science: {
        id: 1,
        title: "Science",
        activeDiscusions: 10
    },
    memes: {
        id: 2,
        title: "Memes",
        activeDiscusions: 2
    },
    sports: {
        id: 3,
        title: "Sports",
        activeDiscusions: 5
    }
};

//GET
app.get('/themes', (req, res) => {
    res.json(themes);
});

//POST



//SET SERVER TO LISTEN TO PORT 3000
app.listen(port, ()=> console.log(`Server listening at port ${port}`));