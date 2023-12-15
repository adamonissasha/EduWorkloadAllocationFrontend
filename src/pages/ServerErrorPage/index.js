import React from 'react';
import s from './serverError.module.scss'

export default function ServerErrorPage() {
    return (
        <div className={s.content}>
            <div className={s.green_block}>
                <h1>500</h1>
            </div>

            <h2>СЕРВЕР НЕ ОТВЕЧАЕТ</h2>
        </div>
    );
}
