const baseurl = `https://api.openweathermap.org/data/2.5`;

let input = document.querySelector("#input");
let search = document.querySelector("#search");


search.addEventListener("click" , () => {
    weather()
});



// wallpaper

function changeWallpaper(condition) {
        let body = document.querySelector("body"); // or your #container

        // condition comes from response.weather[0].main
        // values: "Clear", "Clouds", "Rain", "Thunderstorm", "Snow", "Mist", "Haze", "Drizzle"

        if (condition === "Clear") {
            body.style.backgroundImage = "url('https://images.unsplash.com/photo-1601297183305-6df142704ea2?w=1920')";
        } 
        else if (condition === "Clouds") {
            body.style.backgroundImage = "url('https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1920')";
        } 
        else if (condition === "Rain" || condition === "Drizzle") {
            body.style.backgroundImage = "url('https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=1920')";
        } 
        else if (condition === "Thunderstorm") {
            body.style.backgroundImage = "url('https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=1920')";
        } 
        else if (condition === "Snow") {
            body.style.backgroundImage = "url('https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=1920')";
        } 
        else if (condition === "Mist" || condition === "Haze" || condition === "Fog") {
            body.style.backgroundImage = "url('https://images.unsplash.com/photo-1543968996-ee822b8176ba?w=1920')";
        }
        else {
            body.style.backgroundImage = "url('https://images.unsplash.com/photo-1504608524841-42584120d693?w=1920')";
        }

       // smooth transition
  
       body.style.backgroundPosition = "center";
       body.style.transition = "background-image 1s ease";
};




// ✅ Fix — define outside, call once
let weather = async () =>{
    let val = input.value;
    let location = val || "delhi";
    

    let url = `${baseurl}/weather?q=${location}&appid=f1893e55721d6322261fbe53cf4c0fb7&units=metric`
    let data = await fetch(url);
    let response = await data.json();
    console.log(response);

    let cityName    = response.name;
    let country     = response.sys.country;
    let temp        = Math.round(response.main.temp);
    let feelsLike   = Math.round(response.main.feels_like);
    let humidity    = response.main.humidity;
    let windSpeed   = response.wind.speed;
    let condition   = response.weather[0].description;
    let visibility  = response.visibility;
    let pressure    = response.main.pressure;
    let iconCode    = response.weather[0].icon;
    let iconUrl     = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    // update your elements
    document.querySelector("#adr").innerText = `${cityName}, ${country}`;
    document.querySelector("#temp").innerText = `${temp}`;
    document.querySelector("#pp").innerText = condition;
    document.querySelector("#vi").innerText = `${visibility}`;
    document.querySelector("#pr").innerText = `${pressure}`;
    document.querySelector("#hu").innerText = `${humidity}%`;
    document.querySelector("#wi").innerText = `${windSpeed} km/h`;
    document.querySelector("#feel").innerText = `Feels like ${feelsLike}°C`;
    document.querySelector("#icon").src = iconUrl;
   



    //date wise  
    let forecasturl = `${baseurl}/forecast?q=${location}&appid=f1893e55721d6322261fbe53cf4c0fb7&units=metric`;
    let data2 = await fetch(forecasturl) ;
    let response2 = await data2.json();

    let dailylist = response2.list.filter( item=> 
        item.dt_txt.includes("12:00:00")
    );

    

    console.log(dailylist);

    const daynames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    dailylist.forEach((day,index) =>{
        let date     = new Date(day.dt * 1000);
        let fdate    = date.toLocaleDateString();
        let name     = daynames[date.getDay()];
        let temp     = Math.round(day.main.temp);
        let minTemp  = Math.round(day.main.temp_min);
        let icon     = day.weather[0].icon ; 
        let iconUrl  = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        let desc     = day.weather[0].description;

        let card = document.querySelector(`#day${index}`);
    
        card.querySelector("#name").innerText = name;
        card.querySelector("#tt").innerText = `${temp}°C`;
        card.querySelector("#ii").innerHTML = `<img src="${iconUrl}"/>`;
        card.querySelector("#dd").innerText = fdate
    
    });



    //hour wise

    let hourlist = response2.list.slice(0, 8);
    console.log(hourlist);

    hourlist.forEach((hour,index) => {
        let date    = new Date(hour.dt*1000);
        let hh      = date.getHours();
        let ampm     = hh >= 12 ? "PM" : "AM";
        let hour12   = hh % 12 || 12;
        let timeStr  = `${hour12}:00 ${ampm}`;
        let temp     = Math.round(hour.main.temp);
        let icon     = hour.weather[0].icon;
        let iconUrl  = `https://openweathermap.org/img/wn/${icon}.png`;

        let cd = document.querySelector(`#hour${index}`);
    
        cd.querySelector(".time").innerText = timeStr;
        cd.querySelector(".tmt").innerText = `${temp}°C`;
        cd.querySelector(".in").innerHTML = `<img src="${iconUrl}"/>`;
    
    }); 
        
     //wallpaper call   
    let mainCond = response.weather[0].main;
    changeWallpaper(mainCond);   
    
   
}; 


input.addEventListener("input", async () => {
  let val = input.value;
  
  // only search after 2 letters
  if(val.length < 2) {
    document.querySelector("#suggestions").innerHTML = "";
    return;
  }

  // OpenWeatherMap geocoding API
  let geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${val}&limit=5&appid=f1893e55721d6322261fbe53cf4c0fb7`;
  let res    = await fetch(geoUrl);
  let cities = await res.json();

  // show suggestions
  let box = document.querySelector("#suggestions");
  box.innerHTML = "";

  cities.forEach(city => {
    let item = document.createElement("div");
    item.className   = "suggest-item";
    item.innerText   = `${city.name}, ${city.state || ""}, ${city.country}`;
    
    // click to select
    item.addEventListener("click", () => {
      input.value = city.name;
      box.innerHTML = ""; // hide suggestions
      weather();           // fetch weather
    });

    box.appendChild(item);
  });
});

// hide suggestions when clicking outside
document.addEventListener("click", (e) => {
  if(e.target !== input) {
    document.querySelector("#suggestions").innerHTML = "";
  }
});









weather();
