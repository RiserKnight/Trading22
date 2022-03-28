
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const dbFunct = require(__dirname+"/database.js");
const date = require(__dirname+"/date.js")

const app = express();
app.use(express.static(__dirname+"/public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/",(req,res)=>{
  console.log(date.getDate());
  res.sendFile(__dirname+"/views/index.html");
});
app.get('/users',async(req,res)=>{
  console.log(await dbFunct.storeUser(201,"Admin",100));
  res.send("Ja ");
});

app.listen(3000, ()=> {
    console.log("Server started on port 3000.");
  });
  