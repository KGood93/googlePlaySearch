const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('common'));

const play = require('./play-data.js');

app.get('/apps', (req, res) => {
    const {search="", sort} = req.query;

    if(sort) {
        if(!['App', 'Rating'].includes(sort)) {
            return res
                .status(400)
                .send('Sort must be one of App Title or Rating.')
        }
    }

    let results = play
        .filter(game =>
            game
                .App
                .toLowerCase()
                .includes(search.toLowerCase()));
    
    if(sort) {
        results
            .sort((a, b) => {
                return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
        });
    }
    res
        .json(results);
});

app.listen(8000, () => {
    console.log('Server started on PORT 8000');
});