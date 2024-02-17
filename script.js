const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector("[.weather-container]");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");


//initial variables
let currentTab = userTab;
const API_KEY ="0c78ad71321092c216dc722b6603ba9d";
currentTab.classList.add("current-tab");
getfromSessionStorage();


// Switch Tab ---------------------------------------------------------------------
userTab.addEventListener("click", ()=> {
    switchTab(userTab);
});

searchTab.addEventListener("click", ()=>{
    switchTab(searchTab);
});

function switchTab(newTab){
    if(newTab == currentTab) return;

    currentTab.classList.remove("current-tab");
    currentTab=newTab;
    currentTab.classList.add("current-tab");

    if(!searchForm.classList.contains("active")) {
        //kya search form wala container is invisible, if yes then make it visible
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
    }
    else {
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        //ab main your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first
        //for coordinates, if we haved saved them there.
        getfromSessionStorage();
    }
}

//check if cordinates are already present in session storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    } else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;
    // make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //API CALL
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        const weatherData = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(weatherData);
    }
    catch(err) {
        loadingScreen.classList.remove("active"); 
        // console.log(err);
    }
}

function renderWeatherInfo(weatherData){
    //fistly, we have to fethc the elements 

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    console.log(weatherData);

    //putting data in UI elements


}