import React from 'react';
import s from './centerNotification.module.scss'

export default function AgreeWindow({ setActive, text }) {
    return (
        <div onClick={() => setActive(false)} className={s.modal}>
            <div onClick={e => e.stopPropagation()} className={s.modal_content}>
                <h3>{text}</h3>
                <button onClick={() => setActive(false)}>ОК</button>
            </div>
        </div>
    );
}
