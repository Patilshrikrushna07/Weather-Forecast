// Util dependencies
const geocode = require('./utils/geocode.js');
const forecast = require('./utils/forecast.js');


// GLobal dependencies
const path = require('path');
const express = require('express');
var bodyParser = require('body-parser');


// Setting the port for server
const port = 3000;


// Setting up the server
const app = express();
app.use(bodyParser.json());
const slashes = require("connect-slashes");
app.listen(port, ()=>{
    console.log("Server is up and running on port "+port);
})

// Reference for static .html file in folder
app.use(express.static(path.join(__dirname,'public/'))).use(slashes(false));



// Respond json containing all data
app.get('/responses/weatherData',(req, res)=>{
    let address = req.query.search;

    // If search has multiple arguments, take the first one
    if(Array.isArray(address))
        address = address[0];

    if(address === '')
        res.send({"error":"Empty String"});
    else
        geocode(address, (error, data)=>{
            if(error)
                res.send({"error":error});
            else
                forecast(data, (error, weather)=>{
                    if(error)
                        res.send({"error":error});
                    else
                        res.send(weather);
                });
        });
});



// 404 page
app.get('*', (req, res)=>{
    res.send('Page not found 404 :(');
})
