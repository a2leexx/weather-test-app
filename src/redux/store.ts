import { configureStore, combineSlices, ThunkAction, Action } from '@reduxjs/toolkit';
import { locationSlice } from './locationSlice';
import { weatherApi } from './weatherApi';
import { messageSlice, messageListenerMiddleware } from './messageSlice';

const rootReducer = combineSlices(locationSlice, messageSlice, weatherApi);

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(weatherApi.middleware, messageListenerMiddleware.middleware);
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
