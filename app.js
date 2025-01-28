const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express ();


app.use(express.json());
app.use(express.static(path.join(__dirname, 'FrontEnd')));
const PORT = 8080;


// functions for reading and writing JSON data adapted from https://heynode.com/tutorial/readwrite-json-files-nodejs/

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

// readData(path.join(__dirname, 'Data/data_artists.json'), (err, artist) => {
//     if (err) {
//         console.log(err);
//         return;
//     }
//     console.log(artist[0].name);
// });


app.get('/artists', (req, res) => {
    // return all items in json file sorted by id. this is used to load all cards when booting up the app. cards only include name and image.
    readData(path.join(__dirname, 'Data/data_artists.json'), (err, artists) => {
        if (err) {
            res.status(500).send("Error: " + err);
            return;
        }
        let data = []
        for (const artist of artists) {
            data.push({"name": artist.name, "ID": artist.id})
        }
        res.status(200).send(data);
    });
});

app.get('/artists/:id', (req, res) => {
    let id = Number(req.params.id)
    readData(path.join(__dirname, 'Data/data_artists.json'), (err, artist) => {
        if (err) {
            res.status(500).send("Error: " + err);
            return;
        }
        if (!artist[id]) {
            res.status(400).send("Error, no item found with given ID.")
        }
        res.status(200).send(artist[id]);
    });
});

app.post('/artists/:id', (req, res) => {

    let id = req.params;
    let name = req.body;

    if (!name) {
        res.status(418).send({ message: 'No name provided.' })
    }

    res.send({
        artist: name,
        id: id
    })

});


app.get('/comments', (req, res) => {
    // return all items in json file sorted by id. this is used to load all cards when booting up the app. cards only include name and image.
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

app.get('/comments/:id', (req, res) => {
    let id = Number(req.params.id)
    readData(path.join(__dirname, 'Data/data_comments.json'), (err, comment) => {
        if (err) {
            res.status(500).send("Error: " + err);
            return;
        }
        if (!comment[id]) {
            res.status(400).send("Error, no item found with given ID.")
        }
        res.status(200).send(comment[id]);
    });
});

app.post('/comments/:id', (req, res) => {

    let id = req.params;
    let name = req.body;

    if (!name) {
        res.status(418).send({ message: 'No name provided.' })
    }

    res.send({
        artist: name,
        id: id
    })

});


app.all('*', (req, res) => {
    res.status(404);
    res.send('<h1>Error 404: Page not found</h1>');
})


app.listen(PORT);
console.log("App running on: http://127.0.0.1:" + PORT)