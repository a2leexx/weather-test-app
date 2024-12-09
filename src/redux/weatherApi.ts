import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

interface Location {
    lat: number;
    lon: number;
}

type GeoAPIResponse = {
    name?: string;
    local_names?: {
        [key: string]: string;
    }
    lat: number;
    lon: number;
    country?: string;
    state?: string;
}[];

type CurrentWeatherAPIResponse = {
    coord: {
        lon: number;
        lan: number;
    };
    weather?: {
        id: number;
        main?: string;
        description?: string;
        icon?: string;
    }[];
    base?: string;
    main?: {
        temp?: number;
        feels_like?: number;
        temp_min?: number;
        temp_max?: number;
        pressure?: number;
        humidity?: number;
        sea_level?: number;
        grnd_level?: number;
    }
    visibility?: number;
    wind?: {
        speed?: number;
        deg?: number;
        gust?: number;
    },
    rain?: {
        '1h'?: number;
    },
    snow?: {
        '1h'?: number;
    },
    clouds: {
        all?: number;
    },
    dt?: number;
    sys?: {
        country?: string;
        sunrise?: number;
        sunset?: number;
    }
    timezone?: number;
}

export const weatherApi = createApi({
    reducerPath: 'weatherApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://api.openweathermap.org' }),
    endpoints: (builder) => ({
        getCityLocation: builder.query<GeoAPIResponse, string>({
            query: (cityName) => `/geo/1.0/direct?q=${cityName}&appid=${OPENWEATHER_API_KEY}`
        }),
        getWeatherAtLocation: builder.query<CurrentWeatherAPIResponse, Location>({
            query: (loc) => `/data/2.5/weather?lat=${loc.lat}&lon=${loc.lon}&appid=${OPENWEATHER_API_KEY}&lang=ru&units=metric`
        })
    })
});

export const { useLazyGetCityLocationQuery, useGetWeatherAtLocationQuery } = weatherApi;