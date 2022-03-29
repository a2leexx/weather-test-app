import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../app/store';

const apiKey = '36790362591b78724725a800f46d738b';

export const enum SkyState { ClearSkyNight, ClearSkyDay, Cloudy };

// информация о местоположении
export interface ILocation {
  lat : number,
  lon : number
}

// погода
export interface IWeather {
  temp : number, // температура
  feelsLike: number, // ощущаемая температура
  humidity: number, // влажность
  lastRequest : number, // когда был сделан последний запрос
  windSpeed : number, // скорость ветра
  description : '', // текстовое описание
  skyState : SkyState; // состояние неба (ясно, облачно)
}

export interface ICard {
  cityName: string, // название города
  isFavorite: boolean, // в избранных
  location : ILocation | null, // расположение
  weather : IWeather | null, // погода
  status : 'pending' | 'success' | 'failed' // статус запроса
}

const initialState : Array<ICard> = [];

// получает информацию о расположении города
const fetchLocation = async (cityName : string) : Promise<ILocation> => {
  const locationUrl = 'https://api.openweathermap.org/geo/1.0/direct'
    + `?q=${cityName}&limit=1&appid=${apiKey}`;
  const response = await fetch(locationUrl);
  const data = await response.json();
  const location = data[0];
  
  return { lat : Number(location.lat), lon : Number(location.lon) }
} 

// классифицирует погоду на облачно/ясно днем/ясно ночью
const getSkyState = (icon : string) : SkyState => {
  if (icon === '01d' || icon === '02d')
    return SkyState.ClearSkyDay;
  
  if (icon == '01n' || icon == '02n')
    return SkyState.ClearSkyNight;
  
  return SkyState.Cloudy;
}

// получает данные о погоде
const fetchWeatherData = async (loc : ILocation) : Promise<IWeather> => {
  const weatherDataUrl = 'https://api.openweathermap.org/data/2.5/weather'
      + `?lat=${loc.lat}&lon=${loc.lon}&appid=${apiKey}&lang=ru`;
  const response = await fetch(weatherDataUrl);
  const data = await response.json();

  console.log(data);

  let weather : IWeather = { temp: Math.round(data.main.temp - 273.15),
    feelsLike : Math.round(data.main.feels_like - 273.15),
    humidity : data.main.humidity,
    lastRequest : Date.now(),
    windSpeed : data.wind.speed,
    description : data.weather[0].description, 
    skyState : getSkyState(data.weather[0].icon)};

  return weather;    
}

// реализация запроса к серверу
export const fetchData = createAsyncThunk<ICard, 
    string, { state: RootState }
>(
  'panel/fetchWeatherData',
  async (cityName: string, { getState }) => {
    const cityInfo = getState().panel.find(v => v.cityName === cityName);
    let result : ICard = { cityName, 
        isFavorite : false, location : null, weather : null, status : 'success'}

    if (cityInfo)
    {
      result.isFavorite = cityInfo.isFavorite;
      result.location = cityInfo.location;
      result.weather = cityInfo.weather;
    }

    if (!result.location)
      result.location = await fetchLocation(cityName);

    if (!result.weather || (Date.now() - result.weather.lastRequest > 1800 * 1000))
      result.weather = await fetchWeatherData(result.location);

    return result;
  }
)

const panelSlice = createSlice({
    name: 'panel',
    initialState,
    reducers: {
      // удаляет карточку с городом
      panelRemoveCard(state, action) {
        return state.filter((v) => {
          return v.cityName != action.payload});
      },
      // добавляет/удаляет в избранные
      panelToogleFavoriteIcon(state, action) {
        let card = state.find((v) => {return v.cityName === action.payload })
        
        if (card)
          card.isFavorite = !card.isFavorite;
      } 
    },
    extraReducers: (builder) => {
      builder
        // обрабатывает успешное выполнение запроса к серверу
        .addCase(fetchData.fulfilled, (state, action) => {
          let card = state.findIndex(v => v.cityName === action.payload.cityName)

          if (card !== -1)
            state[card] = action.payload
          else
            state.push(action.payload);
        })
        // помечает, что ожидается ответ сервера
        .addCase(fetchData.pending, (state, action) => {
          let card = state.findIndex(v => v.cityName === action.meta.arg);

          if (card === -1) {
            state.push({
              cityName: action.meta.arg,
              isFavorite: false, 
              location : null, weather : null, status : 'pending'});
          }
        })
        // обрабатывает ошибку при запросе
        .addCase(fetchData.rejected, (state, action) => {
          let card = state.findIndex(v => v.cityName === action.meta.arg);

          state[card].status = 'failed';
        })
    }
})

export const selectCardList = (state: RootState) => state.panel;

export const { panelRemoveCard, panelToogleFavoriteIcon } = panelSlice.actions;

export default panelSlice.reducer;