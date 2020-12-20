const express = require('express');
const bodyParser = require('body-parser');
const Leaders = require('../models/leaders');
const leaderRouter = express.Router();
var authenticate = require('../authenticate');

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.get((req,res,next) => {
    Leaders.find({})
    .then((leaders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    const isAdmin= authenticate.verifyAdmin(req.user);
    if(isAdmin){
        Leaders.create(req.body)
        .then((leader) => {
            console.log('Leader Created ', leader);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader);
        }, (err) => next(err))
        .catch((err) => next(err));
    }else{
        var err = new Error('You are not authorized to perform this operation!');
        err.status = 403;
        next(err);
    }
})
.put(authenticate.verifyUser, (req, res, next) => {
    const isAdmin= authenticate.verifyAdmin(req.user);
    if(isAdmin){
        res.statusCode = 403;
        res.end('PUT operation not supported on /leaders');
    }else{
        var err = new Error('You are not authorized to perform this operation!');
        err.status = 403;
        next(err);
    }
})
.delete(authenticate.verifyUser, (req, res, next) => {
    const isAdmin= authenticate.verifyAdmin(req.user);
    if(isAdmin){
        Leaders.remove({})
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
    }else{
        var err = new Error('You are not authorized to perform this operation!');
        err.status = 403;
        next(err);
    }
});

leaderRouter.route('/:leaderId')
.get((req,res,next) => {
    Leaders.findById(req.params.leaderId)
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    const isAdmin= authenticate.verifyAdmin(req.user);
    if(isAdmin){
        res.statusCode = 403;
        res.end('POST operation not supported on /leaders/'+ req.params.leaderId);
    }else{
        var err = new Error('You are not authorized to perform this operation!');
        err.status = 403;
        next(err);
    }
})
.put(authenticate.verifyUser, (req, res, next) => {
    const isAdmin= authenticate.verifyAdmin(req.user);
    if(isAdmin){
        Leaders.findByIdAndUpdate(req.params.leaderId, {
            $set: req.body
        }, { new: true })
        .then((leader) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader);
        }, (err) => next(err))
        .catch((err) => next(err));
    }else{
        var err = new Error('You are not authorized to perform this operation!');
        err.status = 403;
        next(err);
    }
})
.delete(authenticate.verifyUser, (req, res, next) => {
    const isAdmin= authenticate.verifyAdmin(req.user);
    if(isAdmin){
        Leaders.findByIdAndRemove(req.params.leaderId)
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
    }else{
        var err = new Error('You are not authorized to perform this operation!');
        err.status = 403;
        next(err);
    }
});

module.exports = leaderRouter;