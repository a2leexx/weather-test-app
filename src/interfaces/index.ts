// информация о местоположении
export interface ILocation {
    lat: number,
    lon: number
}

export interface ICard {
    id: string;
    cityName: string, // название города
    isFavorite: boolean, // в избранных
    location: ILocation, // расположение
}