import { createSlice, PayloadAction, nanoid } from "@reduxjs/toolkit";
import { createListenerMiddleware } from "@reduxjs/toolkit";

interface Message {
    text: string;
    color: 'red' | 'blue';
}

interface MessageState extends Message {
    id: string;
    isVisible: boolean;
}

interface MessageSliceState {
    messages: MessageState[];
}

const initialState: MessageSliceState = { messages: [] }; 

const MESSAGE_VISIBILITY_DURATION = 3000;
const MESSAGE_DURATION = 3300;

export const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        showMessage(state, action: PayloadAction<Message>) {
            state.messages.push({
                ...action.payload,
                isVisible: true,
                id: nanoid()
            })
        },
        hideMessage(state, action: PayloadAction<string>) {
            const message = state.messages.find(msg => msg.id === action.payload);

            if (!!message) {
                message.isVisible = false;
            }
        },
        removeMessage(state, action: PayloadAction<string>) {
            state.messages = state.messages.filter(msg => msg.id !== action.payload);
        }
    },
    selectors: {
        selectMessages: (state) => state.messages,
    }
});

export const { showMessage, hideMessage, removeMessage } = messageSlice.actions;

export const { selectMessages } = messageSlice.selectors;

export const messageListenerMiddleware = createListenerMiddleware();

messageListenerMiddleware.startListening({
    actionCreator: messageSlice.actions.showMessage,
    effect: (_, api) => {
        const messageId = messageSlice.selectSlice(api.getState() as any).messages.slice(-1)?.[0]?.id;

        setTimeout(() => {
            api.dispatch(messageSlice.actions.hideMessage(messageId));
        }, MESSAGE_VISIBILITY_DURATION);

        setTimeout(() => {
            api.dispatch(messageSlice.actions.removeMessage(messageId));
        }, MESSAGE_DURATION);
    }
});



