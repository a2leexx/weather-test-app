import { useState } from 'react';

import { useAppSelector, useAppDispatch } from '../../hooks';
import { useLazyGetCityLocationQuery } from '../../redux/weatherApi';

import Search from '../search/search';
import Card from '../card/card';
import './panel.css';
import { addLocation } from '../../redux/locationSlice';

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
            const id = `${cityName}_${lat}_${lon}`;

            dispatch(addLocation({
                id, location: { lat, lon }, cityName, isFavorite: false,
            }));
        }
    };

    let cards: any = locations
        .filter((value) => value.isFavorite || !showOnlyFavorites)
        .map((value) =>
        (
            <div key={`${value.cityName}`}>
                <Card id={value.id} />
            </div>
        ));

    const onShowOnlyFavoritesChanged = () => {
        setShowOnlyFavorites(!showOnlyFavorites);
    }

    if (cards.length === 0) {
        cards = <p>Нет информации для показа.</p>;
    }

    return (
        <div className="panel">
            <h1>Погода в городах</h1>
            <Search onClick={addCard} />
            <p>
                <input className="show-only-favorites"
                    checked={showOnlyFavorites} onChange={onShowOnlyFavoritesChanged}
                    type="checkbox" />
                Показывать только избранное
            </p>
            <div className="container">
                {cards}
            </div>
        </div>
    )
}
