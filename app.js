const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

require('dotenv').config({path : 'vars/.env'});
const MAPI_KEY = process.env.API_KEY;
const MLIST_ID = process.env.LIST_ID;
const MAPI_SERVER = process.env.API_SERVER;

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const fName = req.body.fName;
    const lName = req.body.lName;
    const email = req.body.email;
    const data = {
        members : [
            {
                email_address : email,
                status : "subscribed",
                merge_fields : {
                    FNAME : fName,
                    LNAME : lName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    const url = "https://" + MAPI_SERVER + ".api.mailchimp.com/3.0/lists/" + MLIST_ID;
    const options = {
        method : "POST",
        auth : "abhishek:" + MAPI_KEY
    };
    const request = https.request(url, options, function(response){
        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
        console.log(response.statusCode);
        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
    });
    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server started successfully on port 3000.");
});