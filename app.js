const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express ();


app.use(express.json());
app.use(express.static(path.join(__dirname, 'FrontEnd')));


// functions and implementations for reading and writing JSON data adapted from https://heynode.com/tutorial/readwrite-json-files-nodejs/

function readData(path, callback) {
    fs.readFile(path, (err, data) => {
        if (err) {
            return callback && callback(err);
        }
        try{
            const item = JSON.parse(data);
            return callback && callback(null, item);
        }
        catch (err) {
            return callback && callback(err);
        }
    });
};

// Handle the get request that lists all artists
app.get('/artists', (req, res) => {
    res.setHeader("Content-Type", "application/json");
    readData(path.join(__dirname, 'Data/data_artists.json'), (err, artists) => {
        if (err) {
            res.status(500).send("Error: " + err);
            return;
        }
        let data = []
        for (const artist of artists) {
            data.push({"name": artist.name, "ID": artist.id, "genre": artist.genre, "networth": artist.networth, "image": artist.imagesource})
        }
        res.status(200).send(data);
    });
});

// Handle the get request for all details of an artist of a given id
app.get('/artists/:id', (req, res) => {
    res.setHeader("Content-Type", "application/json");
    let id = Number(req.params.id)
    readData(path.join(__dirname, 'Data/data_artists.json'), (err, artist) => {
        if (err) {
            res.status(500).send({message: "Error: " + err});
            return;
        }
        if (!artist[id]) {
            res.status(400).send({message: "Error: Bad request, no item found with given ID."})
        }
        res.status(200).send(artist[id]);
    });
});

// Handle the post request for uploading a new artist
app.post('/artists/', (req, res) => {

    res.setHeader("Content-Type", "application/json");
    let content = req.body;

    // Method for writing data to json file adapted from https://stackoverflow.com/questions/36856232/write-add-data-in-json-file-using-node-js
    readData(path.join(__dirname, 'Data/data_artists.json'), (err, artists) => {
        if (err) {
            res.status(500).send({message: "Error: " + err});
            return;
        }
        let networthtemp = Number(content.networth);
        if (content.name && content.song && content.genre && content.description && networthtemp && networthtemp !== 'null' && networthtemp !== 'undefined') {
            artists.push({
                "id": artists.length,
                "name": content.name,
                "song": content.song,
                "networth": networthtemp,
                "genre": content.genre,
                "description": content.description,
                "imagesource": "Media/empty.jpg",
                "imageattr": ""
            })
            writeOutput = JSON.stringify(artists);
            fs.writeFile(path.join(__dirname, 'Data/data_artists.json'), writeOutput, 'utf-8', function(err) {
                if (err) {
                    res.status(500).send( {message: "Error: Internal Server Error"})
                }
                res.status(201).send({message: "Submission Successful!", name: content.name});
            })
        }

        else {
            res.status(400).send( {message: "Error: Bad Request, incomplete/improper parameters."});
        }
    });
});

// Handle the get request for listing all comments
app.get('/comments', (req, res) => {
    res.setHeader("Content-Type", "application/json");
    readData(path.join(__dirname, 'Data/data_comments.json'), (err, comments) => {
        if (err) {
            res.status(500).send("Error: " + err);
            return;
        }
        let data = []
        for (const comment of comments) {
            data.push({"for": comment.for, "ID": comment.id})
        }
        res.status(200).send(data);
    });
});

// Handle the get request for all details of a comment from a given ID
app.get('/comments/:id', (req, res) => {
    res.setHeader("Content-Type", "application/json");
    let id = Number(req.params.id)
    readData(path.join(__dirname, 'Data/data_comments.json'), (err, comment) => {
        if (err) {
            res.status(500).send({message: "Error: " + err});
            return;
        }
        if (!comment[id]) {
            res.status(400).send({message: "Error: Bad request, no item found with given ID."})
        }
        res.status(200).send(comment[id]);
    });
});


// Handle the post request that uploads a new comment
app.post('/comments/', (req, res) => {
    res.setHeader("Content-Type", "application/json");
    let content = req.body;

    // Method for writing data to json file adapted from https://stackoverflow.com/questions/36856232/write-add-data-in-json-file-using-node-js
    readData(path.join(__dirname, 'Data/data_comments.json'), (err, comments) => {
        if (err) {
            res.status(500).send({message: "Error: " + err});
            return;
        }

        if (!content.content || !content.for) {
            res.status(400).send({ message: 'Error: Bad request, incomplete/missing request parameters.' });
            return;
        }

        else {
            if (content.author == "") {
                content.author = "Anonymous";
            }
            comments.push({
                        "id": comments.length,
                        "for": content.for,
                        "author": content.author,
                        "content": content.content
                    })
            writeOutput = JSON.stringify(comments);
            fs.writeFile(path.join(__dirname, 'Data/data_comments.json'), writeOutput, 'utf-8', function(err) {
                if (err) {
                    req.status(500).send( {message: "Error: Internal Server Error"})
                }
                res.status(201).send({message: "Comment submitted!", author: content.author, content: content.content});
            })
        }
    });
});

// For all other routes, return a 404 error
app.all('*', (req, res) => {
    res.status(404);
    res.send('<h1>Error 404: Page not found</h1>');
})


module.exports = app;