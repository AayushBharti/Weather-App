const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector("[weather-container]");
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
        const userCoordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(userCoordinates);
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
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
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
    const country = document.querySelector("[data-countryId]");
    const desc = document.querySelector("[data-weatherDesc]");
    // const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const tempMax = document.querySelector("[data-tempMax]");
    const tempMin = document.querySelector("[data-tempMin]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");


    console.log(weatherData);

    //fetch values from weatherData object and put it UI elements
    cityName.innerText = `${weatherData?.name},`;

    countryIcon.src = `https://flagcdn.com/144x108/${weatherData?.sys?.country.toLowerCase()}.png`;
    country.innerText = `${weatherData?.sys?.country}`
    desc.innerText = weatherData?.weather?.[0]?.description;
    // weatherIcon.src = `http://openweathermap.org/img/w/${weatherData?.weather?.[0]?.icon}.png`;
    temp.innerText = Math.round(weatherData?.main?.temp);
    tempMax.innerText = `${Math.round(weatherData?.main?.temp_max)} °C`;
    tempMin.innerText = `${Math.round(weatherData?.main?.temp_min)} °C`;
    windspeed.innerText = `${weatherData?.wind?.speed} m/s`;
    humidity.innerText = `${weatherData?.main?.humidity}%`;
    cloudiness.innerText = `${weatherData?.clouds?.all}%`; 
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position) => {
            const userCoordinates = {
                lat: position.coords.latitude,
                lon: position.coords.longitude,
            }

            sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
            fetchUserWeatherInfo(userCoordinates);
        });
    }
    else{
        alert("no geolocation supported");
    }
}


//search ------------------------------------------------------------------
const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName = searchInput.value;
    if(cityName==="") return;
    fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        //hW
    }
}