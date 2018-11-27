const _ = require('lodash');
const config = require('./config');
const lang = require('./lang');
const express = require('express');
const app = express();
const db = require('./db');
const fs = require("fs");


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

db.c.connect((connection)=>{
    db.c=connection;
    start();
});

function start(){

}

var port = process.env.PORT || 3000;
app.listen(port,()=>{console.log('listening...')});
app.get('/',(req,res)=>{
  userInput(req.query,res);
});
app.get('/user/:userid',(req,res)=>{
  o={};
  db.users.Table.get(db.c,req.params.userid,(r)=>{
    res.send(JSON.stringify(r));
  });
})
app.get('/mylist/:userid',(req,res)=>{
  db.users.Table.getOrderByScore(db.c,req.params.userid,(r)=>{
    console.log(r);
    res.send(JSON.stringify(r))
  })
})
app.use(express.static('public'));

function userInput(input,res){
    o={};
    if(_.isEmpty(input)){

    }
    res.send(JSON.stringify(o));
  }
