
import express from 'express';
import associateRouter from './src/associateRouter.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import  bodyParser from 'body-parser';
import pg from 'pg';




dotenv.config();
const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));


// parse application/json
app.use(bodyParser.json())

// app.use(express.static('public'));

var conString = "postgres://postgres:1234@localhost:5432/ams";

var client = new pg.Client(conString);
client.connect();

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use('/api', associateRouter);

app.get('/', (req,res) =>{
    res.send('server is ready!');
});

app.use((err, req, res, next)=>{
    res.status(500).send({message:err.message});
})
const port=process.env.PORT || 5000;
app.listen(port, ()=>{
    console.log(`server at http://localhost:${port}`);
});