const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");

admin.initializeApp(); 
const app = express(); 
const LookNLearn = express.Router();

app.use(express.json()); 
app.use("/api", LookNLearn); 

exports.LookNLearnAPI = functions.region("asia-northeast3").https.onRequest(app);