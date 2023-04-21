import { useEffect, useState } from "react";
import "./App.css";
import logo from "./mlh-prep.png";
import WeatherOverlay from "./components/WeatherOverlay";
import AutoCity from "./components/AutoCity";
import Forecast from './Forecast';
import React from 'react';
import Essentials from "./components/essentials";

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [city, setCity] = useState("");
  const [results, setResults] = useState(null);

  const basename = process.env.REACT_APP_URL;
  const uri = basename + '/api/proxy?api=weather&q=' + city +
    '&units=metric';

  const handleSelect = (suggestion) => {
    setCity(suggestion.name);
  };
  const [containerStyle, setContainerStyle] = useState({
    backgroundImage: `url(/assets/weather-icons/Clouds.svg)`
  });

  useEffect(() => {
    if (city) {
      fetch(uri)
        .then((res) => res.json())
        .then(
          (result) => {
            if (result["cod"] !== 200) {
              setIsLoaded(false);
            } else {
              setIsLoaded(true);
              setResults(result);
            }
          },
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        );
    }
  }, [city, uri]);

  useEffect(() => {
    if (isLoaded && results) {
      setContainerStyle(getContainerStyle(results.weather[0].main));
    }
  }, [isLoaded, results]);

  function getContainerStyle(weather) {
    return { backgroundImage: `url(/assets/weather-icons/${weather}.svg)` };
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  } else {
    return (
      <>
        <img className="logo" src={logo} alt="MLH Prep Logo"></img>
        <div className="container">
          <div className="header">
            <h2>Enter a city below <span role="img" aria-label="emoji">👇</span></h2>
            <AutoCity onSelect={handleSelect} />
          </div>
          <div className="weather-overlay-container">
            <WeatherOverlay style={containerStyle} />
            <div className="results">
              {!isLoaded && <h2>Loading...</h2>}
              {console.log(results)}
              {isLoaded && results && (
                <>
                  <h3>{results.weather[0].main}</h3>
                  <p>Feels like {results.main.feels_like}°C</p>
                  <i><p>{results.name}, {results.sys.country}</p></i>
                  <Forecast city={city} />
                </>)}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default App;
