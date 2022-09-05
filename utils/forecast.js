const request = require('request');
const forecast = ({ latitude, longitude, location }, callback) =>{
    // let url = "https://api.openweathermap.org/data/2.5/onecall?lat=19.191384&lon=72.862827&exclude={part}&appid=d1b4207b08b14cc80a44430bfe6598d0";    // Hard coded for malad

    let url = "https://api.openweathermap.org/data/2.5/onecall?lat="+latitude+"&lon="+longitude+"&exclude={part}&appid=d1b4207b08b14cc80a44430bfe6598d0";
    // for forecast data we use openweathermap  this apk provide latitude and loongitude also , this webapplication show wether city wises 
    // user can find their city and this is provide wether for this location....
    request({url, proxy: '', json: true}, (error, response)=>{
        if(error)
            callback("Unable to connect to url !");
        else if(response.body.error)
            callback("Unable to fetch weather details !");
        else
            callback(undefined, {
                location, latitude, longitude,
                timezone: response.body.timezone,
                timezone_offset: response.body.timezone_offset,
                current: response.body.current,
                minutely: response.body.minutely,
                hourly: response.body.hourly,
                daily: response.body.daily
            });
    });

};

module.exports = forecast;