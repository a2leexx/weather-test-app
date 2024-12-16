import { useEffect, useRef } from 'react';
import { clsx } from 'clsx';

import styles from './Message.module.css';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { selectMessages, removeMessage } from '../../redux/messageSlice';

const MARGIN = 16;

export const Message = () => {
    const messages = useAppSelector(selectMessages);
    const dispatch = useAppDispatch();
    const refs = useRef<{ [key: string]: HTMLElement | null }>({});

    useEffect(() => {
        const handler = () => {
            let bottom = 0;

            messages.forEach((msg) => {
                const el = refs.current?.[msg.id];

                if (!!el) {
                    el.style.transform = `translateY(-${bottom}px)`;
                    bottom += el.getBoundingClientRect().height + MARGIN;
                }
            })
        };

        addEventListener('resize', handler);

        return () => removeEventListener('resize', handler);
    }, [messages]);

    let bottom = 0;

    return (
        <div className={styles.messages}>
            {messages.map((msg, index) => {
                const result = (
                    <div
                        ref={(el) => {
                            refs.current[msg.id] = el;

                            return () => { refs.current[msg.id] = null; };
                        }}
                        style={{
                            opacity: msg.isVisible ? '1' : '0',
                            'transform': `translateY(-${bottom}px)`
                        }}
                        className={clsx(styles.message, styles[msg.color])}
                        key={msg.id}
                        onClick={() => dispatch(removeMessage(msg.id))}
                    >
                        {msg.text}
                    </div>
                );

                const el = refs.current?.[msg.id];

                if (!!el) {
                    bottom += el.getBoundingClientRect().height + MARGIN;
                }

                return result;
            })}
        </div>
    );
}