const apiKey = '305ed99d42965d6c3750b76aa04a84de'; 
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');

searchBtn.addEventListener('click', getWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeather();
    }
});

async function getWeather() {
    const city = cityInput.value;
    if (!city) return;

    try {
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const currentWeatherResponse = await fetch(currentWeatherUrl);
        const currentWeatherData = await currentWeatherResponse.json();

        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        displayWeather(currentWeatherData);
        displayForecast(forecastData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please try again.');
    }
}

function displayWeather(data) {
    document.getElementById('city').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('date').textContent = new Date().toLocaleDateString();
    document.getElementById('temp').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('weather').textContent = data.weather[0].main;
    document.getElementById('min-temp').textContent = `${Math.round(data.main.temp_min)}°C`;
    document.getElementById('max-temp').textContent = `${Math.round(data.main.temp_max)}°C`;
}

function displayForecast(data) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = '';

    // Get one forecast per day (every 8th item as API returns 3-hour forecasts)
    const dailyForecasts = data.list.filter((forecast, index) => index % 8 === 0);

    dailyForecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const card = document.createElement('div');
        card.classList.add('forecast-card');
        
        card.innerHTML = `
            <div class="forecast-date">${date.toLocaleDateString()}</div>
            <div class="forecast-temp">${Math.round(forecast.main.temp)}°C</div>
            <div class="forecast-weather">${forecast.weather[0].main}</div>
        `;
        
        forecastDiv.appendChild(card);
    });
} 