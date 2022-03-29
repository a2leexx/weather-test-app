import { IWeather, SkyState } from '../panel/panelSlice';
import './card.css';

export interface ICardProps {
  cityName : string,
  weather : IWeather | null,
  isFavorite : boolean,
  onRemove : (cityName : string) => void,
  onIsFavoriteChange : (value : string) => void,
  status : 'failed' | 'success' | 'pending'
}

interface IWeatherData {
  cityName : string,
  weather : IWeather;
}

// отображает данные о погоде
function WeatherData({cityName, weather } : IWeatherData)
{
  let temp = (weather.temp <= 0 ? "" : "+") + weather.temp;
  let feelsLike = (weather.feelsLike <= 0 ? "" : "+") + weather.feelsLike;

  return (
    <div>
      <p className="weather-info">
        {cityName}
      </p>
      <p className="temperature">{temp}&deg;</p>
      <p className="weather-info">
        Ощущается как {feelsLike}&deg;<br/>
        Влажность {weather.humidity}%<br/>
        Ветер {Math.round(weather.windSpeed)} м/с<br/>
        {weather.description}
      </p>
    </div>
  );
}

// реализует карточку о состоянии погоды в городе
function Card({cityName, weather, isFavorite, 
  onRemove, onIsFavoriteChange, status} : ICardProps)
{
  const onRemoveClick = () => {
    onRemove(cityName);
  }

  let backgroundStyle = 'card';
  let weatherInfo : any;
  
  if (weather) {
    if (weather.skyState == SkyState.ClearSkyDay)
      backgroundStyle += " card-clear-sky-day";
    else if (weather.skyState == SkyState.ClearSkyNight)
      backgroundStyle += " card-clear-sky-night";
    else
      backgroundStyle += " card-cloudy";

      weatherInfo = <WeatherData cityName={cityName} weather={weather}/>;
  }
  else {
    backgroundStyle += ' card-clear-sky-day';
    if (status === 'pending')
      weatherInfo = <p>{cityName}<br/>Загрузка...</p>;
    else
      weatherInfo = <p>{cityName}<br/>Нет данных</p>;
  }

  return (
    <div className={backgroundStyle}>
      {weatherInfo}
      <input className="favorite" type="checkbox" checked={isFavorite} 
        onChange={()=>{onIsFavoriteChange(cityName)}}/>
      <button onClick={onRemoveClick} className="button-close">
      </button>
    </div>
  )
}

export default Card;