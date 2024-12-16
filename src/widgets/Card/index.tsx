import { clsx } from 'clsx';

import { useAppDispatch, useAppSelector } from "../../hooks";
import { useGetWeatherAtLocationQuery } from "../../redux/weatherApi";
import { removeLocation, toogleFavoriteIcon } from "../../redux/locationSlice";
import { showMessage } from "../../redux/messageSlice";

import styles from './Card.module.css';

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
        <>
            <p className={styles['weather-info']}>
                {cityName}
            </p>
            <p className={styles.temperature}>{(temp <= 0 ? "" : "+") + temp}&deg;</p>
            <p className={styles['weather-info']}>
                Ощущается как {feelsLike}&deg;<br />
                Влажность {humidity}%<br />
                Ветер {Math.round(windSpeed)} м/с<br />
                {description}
            </p>
        </>
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
        dispatch(showMessage({ text: `Удалена локация - ${cityName}`, color: 'red' }));
    }

    const onIsFavoriteChange = () => {
        if (!isFavorite) {
            dispatch(showMessage({ text: `Локация ${cityName} добавлена в избранное`, color: 'blue' }));
        } else {
            dispatch(showMessage({ text: `Локация ${cityName} удалена из избранного`, color: 'blue' }));
        }

        dispatch(toogleFavoriteIcon(id));
    }

    let weatherInfo: any = null;
    const isNight = isSuccess && (data?.weather?.[0]?.icon?.includes('n'));
    const isCloudy = isSuccess && ((data.clouds?.all ?? 0) > 30);

    if (isSuccess) {
        weatherInfo = (
            <WeatherData 
                cityName={cityName}
                description={data?.weather?.[0]?.description ?? ''}
                humidity={data?.main?.humidity ?? 0}
                temp={Math.round(data?.main?.temp ?? 0)}
                windSpeed={data?.wind?.speed ?? 0}
                feelsLike={Math.round(data?.main?.feels_like ?? 0)}
            />
        );
    }
    else {
        if (isLoading)
            weatherInfo = <p>{cityName}<br />Загрузка...</p>;
        else
            weatherInfo = <p>{cityName}<br />Нет данных</p>;
    }

    console.log(styles);

    return (
        <div className={clsx(styles.card, {
            [styles['card-clear-sky-day']]: !isCloudy && !isNight,
            [styles['card-clear-sky-night']]: !isCloudy && isNight,
            [styles['card-cloudy']]: isCloudy, 
        })}>
            {weatherInfo}
            <input
                className={styles.favorite}
                type="checkbox"
                checked={isFavorite}
                onChange={onIsFavoriteChange}
            />
            <button onClick={onRemoveClick} className={styles['button-close']}>
            </button>
        </div>
    )
}

export default Card;