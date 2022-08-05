const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const path = require('path');
const app = express();

const blogsRoute = require("../routes/blog")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use("/images", express.static(path.join("app/images")));

mongoose.connect("mongodb://localhost/blogdb")
    .then(() => {
        console.log('Connected to database successfully!');
    })
    .catch(() => {
        console.log('Connection failed!');
    })

app.use("/api/blogs",blogsRoute);

module.exports = app;