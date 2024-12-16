import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ICard } from '../interfaces';

const initialState: Array<ICard> = [];

export const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {
        // удаляет карточку с городом
        addLocation(state, action: PayloadAction<ICard>) {
            state.push(action.payload);
        },
        // удаляет карточку с городом
        removeLocation(state, action: PayloadAction<string>) {
            return state.filter((v) => {
                return v.id !== action.payload;
            });
        },
        // добавляет/удаляет в избранные
        toogleFavoriteIcon(state, action: PayloadAction<string>) {
            let card = state.find((v) => { return v.id === action.payload; })

            if (!!card) {
                card.isFavorite = !card.isFavorite;
            }
        }
    },
})

// export const selectCardList = (state: RootState) => state.panel;

export const { addLocation, removeLocation, toogleFavoriteIcon } = locationSlice.actions;