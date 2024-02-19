const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mainRoute = require('./routes/route');
const con = require("./db/connection"); 
const app = express();
app.use(express.json());
app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use('/static', express.static('public'))
app.use('/', mainRoute);

app.listen(process.env.PORT |5000, ()=> {
    console.log("Server is running on 5000");
});