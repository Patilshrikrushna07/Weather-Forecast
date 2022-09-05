
document.getElementById('weatherExhibition').style.visibility = 'hidden';

$("#search").keyup(function(event) {
    if (event.keyCode === 13) {
        $("#searchBtn").click();
    }
});

// Utility objects
let dayStrings = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
let monthStrings = ['January','February','March','April','May','June','July','August','September','October','November','December'];
let iconURL = 'http://openweathermap.org/img/wn/';
let localIconURL = '/images/weather/'


// Utility functions
function prependZero(number) { 
    if (number <= 9) 
        return "0" + number; 
    else 
        return number; 
} 
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
function getDateString(date, dateOffset){
    let currDate = new Date((date+dateOffset)*1000);
    let str = currDate.toUTCString();
    return str.substring(0,16) + ' ' + getOnlyTimeFromUTC(date, dateOffset);
}
function getOnlyTimeFromUTC(date, dateOffset){
    let dt = new Date((date+dateOffset)*1000);
    let hours = dt.getUTCHours();
    let amOrPm = (hours/12 >= 1) ? ' pm' : ' am';
    hours = hours%12 == 0 ? 12 : hours%12;
    return hours +':'+prependZero(dt.getUTCMinutes())+ amOrPm;
}
function getOnlyHourFromUTC(date, dateOffset){
    let dt = new Date((date+dateOffset)*1000);
    let hours = dt.getUTCHours();
    let amOrPm = (hours/12 >= 1) ? ' pm' : ' am';
    hours = hours%12 == 0 ? 12 : hours%12;
    return prependZero(hours)+ amOrPm;
}
function getIconStr(iconStr){ 
    return localIconURL + iconStr + '.png';
}
function prepareDailyData(dailyArr, dateOffset){
    let daysObj = document.getElementsByClassName('eachDay');
    let day;
    for(let i=0; i<dailyArr.length; i++){
        day = daysObj[i].children;
        eachD = dailyArr[i];

        day[0].innerHTML = getDateString(eachD.dt, dateOffset).substring(0,11);
        day[1].children[0].children[0].src = getIconStr(eachD.weather[0].icon);
        day[1].children[1].innerHTML = Math.round(eachD.temp.min - 273.15);
        day[1].children[3].innerHTML = Math.round(eachD.temp.max - 273.15);
        day[2].children[0].innerHTML = eachD.weather[0].description;
    }
}
let hourlyArray = [2,3,5,7,9,13,19];
function prepareHourlyData(hourlyArr, dateOffset){
    let hoursObj = document.getElementsByClassName('eachHour');
    let hour;
    for(let i=0; i<hourlyArray.length; i++){
        hour = hoursObj[i].children;
        eachD = hourlyArr[hourlyArray[i]];
        
        hour[0].innerHTML = getOnlyHourFromUTC(eachD.dt, dateOffset);
        hour[1].children[0].children[0].src = getIconStr(eachD.weather[0].icon);
        hour[1].children[1].innerHTML = (eachD.temp - 273.15).toFixed(2);
        hour[2].children[0].innerHTML = eachD.weather[0].description;
    }
}



// Major function
function getDetails(){
    let address = document.getElementById('search').value;

    address = address.trim().replace(/\s+/g, " ").replace(/ /g, "%20");

    if(address == ''){
        document.getElementById('weatherExhibition').style.visibility = 'hidden';
        alert('Empty search !');
        return;
    }
    document.getElementById('weatherExhibition').style.visibility = 'hidden';
    document.getElementById('loaderWrapper').style.display = 'block';

    // console.log(address);
    fetch('/responses/weatherData?search='+address).then((response)=>{
            response.json().then((data)=>{
                if(!data.current){
                    alert(data.error);
                    document.getElementById('loaderWrapper').style.display = 'none';
                    return;
                }
            // console.log(data); 
            let dateOffset = data.timezone_offset;

            let curr = data.current;
            let today = data.daily[0];
            // alert(currDate);
            // console.log(currDate);
            document.getElementById('currentWindSpeed').innerHTML = (curr.wind_speed);
            document.getElementById('currentHumidity').innerHTML = curr.humidity;
            if(curr.visibility >= 1000){
                document.getElementById('currentVisibility').innerHTML = (curr.visibility/1000).toFixed(1);
                document.getElementById('visibilityUnit').innerHTML = 'km';
            }else{
                document.getElementById('currentVisibility').innerHTML = curr.visibility;
                document.getElementById('visibilityUnit').innerHTML = 'm';
            }
            document.getElementById('currentUVI').innerHTML = (curr.uvi).toFixed(2);
        
            document.getElementById('place').innerHTML = data.location;
            document.getElementById('lat').innerHTML = (data.latitude).toFixed(5);
            document.getElementById('long').innerHTML = (data.longitude).toFixed(5);
            document.getElementById('currTimeDate').innerHTML = getDateString(curr.dt, dateOffset);

            document.getElementById('represent').src = getIconStr(curr.weather[0].icon);
            document.getElementById('currentTemp').innerHTML = (curr.temp-273.15).toFixed(2);
            document.getElementById('currentRemark').innerHTML = (curr.weather[0].description).capitalize();

            document.getElementById('currentLow').innerHTML = (today.temp.min-273.15).toFixed(2);
            document.getElementById('feelsLike').innerHTML = (curr.feels_like-273.15).toFixed(2);
            document.getElementById('currentHigh').innerHTML =  (today.temp.max-273.15).toFixed(2);

            document.getElementById('currentSunrise').innerHTML = getOnlyTimeFromUTC(curr.sunrise, dateOffset);
            document.getElementById('currentDewPoint').innerHTML = (curr.dew_point-273.15).toFixed(2);
            document.getElementById('clouds').innerHTML = curr.clouds;
            document.getElementById('currentSunset').innerHTML = getOnlyTimeFromUTC(curr.sunset, dateOffset);
            

            // Daily data
            prepareDailyData(data.daily, dateOffset);


            // Hourly Data
            prepareHourlyData(data.hourly, dateOffset);



            document.getElementById('loaderWrapper').style.display = 'none';
            document.getElementById('weatherExhibition').style.visibility = 'visible';
        });
    });
}