import React from 'react';
import s from './notFound.module.scss'

export default function NotFoundPage() {
    return (
        <div className={s.content}>
            <div className={s.green_block}>
                <h1>404</h1>
            </div>

            <h2>СТРАНИЦА НЕ НАЙДЕНА</h2>
        </div>
    );
}
