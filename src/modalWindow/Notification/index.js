import React from 'react';
import s from './notification.module.scss';

export default function Notification({ setActive, text }) {
    return (
        <div className={s.modal}>
            <img src='../../img/close.png' alt='close' onClick={() => setActive(false)}></img>
            <p>{text}</p>
        </div>
    );
}
