import { ICard } from "../../interfaces";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useGetWeatherAtLocationQuery } from "../../redux/weatherApi";
import './card.css';
import { removeLocation, toogleFavoriteIcon } from "../../redux/locationSlice";

// отображает данные о погоде
interface WeatherDataProps {
    cityName: string;
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    description: string;
}

function WeatherData({ cityName, temp, feelsLike, humidity, windSpeed, description }: WeatherDataProps) {
    return (
        <div>
            <p className="weather-info">
                {cityName}
            </p>
            <p className="temperature">{(temp <= 0 ? "" : "+") + temp}&deg;</p>
            <p className="weather-info">
                Ощущается как {feelsLike}&deg;<br />
                Влажность {humidity}%<br />
                Ветер {Math.round(windSpeed)} м/с<br />
                {description}
            </p>
        </div>
    );
}

interface CardProps {
    id: string;
}

// реализует карточку о состоянии погоды в городе
function Card({ id }: CardProps) {
    const { cityName, location, isFavorite }= useAppSelector(state => state.location.find(loc => loc.id === id) ?? ({} as any));
    const { data, isLoading, isSuccess } = useGetWeatherAtLocationQuery(location);
    const dispatch = useAppDispatch();
    
    const onRemoveClick = () => {
        dispatch(removeLocation(id));
    }

    const onIsFavoriteChange = () => {
        dispatch(toogleFavoriteIcon(id));
    }

    let backgroundStyle = 'card';
    let weatherInfo: any = null;

    if (isSuccess) {
        if ((data.clouds?.all ?? 0) < 30) {
            const isNight = data?.weather?.[0]?.icon;
            backgroundStyle += isNight ? " card-clear-sky-night" : " card-clear-sky-day";
        }
        else
            backgroundStyle += " card-cloudy";

        weatherInfo = (
            <WeatherData 
                cityName={cityName}
                description={data?.weather?.[0]?.description ?? ''}
                humidity={data?.main?.humidity ?? 0}
                temp={data?.main?.temp ?? 0}
                windSpeed={data?.wind?.speed ?? 0}
                feelsLike={data?.main?.feels_like ?? 0}
            />
        );
    }
    else {
        backgroundStyle += ' card-clear-sky-day';
        if (isLoading)
            weatherInfo = <p>{cityName}<br />Загрузка...</p>;
        else
            weatherInfo = <p>{cityName}<br />Нет данных</p>;
    }

    return (
        <div className={backgroundStyle}>
            {weatherInfo}
            <input className="favorite" type="checkbox" checked={isFavorite}
                onChange={onIsFavoriteChange} />
            <button onClick={onRemoveClick} className="button-close">
            </button>
        </div>
    )
}

export default Card;