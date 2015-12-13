//To-Do List API
var notes = require('../models/notes');
var mongoose = require('mongoose');
var Note = mongoose.model('Notes');

module.exports = function (app, passport) {

    //Handle note addition

    app.post('/todo/:value', function (req, res) {
        var newnote = new Note({
            note: req.params.value
        });

        Note.findOne({
            note: req.params.value
        }, function (err, note) {
            if (err) {
                res.status(500);
                res.send(err);
            }

            if (note) {
                res.status(500);
                res.send('Oh no! This note already exists.');
            } else {
                newnote.save(function (err) {
                    if (err) {
                        res.status(500);
                        res.send(err);
                    } else {
                        res.send("Successfully added note!");

                    }
                });
            }
        });
    });

    //Handle note editing

    app.put('/todo/:value/:newvalue', function (req, res) {
        Note.update({
                note: req.params.value
            }, {
                $set: {
                    note: req.params.newvalue
                }
            },
            function (err, note) {
                if (err) {
                    res.status(500);
                    res.send(err);
                }
                res.send("Successfully edited note!");
            })
    });

    //Handle note deletion

    app.delete('/todo/:value', function (req, res) {
        Note.remove({
            note: req.params.value
        }, function (err) {
            if (err) {
                res.status(500);
                res.send(err);
            }
            res.send("Successfully deleted note!");
        })
    });

    //Handle full deletion

    app.delete('/clear', function (req, res) {
        Note.remove({}, function (err) {
            if (err) {
                res.status(500);
                res.send(err);
            }
            res.send("Successfully deleted all notes!");
        })
    });
};