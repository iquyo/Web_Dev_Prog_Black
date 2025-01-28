const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express ();


app.use(express.json());
app.use(express.static(path.join(__dirname, 'FrontEnd')));
app.use((req, res) => {
    res.status(404);
    res.send('<h1>Error 404: Page not found</h1>');
})
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

readData(path.join(__dirname, 'Data/data.json'), (err, artist) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log(artist.name);
});

const newArtist = {
    "id": 2,
    "name": "Dua Lipa",
    "song": "Levitating",
    "followers": 87000000,
    "description": "Rising star."
}

const newArtistString = JSON.stringify(newArtist)

app.get('/', (req, res) => {
    res.status(200).send("Hello"
        // return all items in json file sorted by id. this is used to load all cards when booting up the app. cards only include name and image.
    )
});

app.get('/:id', (req, res) => {
    res.status(200).send({
        // return details of specified artist
    })
});

app.post('/:id', (req, res) => {

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


app.listen(PORT);