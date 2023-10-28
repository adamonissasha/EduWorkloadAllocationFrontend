import React from 'react';
import s from './agree.module.scss'

export default function AgreeWindow({ setActive, fun, text }) {
    return (
        <div onClick={() => setActive(false)} className={s.modal}>
            <div onClick={e => e.stopPropagation()} className={s.modal_content}>
                <h3>{text}</h3>
                <div className={s.buttons}>
                    <button onClick={() => fun()}>Да</button>
                    <button onClick={() => setActive(false)}>Нет</button>
                </div>
            </div>
        </div>
    );
}
