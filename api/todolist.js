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
        newnote.save(function (err) {
            if (err) {
                handleError(res, err);
            }
            res.send("Successfully added note!");
        })
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
                    handleError(res, err);
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
                handleError(res, err);
            }
            res.send("Successfully deleted note!");
        })
    });
};