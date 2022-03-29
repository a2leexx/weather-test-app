import { useEffect, useState } from 'react';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  panelRemoveCard,
  panelToogleFavoriteIcon,
  selectCardList,
  ICard,
  fetchData
} from './panelSlice';
import Search from '../search/search';
import Card from '../card/card';
import './panel.css';

// панель с состоянием погоды в различных городах
export function Panel() {
  const cardList = useAppSelector(selectCardList);
  const dispatch = useAppDispatch();
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const addCard = (cityName : string) => {
    // загружаем данные о погоде в городе
    dispatch(fetchData(cityName));
  };

  const removeCard = (cityName : string) => {
    console.log(cityName);
    // удаляем город
    dispatch(panelRemoveCard(cityName));
  }

  const onIsFavoriteChange = (cityName : string) => {
    // добавляем/удаляем из избранных
    dispatch(panelToogleFavoriteIcon(cityName))
  }

  useEffect(() => {
    let timeoutID = setTimeout(() => {
      for (let card of cardList) {
        dispatch(fetchData(card.cityName));
      }
    }, 10000);

    return () => { clearInterval(timeoutID) }
  });

  let cards : any = cardList
    .filter((value: ICard) => value.isFavorite || !showOnlyFavorites)
    .map((value : ICard) => 
    (
      <div key={`${value.cityName}`}>
        <Card cityName={value.cityName} onRemove={removeCard} weather={value.weather}
          isFavorite={value.isFavorite} onIsFavoriteChange={onIsFavoriteChange}
          status={value.status}/>
      </div>
    ));

  const onShowOnlyFavoritesChanged = () => {
    setShowOnlyFavorites(!showOnlyFavorites);
  }

  if (cards.length === 0)
  {
    cards = <p>Нет информации для показа.</p>;
  }

  return (
    <div className="panel">
      <h1>Погода в городах</h1>
      <Search onClick={addCard}/>
      <p>
        <input className="show-only-favorites"
          checked={showOnlyFavorites} onChange={onShowOnlyFavoritesChanged}
          type="checkbox"/>
        Показывать только избранное
      </p>
      <div className="container">
        {cards}
      </div>
    </div>
  )
}
