import { useState } from 'react';
import { nanoid } from '@reduxjs/toolkit';

import { useAppSelector, useAppDispatch } from '../../hooks';
import { useLazyGetCityLocationQuery } from '../../redux/weatherApi';

import Search from '../Search';
import Card from '../Card';
import { Checkbox } from '../Checkbox';
import styles from './panel.module.css';
import { addLocation } from '../../redux/locationSlice';
import { showMessage } from '../../redux/messageSlice';

// панель с состоянием погоды в различных городах
export function Panel() {
    const [fetchLocation] = useLazyGetCityLocationQuery();
    const locations = useAppSelector((state) => state.location);
    const dispatch = useAppDispatch();
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

    const addCard = async (cityName: string) => {
        const response = await fetchLocation(cityName);

        if (response.isSuccess) {
            const lat = response.data?.[0]?.lat;
            const lon = response.data?.[0]?.lon;

            const id = `${cityName}_${lat}_${lon}_${nanoid()}`;

            dispatch(addLocation({
                id, location: { lat, lon }, cityName, isFavorite: false,
            }));

            dispatch(showMessage({
                text: `Добавлена новая локация - ${cityName}`,
                color: 'blue',
            }));
        } else {
            dispatch(showMessage({
                text: `Не удалось добавить локацию`,
                color: 'red',
            }));
        }
    };

    let cards: any = locations
        .filter((value) => value.isFavorite || !showOnlyFavorites)
        .map((value) =>
        (
            <div key={`${value.id}`}>
                <Card id={value.id} />
            </div>
        ));

    const onShowOnlyFavoritesChanged = (value: boolean) => {
        setShowOnlyFavorites(value);
    }

    if (cards.length === 0) {
        cards = <p>Нет информации для показа.</p>;
    }

    return (
        <div className={styles.panel}>
            <h1>Погода в городах</h1>
            <Search onClick={addCard} />
            <p>
                <Checkbox value={showOnlyFavorites} onChange={onShowOnlyFavoritesChanged} />
                Показывать только избранное
            </p>
            <div className={styles.container}>
                {cards}
            </div>
        </div>
    )
}
