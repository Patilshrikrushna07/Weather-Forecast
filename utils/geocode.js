const request = require('request');
const geocode = (address, callback) =>{

    address = address.replace(/ /g, '%20');
    //console.log(address);

    let url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + address + '.json?access_token=pk.eyJ1Ijoib21rYXJwaGFuc29wa2FyIiwiYSI6ImNrZDh3YmtibTBleWgyeXBtdzhpbG4xcXAifQ.G_q_Ssv7mfSEa7QZUkOI0A';
    // console.log(url);
    
    request({url, proxy: '', json: true}, (error, response)=>{
        if(error)
            callback("Unable to connect to url !");
        else if(response.body.features.length == 0)
            callback("Unable to search the location, Try a better search !");
        else 
            callback(undefined, {
                latitude: response.body.features[0].center[1],
                longitude: response.body.features[0].center[0],
                location: response.body.features[0].place_name
            });
    });

}

/*
// Usage for testing
geocode(address, (error, data)=>{
    if(error != undefined){
        console.log('Error',error);
    }else{
        console.log(data);
    }
});
*/


module.exports = geocode;