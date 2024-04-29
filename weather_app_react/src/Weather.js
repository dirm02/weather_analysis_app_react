import React, { useState } from 'react';
import Line from './componets/LineChart'
import axios from 'axios';


const API_KEY = '3KAJKHWT3UEMRQWF2ABKVVVZE'
const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/'

const Weather = () => {
    const [city, setCity] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [weatherData, setWeatherData] = useState(null);

    // Zip code for city: K2A1W1
    // const startDate = '2021-10-19T13:59:00'
    // const endDate = '2021-10-19T13:59:00'

    const fetchData = async () => {
        let url = ''
        try {            
            if(endDate){
                url = `${BASE_URL}${city}/${startDate}/${endDate}?key=${API_KEY}`
            }else if(startDate){
                url = `${BASE_URL}${city}/${startDate}?key=${API_KEY}`
            }
            else{
                url = `${BASE_URL}${city}?key=${API_KEY}`
            }
            console.log(url)
            const response = await axios.get(url);
            setWeatherData(response.data);
            console.log(response.data); //You can see all the weather data in console log
        } catch (error) {
            console.error(error);
        }
    };

    // useEffect(() => {
    //     fetchData();
    // }, []);

    const handleZipcodeInputChange = (e) => {
        setCity(e.target.value);
    };
    const handStartDateleInputChange = (e) => {
        setStartDate(e.target.value);
    };
    const handleEndDateInputChange = (e) => {
        setEndDate(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchData();
    };

    let days =[];
    let dates=[];
    let temperatures = [];
    let humidities = [];
    let precipitations = [];
    let windSpeeds = [];
    if(weatherData && weatherData.days){
        days = weatherData.days;
        dates = days.map(day => day.datetime); //! new Date(day.datetime)
        temperatures = days.map(day => day.temp !== undefined ? day.temp : []);
        humidities = days.map(day => day.humidity !== undefined ? day.humidity : []);
        precipitations = days.map(day => day.precip !== undefined ? day.precip : []);
        windSpeeds = days.map(day => day.windspeed !== undefined ? day.windspeed : []);
    }

    return (
        <div className="container">
            <div id="form-container">
                <form onSubmit={handleSubmit}>
                    <input type="text" id="location" name="location" placeholder="Enter the ZipCode"  onChange={handleZipcodeInputChange} required/>
                    <input type="date" id="startDate" name="startDate" onChange={handStartDateleInputChange}/>
                    <input type="date" id="endDate" name="endDate" onChange={handleEndDateInputChange}/>
                    <button type="submit">Weather Forecast and Analysis</button>
                </form>
            </div>
            
            <div className="charts-container">
            {weatherData ?(
                <>
                    <div className="chart">
                        <Line key="temperatureChart" label='Daily Temperature (°C)' weatherData={{xs: dates, ys: temperatures}}/>
                    </div>
                    <div className="chart">
                        <Line key="humidityChart" label='Daily Humidities (%)' weatherData={{xs: dates, ys: humidities}}/>
                    </div>
                    <div className="chart">
                        <Line key="precipitationChart" label='Daily Precipitations (mm)' weatherData={{xs: dates, ys: precipitations}}/>
                    </div>
                    <div className="chart">
                        <Line key="windSpeedChart" label='Daily Wind Speeds (km/h)' weatherData={{xs: dates, ys: windSpeeds}}/>
                    </div>
                </>):
                (<p>No data available...</p>)
            }
            </div>
        </div>
    );
}

export default Weather;